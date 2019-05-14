var path = require("path");
var url = require("url");
var express = require("express");
var sqlite3 = require("sqlite3");
var md5 = require("md5");
var WebSocket = require('ws');
var http = require('http');

var app = express();
var port = 8008;

var dbFilename = path.join(__dirname, "data.sqlite3");
var pubDir = path.join(__dirname, "public");
var accounts = [];

app.use(express.static(pubDir));

app.post("/update", (req, res) => {
	var reqUrl = url.parse(req.url);
	var str = reqUrl.query.split("&");
	console.log(str);

	db.run("UPDATE data SET gamesPlayed = ?, score = ?, highTile = ?, wins = ?, av = ? WHERE un = ?", str[2], str[1], str[3], str[4], str[5], str[0], (err, row) =>
	{
		if (err) {console.log(err);}
//		else {console.log(row);}
	});

	db.all("SELECT un, gamesPlayed, score, highTile, wins, av FROM data", (err, rows) => {
		if (err) {console.log(err);}
		else
		{
			console.log(rows);
			res.writeHead(200, {"Content-Type": "application/json"});
			res.write(JSON.stringify(rows));
			res.end();
		}
	});


});

app.get("/login", (req, res) => {
	var reqUrl = url.parse(req.url);
	console.log("in /login");
	var str = reqUrl.query.split("&");
	str[0] = md5(str[0]);

	var resultStr = 'true';


	db.get("SELECT * FROM data WHERE un = ?", [str[1]], (err, row) => {
		if (err) {console.log(err);}
		else if (row == undefined)
		{
			console.log("undefined un");
			resultStr = 'false';
		}
		else
		{
			console.log(row);
			console.log(row.pw);
			console.log(str[0]);
			if (row.pw != str[0])
			{
				resultStr = "false";
			}
		}
		res.writeHead(200, {"Content-Type": "text/plain"});
		res.write(resultStr + ' ' + str[1]);
		res.end();
	});
});

app.get("/register", (req, res) => {
	var reqUrl = url.parse(req.url);
	var str = reqUrl.query.split("&");
	var response;
	str[0] = md5(str[0]);

	db.get("SELECT * FROM data WHERE un = ?", [str[1]], (err, row) => {
		if (err){console.log(err);}
		else{
			if (row != undefined)
			{
				response = "Username has been taken";
				console.log("exists")
			}
			else
			{
				response = "successfuly registered";
				console.log("n'existe pas");
				db.run("INSERT INTO data VALUES(?,?,?,?,?,?)", str[1],'0','0','0','0',str[0], (err) =>
				{
					console.log(err);
				});
			}
			console.log(response);
		}

		res.writeHead(200, {"Content-Type": "text/plain"});
		res.write(response);
		res.end();
	});
});

var db = new sqlite3.Database(dbFilename, sqlite3.OPEN_READWRITE, (err) => {
	if (err) {console.log("Error opening " + dbFilename);}
	else{console.log("Now connected to " + dbFilename);}
});

//var server = app.listen(port);
var server = http.createServer(app);
server.listen(port, '0.0.0.0');
console.log('Now listening on port ' + port);

var wss = new WebSocket.Server({server: server});
var clients = {};
var messArr = [];
var len = 0;

wss.on('connection', (ws) => {
    var client_id = ws._socket.remoteAddress + ":" + ws._socket.remotePort;
    console.log('New connection: ' + client_id);
    len++;
    clients[client_id] = ws;
    for (var j = 0; j<messArr.length; j++) {ws.send(messArr[j]);}

    ws.on('message', (message) => {
	var myMess = JSON.parse(message);
	clients[client_id].room = myMess.room;
	if (!(myMess.newMess == ''))
	{
	        console.log('Message from ' + client_id + ': ' + myMess.newMess + myMess.un + myMess.room);
		var mess = JSON.stringify({'message': myMess.un + ": " + myMess.newMess,  'cSize': len});
		Broadcast(mess, myMess.room)
//		messArr.push(mess);
	}
    });
    ws.on('close', () => {
        console.log('Client disconnected: ' + client_id);
        delete clients[client_id];
	len--;
	Broadcast(JSON.stringify({"message": "", 'cSize': len}));
    });
    Broadcast(JSON.stringify({"message": "", 'cSize': len}));
});

function Broadcast(message, room)
{
	var id;
	for (id in clients) {if (clients.hasOwnProperty(id)) {if(clients[id].room == room){clients[id].send(message);}}}
}
