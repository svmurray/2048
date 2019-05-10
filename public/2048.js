"use strict";
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
			mirror: false
		}
	});

	document.getElementById("newGame").onclick = () => {startGame(false);}
	document.getElementById("loginButton").onclick = login;
	document.getElementById("register").onclick = register;	
	document.getElementById("mirror").onclick = mirrorMode;
	document.getElementById("regSub").onclick = createAccount;
	document.getElementById("logout").onclick = logout;
	
    startGame(true);
updateStats();
function updateStats()
{
	$.post("/update?" + app.best+ "&" + app.gamesPlayed + "&" + app.highest + "&" + app.wonNum,"", (data, status) => {
		console.log(data,status);
	});
}

function logout()
{
	if(app.login)
	{
		app.login = false;
		document.getElementById("pers").innerHTML = "You must log in to play.";
	}
}
    
    function login()
    {
	var pwEl = document.getElementById("pw");
	var unEl = document.getElementById("un");
        var empty = !( pwEl.value.length>0 && unEl.value.length>0);
	console.log(empty + "login");
	if (!empty) {
		$.get("/login?" + pwEl.value + "&" + unEl.value, (data) => {
			var str = data.split(" ");
			app.login = str[0];
			document.getElementById("pers").innerHTML = "Welcome " + str[1] + "! Please begin.";
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
				console.log(data);
				if (data.indexOf("cess") >=0)
				{
					app.login = true;
					var el = document.getElementById("registerDiv");
					el.style.zIndex = -2;
					el.style.visibility = "hidden";
					document.getElementById("pers").innerHTML = "Welcome " + un.value + "! Please begin.";
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
        console.log("Register");
	var el = document.getElementById("registerDiv");
	el.style.zIndex = 2;
	el.style.visibility = "visible";
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
							if (old !=app.highest && app.highest == 11) {app.wonNum++;}
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
							if (old !=app.highest && app.highest == 11) {app.wonNum++;}
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
							if (old !=app.highest && app.highest == 11) {app.wonNum++;}
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
							if (old !=app.highest && app.highest == 11) {app.wonNum++;}
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
	    else if (kc == 13)
	    {
	        login();
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
