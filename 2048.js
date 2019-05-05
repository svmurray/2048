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
			highest: 0
		}
	});

	document.getElementById("newGame").onclick = startGame;
	document.getElementById("loginButton").onclick = login;
	document.getElementById("register").onclick = register;
	
    startGame();
    
    function login()
    {
        var empty = document.getElementById("pw").value.length>0 && document.getElementById("un").value.length>0;
    }
    
    function register()
    {
        console.log("Register");
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
							app.highest = Math.max(app.highest, app.vals[(idx1+4*(j-k))-4]);
						}
					}
            		Vue.set(app.vals, 0, app.vals[0]);
				}
        		Vue.set(app.vals, 0, app.vals[0]);
			}
	    	Vue.set(app.vals, 0, app.vals[0]);
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
							app.highest = Math.max(app.highest, app.vals[(idx1-4*(j-k))+4]);
						}
					}
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
							app.highest = Math.max(app.highest, app.vals[(idx1-(j-k))+1]);
						}
					}
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
							app.highest = Math.max(app.highest, app.vals[(idx1+(j-k))-1]);
						}
					}
				}
			}
		}
		if(moved && update){addVal();}
		Vue.set(app.vals, 0, app.vals[0]);
		return moved;
	}

	function startGame()
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

	function gameOver()
	{
		if (!(app.possible.left || app.possible.right || app.possible.up || app.possible.down ))
		{
			app.best = Math.max(app.best, app.current);
    		document.getElementById("gameOver").style.visibility = "visible";
			document.getElementById("newGame2").onclick = startGame;
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
	    if (kc == 38)//87
	    {
		    moveUp(true);
		    arrow = true;
	    }
	    else if (kc == 40)//83 || kc == 40)
	    {
		    moveDown(true);
		    arrow = true;
	    }
	    else if (kc == 37)//65 || kc == 37)
	    {
		    moveLeft(true);
		    arrow = true;
	    }
	    else if (kc == 39)//68 || kc == 39)
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
