var path = require("path");
var url = require("url");
var express = require("express");
var sqlite3 = require("sqlite3");
var md5 = require("md5");

var app = express();
var port = 8008;

var dbFilename = path.join(__dirname, "data.sqlite3");
var pubDir = path.join(__dirname, "public");
var accounts = [];

app.use(express.static(pubDir));

app.get("/user/:un", (req, res) => {
	
	if (err) {console.log(err);}
	else
	{

	}
});

app.post("/update", (req, res) => {
	var reqUrl = url.parse(req.url);
	var str = reqUrl.query.split("&");
	console.log(str);

	db.run("UPDATE data SET gamesPlayed = ?, score = ?, highTile = ?, wins = ? WHERE un = ?", str[2], str[1], str[3], str[4], str[0], (err, row) =>
	{
		if (err) {console.log(err);}
		else {console.log(row);}
	});

	db.all("SELECT un, gamesPlayed, score, highTile, wins FROM data", (err, rows) => {
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
var server = app.listen(port);


var db = new sqlite3.Database(dbFilename, sqlite3.OPEN_READWRITE, (err) => {
	if (err) {console.log("Error opening " + dbFilename);}
	else{console.log("Now connected to " + dbFilename);}
});


/*app.get("/Titles", (req, res) => {
	var req_url = url.parse(req.url);
//	var query = decodeURI(req_url.query).replace(/\*///g, "%");
/*	db.all("SELECT * FROM Titles WHERE primary_title LIKE ?", [query], (err, rows) => {
		if (err){console.log(err);}
		else
		{
			res.writeHead(200, {"Content-Type": "application/json"});
			res.write(JSON.stringify(rows));
			res.end();
		}
	});
});

app.get("/Names", (req, res) => {
	var req_url = url.parse(req.url);
//	var query = decodeURI(req_url.query).replace(/\*///g, "%");
/*	db.all("SELECT * FROM Names WHERE primary_name LIKE ?", [query], (err, rows) => {
		if (err)
		{
			console.log(err);
		}
		else
		{
			res.writeHead(200, {"Content-Type": "application/json"});
			res.write(JSON.stringify(row));
			res.end();
		}
	});
});

app.get('/titles/:tconst', (req, res) => {
	console.log(req.params);
	db.get("SELECT * FROM Titles WHERE tconst = ?", [req.params.tconst], (err, row) => {
		if (err) {console.log(err);}
		else
		{
			res.writeHead(200, {"Content-Type": "application/json"});
			res.write(JSON.stringify(row));
			res.end();
		}
	});
});

app.get('/names/:nconst', (req, res) => {
	console.log(req.params);
	db.get("SELECT * FROM Names WHERE nconst = ?", [req.params.nconst], (err, row) => {
		if (err) {console.log(err);}
		else
		{
			res.writeHead(200, {"Content-Type": "application/json"});
			res.write(JSON.stringify(row));
			res.end();
		}
	});
});*/

