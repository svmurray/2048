"use strict";
window.onload = function() {
	console.log("js working");
	var app = new Vue(
    {
		el: "#app",
		data: {
			vals: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			dirty: [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
			best: 0,
			current: 0,
			possible: {left: true, right: true, up: true, down: true}
		}
	});

	document.getElementById("newGame").onclick = startGame;

	for(var i = 0; i<2; i++)
	{
		var val = Math.ceil(Math.random() * 2);
		var idx = Math.floor(Math.random() * 16);
		Vue.set(app.vals, idx, val);
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
			if (i>16){console.log("weird case");}
		}
		var val = Math.ceil(Math.random() * 2);
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
						}
					}
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
		app.best = Math.max(app.best, app.current);
		app.current = 0;
		for (var j=0; j<app.vals.length; j++) {app.vals[j] = 0;}
		for(var i = 0; i<2; i++)
		{
			var val = Math.ceil(Math.random() * 2);
			var idx = Math.floor(Math.random() * 16);
			Vue.set(app.vals, idx, val);
		}

	}

	function gameOver()
	{
		if (!(app.possible.left || app.possible.right || app.possible.up || app.possible.down ))
		{
			app.best = Math.max(app.best, app.current);
			console.log(app.possible.up + " " + app.possible.down + " " + app.possible.left + " " + app.possible.right);
    		document.getElementById("gameOver").style.visibility = "visible";
		}
	}

	document.onkeydown = function(event)
	{
		app.dirty = [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false];
		var kc = event.keyCode;
		var arrow = false;
		if (kc == 87 || kc == 38)
		{
			app.possible.up = moveUp(true);
			arrow = true;
		}
		else if (kc == 40 || kc == 83)
		{
			app.possible.down = moveDown(true);
			arrow = true;
		}
		else if (kc == 65 || kc == 37)
		{
			app.possible.left = moveLeft(true);
			arrow = true;
		}
		else if (kc == 68 || kc == 39)
		{
			app.possible.right = moveRight(true);
			arrow = true;
		}
		else	{console.log(event.keyCode + event.key);}
		if (arrow)
		{
		    event.preventDefault();
			app.possible.down = moveDown(false);
			app.possible.up = moveUp(false);
			app.possible.right = moveRight(false);
			app.possible.left = moveLeft(false);
			gameOver();
		}
	}
}
