"use strict";
var ws;

window.onload = function() {

	var app = new Vue(
    {
		el: "#app",
		data: {
			vals: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			dirty: [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
			best: 0,
			current: 0,
			possible: {left: true, right: true, up: true, down: true},
			gamesPlayed: 0,
			highest: 0,
			won: false,
			gameOver: false,
			wonNum: 0,
			login: false,
			mirror: false,
			stats: [],
			un: '',
			activeIdx: 0,
            client_count: 0,
            new_message: "",
            chat_messages: [],
			room: 0

		},
		methods: {
			showUser: function (un)
			{
//				console.log(un);
				for (var i = 0; i< app.stats.length; i++)
				{
					if (un == app.stats[i].un)
					{
//						console.log(app.stats[i]);
						app.activeIdx = i;
					}
				}
			}
		}
	});

	document.getElementById("newGame").onclick = () => {startGame(false);}
	document.getElementById("loginButton").onclick = login;
	document.getElementById("register").onclick = register;	
	document.getElementById("mirror").onclick = mirrorMode;
	document.getElementById("regSub").onclick = createAccount;
	document.getElementById("logout").onclick = logout;
	document.getElementById("av").onlick = selectAvatar;
	document.getElementById("cancel").onclick = cancelReg;

	document.getElementById('av').style.visibility = "hidden";
	document.getElementById("room").onclick = updateRoom;
        startGame(true);
	setInterval(updateStats,10000);

    var port = window.location.port || "80";
    ws = new WebSocket("ws://" + window.location.hostname + ":" + port);
    ws.onopen = (event) => {
        console.log("Connection successful!");
    };
    ws.onmessage = (event) => {
	var dat = JSON.parse(event.data);
        console.log(event.data);
        app.client_count = dat.cSize;
	if (dat.message != "")
	{
		console.log(dat.message);
		app.chat_messages.push(dat.message);
		console.log(app.chat_messages);
	}
    };
function updateRoom()
{
	app.room = document.getElementById('room').value;
	ws.send(JSON.stringify({'newMess': '', 'room': app.room, 'un': app.un}));
	app.chat_messages=[];
}
function SendMessage() {
	var oldRoom = app.room;
	app.room = document.getElementById("room").value;
var messObj = JSON.stringify({'newMess': app.new_message, 'room': app.room, 'un': app.un});
    ws.send(messObj);

	if (oldRoom != app.room) {app.new_message = "";}
}



function selectAvatar(){
	console.log("Selecting Avatar...");
}

function sortData()
{
	var results = [app.stats[0]];
	var idx, curr, j;
	for (var i=1; i<app.stats.length; i++)
	{
		curr = app.stats[i];
		for (j=0; j<results.length; j++)
		{
			idx = j;
			if (curr.score > results[j].score)
			{
				j = results.length+1;
			}
		}
		if(j==results.length) {idx++;}
		results.splice(idx,0,curr);
	}
	app.stats = results.slice(0,10);
//	console.log(app.stats);
}

function updateStats() {
	console.log("/update?" + app.un + "&" + Math.max(app.best, app.current) + "&" + app.gamesPlayed + "&" + app.highest + "&" + app.wonNum);
	$.post("/update?" + app.un + "&" + Math.max(app.best, app.current) + "&" + app.gamesPlayed + "&" + app.highest + "&" + app.wonNum,"", (data, status) => {
		app.stats = data;
		sortData();
	});
}

function logout(){
	if(app.login){
		app.login = false;
		document.getElementById("pers").innerHTML = "You must log in to play.";
		document.getElementById('av').style.visibility = "hidden";
	}
}

    function login(){
	var pwEl = document.getElementById("pw");
	var unEl = document.getElementById("un");
        var empty = !( pwEl.value.length>0 && unEl.value.length>0);
	if (!empty) {
		$.get("/login?" + pwEl.value + "&" + unEl.value, (data) => {
			var str = data.split(" ");
			app.login = (str[0] == "true");
			if (!app.login) {window.alert("Invalid Username or Password");}
			else
			{
				for (var i=0; i<app.stats.length; i++)
				{
					if (app.stats[i].un == str[1])
					{
						app.best = app.stats[i].score;
						app.gamesPlayed = app.stats[i].gamesPlayed;
						app.highest = app.stats[i].highTile;
						app.wonNum = app.stats[i].wins
					}
				}
				app.un = str[1];
				document.getElementById("pers").innerHTML = "Welcome " + str[1] + "! Please begin.";
				document.getElementById('av').style.visibility = "visible";
			}
			pwEl.value = "";
			unEl.value = "";
		});
	}
	else {window.alert("Please enter a username and password");}
    }

function mirrorMode()
{
	startGame(false);
	app.mirror = !app.mirror;
}

function createAccount()
{
	var pw2 = document.getElementById("regPw2");
	var pw = document.getElementById("regPw");
	var un = document.getElementById("regUn");
        var empty = !( pw2.value.length>0 && pw.value.length>0 && un.value.length>0);
	if (!empty) {
		if (pw2.value.trim() == pw.value.trim()) 
		{
			$.get("/register?" + pw.value + "&" + un.value, (data) => {
//				console.log(data);
				if (data.indexOf("cess") >=0)
				{
					app.login = true;
					var el = document.getElementById("registerDiv");
					el.style.zIndex = -2;
					el.style.visibility = "hidden";
					document.getElementById("pers").innerHTML = "Welcome " + un.value + "! Please begin.";
					document.getElementById('av').style.visibility = "visible";
					app.best = 0;
					app.gamesPlayed = 1;
					app.highest = 1;
					app.wonNum = 0;
					app.un = un.value;
				}
				else
				{
					window.alert("That username has already been taken. Please select another.");
				}
				pw2.value = "";
				pw.value = "";
				un.value = "";
			});
		}
		else{window.alert("Passwords must match");}
	}
	else {window.alert("Please enter a username and password");}

}
    
    function register()
    {
//        console.log("Register");
	var el = document.getElementById("registerDiv");
	el.style.zIndex = 2;
	el.style.visibility = "visible";
    }
function cancelReg()
{
	var el = document.getElementById("registerDiv");
	el.style.zIndex = -2;
	el.style.visibility = 'hidden';
}

	function addVal()
	{
		var idx = Math.floor(Math.random() * 16);
		var oneEmpty = false;
		var i =0;
		while(app.vals[idx] != 0 && (i<16 || oneEmpty))
		{
			if(!oneEmpty) {oneEmpty = oneEmpty || app.vals[i] == 0;}
			idx = Math.floor(Math.random() * 16);
			i++;
		}
		var val = 1 + (Math.random() > .9);
		Vue.set(app.vals, idx, val);
	}

	function moveUp(update){
		var idx1;
		var moved = false;
		for (var i = 0; i < 4; i++) {//cols Left to Right
			idx1 = i+4; //get proper (last) index for row
			for (var j = 0; j < 3; j++) {//iterate borrom to top
				for (var k=0; k<=j; k++){
					if (app.vals[idx1+4*(j-k)] > 0 && app.vals[idx1-4+4*(j-k)] == 0){//if there is a value and there isn't a value next to it
						moved = true;
						if (update){
							app.vals[idx1-4+4*(j-k)] = app.vals[idx1+4*(j-k)];
							app.vals[idx1+4*(j-k)] = 0;
						}
					}
					if (app.vals[idx1+4*(j-k)] == app.vals[(idx1+4*(j-k))-4] && app.vals[(idx1+4*(j-k))-4] > 0 && !app.dirty[(idx1+4*(j-k))-4] && !app.dirty[(idx1+4*(j-k))]) {
						moved = true;
						if (update){
							app.vals[(idx1+4*(j-k))-4]++;
							app.current += Math.pow(2, app.vals[(idx1+4*(j-k))-4]);
							app.vals[(idx1+4*(j-k))] = 0;
							app.dirty[(idx1+4*(j-k))-4] = true;
							var old = app.highest;
							app.highest = Math.max(app.highest, app.vals[(idx1+4*(j-k))-4]);
							if (old !=app.highest){if (app.highest == 11){app.wonNum++;} updateStats();}
						}
					}
		            		Vue.set(app.vals, 0, app.vals[0]);
				}
			}
		}
		if(moved && update){addVal();}
		Vue.set(app.vals, 0, app.vals[0]);
		return moved;
	}

	function moveDown(update) {
		var idx1;
		var moved = false;
		for (var i = 0; i < 4; i++) {//cols Left to Right
			idx1 = i+8; //get proper (last) index for row
			for (var j = 0; j < 3; j++) {//iterate bottom to top
				for (var k=0; k<=j; k++){
					if(app.vals[idx1-4*(j-k)] > 0 && app.vals[idx1-4*(j-k)+4] == 0){//if there is a value and there isn't a value next to it
						moved = true;
						if (update){
							app.vals[idx1+4-4*(j-k)] = app.vals[idx1-4*(j-k)];
							app.vals[idx1-4*(j-k)] = 0;
						}
					}
					if (app.vals[idx1-4*(j-k)] == app.vals[(idx1-4*(j-k))+4] && app.vals[(idx1-4*(j-k))+4] > 0 && !app.dirty[(idx1-4*(j-k))+4] && !app.dirty[(idx1-4*(j-k))]){
						moved = true;
						if (update){
							app.vals[(idx1-4*(j-k))+4]++;
							app.current += Math.pow(2, app.vals[(idx1-4*(j-k))+4]);
							app.vals[(idx1-4*(j-k))] = 0;
							app.dirty[(idx1-4*(j-k))+4] = true;
							var old = app.highest;
							app.highest = Math.max(app.highest, app.vals[(idx1-4*(j-k))+4]);
							if (old !=app.highest){if (app.highest == 11){app.wonNum++;} updateStats();}
						}
					}
		            		Vue.set(app.vals, 0, app.vals[0]);
				}
			}
		}
		if(moved && update){addVal();}
		Vue.set(app.vals, 0, app.vals[0]);
		return moved;
	}

	function moveRight(update) {
		var idx1;
		var moved = false;
		for (var i = 0; i < 4; i++){//rows top to bottom
			idx1 = (4*i)+2; //get proper (last) index for row
			for (var j = 0; j < 3; j++) {//iterate left to right
				for (var k=0; k<=j; k++) {//move spot by spot
					if (app.vals[idx1-(j-k)] > 0 && app.vals[(idx1-(j-k))+1] == 0) {//if there is a value and there isn't a value next to it
						moved = true;
						if (update){
							app.vals[(idx1-(j-k))+1] = app.vals[idx1-(j-k)];
							app.vals[idx1-(j-k)] = 0;
						}
					}
					if (app.vals[idx1-(j-k)] == app.vals[(idx1-(j-k))+1] && app.vals[(idx1-(j-k))+1] > 0 && !app.dirty[(idx1-(j-k))+1] && !app.dirty[(idx1-(j-k))]) {
						moved = true;
						if (update){
							app.vals[(idx1-(j-k))+1]++;
							app.current += Math.pow(2, app.vals[(idx1-(j-k))+1]);
							app.vals[(idx1-(j-k))] = 0;
							app.dirty[(idx1-(j-k))+1] = true;
							var old = app.highest;
							app.highest = Math.max(app.highest, app.vals[(idx1-(j-k))+1]);
							if (old !=app.highest){if (app.highest == 11){app.wonNum++;} updateStats();}
						}
					}
		            		Vue.set(app.vals, 0, app.vals[0]);
				}
			}
		}
		if(moved && update){addVal();}
		Vue.set(app.vals, 0, app.vals[0]);
		return moved;
	}

	function moveLeft(update){
		var idx1;
		var moved = false;
		for (var i=0; i<4;i++) {//traverse rows
			idx1 = (4*i) + 1; // o x o o
			for(var j=0; j<3; j++) {//traverse 3 eligbile for movement spots
				for(var k=0; k <= j; k++) {//search the whole way
					if(app.vals[idx1-1+(j-k)] == 0 && app.vals[idx1+(j-k)] > 0) {//Spot to left is empty && this one has a value
						moved = true;
						if (update){
							app.vals[idx1-1+(j-k)] = app.vals[idx1+(j-k)];
							app.vals[idx1+(j-k)] = 0;
						}
					}
					if (app.vals[idx1+(j-k)] == app.vals[(idx1+(j-k))-1] && app.vals[(idx1+(j-k))-1] > 0 && !app.dirty[(idx1+(j-k))-1] && !app.dirty[(idx1+(j-k))]){
						moved = true;
						if (update){
							app.vals[(idx1+(j-k))-1]++;
							app.current += Math.pow(2, app.vals[(idx1+(j-k))-1]);
							app.vals[(idx1+(j-k))] = 0;
							app.dirty[(idx1+(j-k))-1] = true;
							var old = app.highest;
							app.highest = Math.max(app.highest, app.vals[(idx1+(j-k))-1]);
							if (old !=app.highest){if (app.highest == 11){app.wonNum++;} updateStats();}
						}
					}
		            		Vue.set(app.vals, 0, app.vals[0]);
				}
			}
		}
		if(moved && update){addVal();}
		Vue.set(app.vals, 0, app.vals[0]);
		return moved;
	}

	function startGame(force)
	{
		if (force || app.login)
		{
			document.getElementById("gameOver").style.visibility = "hidden";
		        document.getElementById("newGame").style.visibility = "visible";
			document.getElementById("cont").style.zIndex = -2;
			app.best = Math.max(app.best, app.current);
			app.gameOver = false;
			app.current = 0;
			for (var j=0; j<app.vals.length; j++) {app.vals[j] = 0;}
			var i = 0;
			while(i<2)
			{
				var val = Math.ceil(Math.random() * 2);
				var idx = Math.floor(Math.random() * 16);
				if(app.vals[idx] == 0) {i++;}
				Vue.set(app.vals, idx, val);
			}
			app.gamesPlayed++;
			updateStats();
		}
	}

	function gameOver()
	{
		if (!(app.possible.left || app.possible.right || app.possible.up || app.possible.down ))
		{
			app.best = Math.max(app.best, app.current);
    			document.getElementById("gameOver").style.visibility = "visible";
			document.getElementById("newGame2").onclick = () => {startGame(false);}
			document.getElementById("cont").style.zIndex = 2;
			app.gameOver = true;
		        document.getElementById("newGame").style.visibility = "hidden";
			updateStats();
		}

		return app.gameOver;
	}

	document.onkeydown = function(event)
	{
	    app.dirty = [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false];
	    var kc = event.keyCode;
	    var arrow = false;
	    if (((kc == 38 && !app.mirror) || ( kc == 40 && app.mirror)) && app.login)//87
	    {
		    moveUp(true);
		    arrow = true;
	    }
	    else if (((kc == 40 && !app.mirror) || (kc == 38 && app.mirror)) && app.login)//83 || kc == 40)
	    {
		    moveDown(true);
		    arrow = true;
	    }
	    else if (((kc == 37 && !app.mirror) || (kc == 39 && app.mirror)) && app.login)//65 || kc == 37)
	    {
		    moveLeft(true);
		    arrow = true;
	    }
	    else if (((kc == 39 && !app.mirror) || (kc == 37 && app.mirror)) && app.login)//68 || kc == 39)
	    {
		    moveRight(true);
		    arrow = true;
	    }
	    else if (kc == 13 && !app.login) {login();}
	    else if (kc == 13 && app.login)
	    {
		console.log(app.login);
		app.new_message = document.getElementById("messageIn").value;
		console.log("chat" + app.new_message );
		SendMessage();
		document.getElementById("messageIn").value = "";
	    }
	    if (arrow)
	    {
	        event.preventDefault();
	        if (!app.gameOver)
	        {
        		app.dirty = [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false];
			    app.possible.down = moveDown(false);
			    app.possible.up = moveUp(false);
			    app.possible.right = moveRight(false);
			    app.possible.left = moveLeft(false);
			    if (gameOver()){console.log("It's Over");}
		    }
	    }
	}
}
