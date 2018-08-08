//some global variables
var can; //variable for storing the canvas
//list variables
//pointer variables
var pointer = null;
var dragging = false; //boolean to see if we are dragging a boolean across the screen or not
var last =[0,0]; // th last point clicked on the screen
var board = new chessboard([0,0],500);
//keep track of the x and y positions of the mouse
var mouseX=0;
var mouseY=0;
//timing
var maxtime = 10;
var searchtime = 1;
var playerid = 0;
var hasplayed = false;
var istouching = false;
function setup() {
	var canvas = document.getElementById('game');
	playing=true;
	if(canvas.getContext){
		can = canvas.getContext('2d');
		//calculate variables
		startx=canvas.offsetLeft;
		starty=canvas.offsetTop;
		width=canvas.width;
		height=canvas.height;
	}
	else{
		alert("Your browser doesn't support canvas consider changing your browser")
	}

	//add mouse up event listerner in canvas
	canvas.addEventListener('mouseup', function(event){
		dragging = false;
		mouseX=event.pageX - canvas.offsetLeft;
		mouseY=event.pageY - canvas.offsetTop;
		board.mouseup([mouseX,mouseY]);
	},false);
	//update the mouse position everytime it is moved
	canvas.addEventListener('mousemove', function(event){
		mouseX=event.pageX - canvas.offsetLeft;
		mouseY=event.pageY - canvas.offsetTop;
		board.mousemove([mouseX,mouseY]);
	},false);
	//adding an event listener to our canvas
	canvas.addEventListener('mousedown', function(event) {
        	mouseX=event.pageX - canvas.offsetLeft;
		mouseY=event.pageY - canvas.offsetTop;
		board.mousedown([mouseX,mouseY]);
		//click(x,y);
	}, false);
	//touch events
	canvas.addEventListener('touchend', function(event){
		dragging = false;
		mouseX=event.pageX - canvas.offsetLeft;
		mouseY=event.pageY - canvas.offsetTop;
		//board.mouseup([mouseX,mouseY]);
	},false);
	//update the mouse position everytime it is moved
	canvas.addEventListener('touchmove', function(event){
		mouseX=event.pageX - canvas.offsetLeft;
		mouseY=event.pageY - canvas.offsetTop;
		//board.mousemove([mouseX,mouseY]);
	},false);
	//adding an event listener to our canvas
	canvas.addEventListener('touchstart', function(event) {
        	mouseX=event.pageX - canvas.offsetLeft;
		mouseY=event.pageY - canvas.offsetTop;
		document.getElementById("gamestate").innerHTML = "t";
		if(istouching){
			board.mousedown([mouseX,mouseY]);
		}
		else{
			board.mouseup([mouseX,mouseY]);
		}
		istouching = !istouching;
		//board.mousedown([mouseX,mouseY]);
		//click(x,y);
	}, false);
	board.init();
	tests();
	setInterval(gameloop, 60);
}
//function to click on objects on the screen return false if no click was made
function click(x,y){
	board.click([x,y]);
}
//function to get the mouse position of the canvas
function tests(){
	var tb = new brain();
	//tb.turn = 1;
	var m = [15,23,4,12,8,94,5,6,23,67,95];
	var tmove = new move();
	tmove.grid = board.defpos;
	//alert(tb.sort(m,m.slice()));
	//alert(tb.date.getTime());
	var m1 = [1,[1,1],1,[1,1]];
	var m2 = [1,[1,1],1,[1,1]];
	//alert(board.AI.getscore());
}
//display objects on the screen
function display(text){
	can.font = "70px Arial";
	can.fillStyle="#4af441";
	can.textAlign = "center";//center text at the center of the screen
	can.fillText(text,width/2,height/2);
}
function gameloop(){
	clearScreen();
	//AI play black
	//board.play();
	if(istouching){
		board.mousemove([mouseX,mouseY]);
	}
	if(playerid==0){
		if(board.turn%2==1){
			board.play(searchtime);
			hasplayed = true;
		}
	}
	else if(playerid==1){
		if(board.turn%2==0){
			board.play(searchtime);
			hasplayed = true;
		}
	}
	else{
		board.play(searchtime);
	}
	var te = board.AI.isdraw();
	if(te!=null){
		this.board.gameover= true;
		document.getElementById("gamestate").innerHTML = te;
	}
	var sc =0;
	if(board.AI.alllegalmoves().length==0){
		if(board.turn%2==0){
			sc=-200;
		}
		else{
			sc=200;
		}
	}
	if(sc>150){
		this.board.gameover= true;
		var te = "You lost"
		if(playerid ==0){
			te = "Congratulations! you won!"
		}
		document.getElementById("gamestate").innerHTML = te;
	}
	else if(sc<-150){
		this.board.gameover= true;
		var te = "You lost"
		if(playerid ==1){
			te = "Congratulations! you won!"
		}
		document.getElementById("gamestate").innerHTML = te;
	}
	//draw shapes
	board.draw();
}
function flip(){
	board.flip();
}
function undo(){
	if(!board.gameover){
		board.undo();
		board.undo();
	}
	
}
function playaswhite(){
	board.init();
	playerid=0;
	document.getElementById("gamestate").innerHTML = "...";
	hasplayed = false;
}
function playasblack(){
	board.init();
	playerid=1;
	board.flip();
	document.getElementById("gamestate").innerHTML = "...";
	hasplayed = false;
}
function playeasy(){
	searchtime = 0.25;
	document.getElementById("time").innerHTML = "Search Time: "+searchtime+"s";
	document.getElementById("mode").innerHTML = "Current: Easy";
}
function playmedium(){
	searchtime = 1;
	document.getElementById("time").innerHTML = "Search Time: "+searchtime+"s";
	document.getElementById("mode").innerHTML = "Current: Medium";
}
function playhard(){
	searchtime = 5;
	document.getElementById("time").innerHTML = "Search Time: "+searchtime+"s";
	document.getElementById("mode").innerHTML = "Current: Hard";
}
function clearScreen(){
	//reset screen to normal
	can.clearRect(0,0,width,height);
}
function resetScreen(){
	//board.undo();
	//board.flip();
}
function randrange(start,end){
	var size=end-start;
	var ans=Math.random()*size;
	ans=Math.floor(ans);
	return ans+start;
}


