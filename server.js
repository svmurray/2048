var path = require("path");
var url = require("url");
var express = require("express");
var sqlite3 = require("sqlite3");
var md5 = require("md5");

var app = express();
var port = 8008;

var dbFilename = path.join(__dirname, "db", "imdb.sqlite3");
var pubDir = path.join(__dirname, "public");


app.use(express.static(pubDir));

console.log(md5("test"));

app.get("/", (req, res) => {
	console.log(req.url);
});

/*var db = new sqlite3.Database(dbFilename, sqlite3.OPEN_READONLY, (err) => {
	if (err)
	{
		console.log("Error opening " + dbFilename);
	}
	else
	{
		console.log("Now connected to " + dbFilename);
	}
});
*/

/*app.get("/Titles", (req, res) => {
	var req_url = url.parse(req.url);
//	var query = decodeURI(req_url.query).replace(/\*///g, "%");
/*	db.all("SELECT * FROM Titles WHERE primary_title LIKE ?", [query], (err, rows) => {
		if (err)
		{
			console.log(err);
		}
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

var server = app.listen(port);
