//class representing a chessboard
function chessboard(pos,size){
	this.size = 8; // the default size of the board
	this.pos = pos;
	this.width = size;
	this.height = size;
	this.pieces = [];
	this.squares =[];
	this.current = null; // the current peice that is begin played
	this.AI = new move();
	this.head = new brain();
	this.selected = false;
	this.turn = 0;
	this.mouse = [0,0]; // the position of the mouse in the screen
	this.ratio = 0.9; //piece to square size ratio
	this.maxtime = 2;
	this.currenttime = this.maxtime;
	this.flipped = false;
	this.gameover = false;
	
	this.defpos =[[-5,-3,-4,-9,-45,-4,-3,-5],
				  [-1,-1,-1,-1,-1,-1,-1,-1],
				  [0,0,0,0,0,0,0,0],
				  [0,0,0,0,0,0,0,0],
				  [0,0,0,0,0,0,0,0],
				  [0,0,0,0,0,0,0,0],
				  [1,1,1,1,1,1,1,1],
				  [ 5,3,4,9,45,4,3,5]];
				  
	 /* 
	this.defpos =[[0,-45,0,0,0,0,0,-5],
				  [-1,-1,-1,0,0,0,0,0],
				  [0,0,0,0,0,0,0,0],
				  [0,0,0,0,0,0,0,0],
				  [0,0,0,0,0,0,0,0],
				  [0,0,0,0,0,0,0,0],
				  [0,0,0,0,9,1,1,1],
				  [0,0,0,0,5,0,45,0]];
	*/
				
	//movement functions
	this.mouseup = function(p){
		if(this.current!=null){
			var sq = this.getsquare(this.current,p);
			if(sq==null || sq === this.current.sq){
				this.current.revert();
				this.pieces.push(this.current);
				
			}
			else{
				//make move an AI board
				var p1 = this.getindex(this.current.sq.getmid());
				var p2 = this.getindex(sq.getmid());
				this.AI.makemove(p1,p2);
				//adjust highlighted squares
				this.unfocus();
				sq.focused = true;
				this.current.sq.focused = true;
				//remove piece on square
				if(sq.p!=null){
					this.pieces.splice(this.pieces.indexOf(sq.p),1);
				}
				this.current.upmid(sq.getmid());
				this.castle(this.current,sq);
				this.current.sq = sq;
				sq.p = this.current;
				this.promote(sq); //if necessary
				this.pieces.push(this.current);
				this.turn++;
				//extra stuff
				this.upgrid(this.AI.getgrid());
				this.turn = this.AI.turn;
			}
			this.current = null;
			
		}
		this.mouse = [p[0],p[1]];
		this.unselect();
	}
	this.mousemove = function(p){
		if(this.current!=null){
			var dx = p[0]- this.mouse[0];
			var dy = p[1]- this.mouse[1];
			this.current.move(dx,dy);
		}
		this.mouse = [p[0],p[1]];
	}
	this.mousedown = function(p){
		this.mouse = [p[0],p[1]];
		var sq = this.click(p);
		if(sq!=null){
			if(sq.p!=null){
				this.getmoves(sq);
				sq.focused = true; //highlight square
				this.current = sq.p;
				//remove from board representation
				this.pieces.splice(this.pieces.indexOf(sq.p),1);
				sq.p = null;
			} 
		}
	}
	//promote to queen automatically for now
	this.promote = function(sq){
		if(sq.p!=null && Math.abs(sq.p.index)==1){
			var sign =1;
			if(sq.p.index<0){
				sign =-1;
			}
			var p = this.getindex(sq.getmid());
			if(p[1]==0 || p[1]==7){
				sq.p.index = (9*sign);
				sq.p.getImage();
			}
		}
		
	}
	//castling the king return true if castling occured
	this.castle = function(p,sq){
		if(Math.abs(p.index)>10 && sq.p == null){
			var current = this.getindex(sq.getmid());
			var former = this.getindex(p.sq.getmid());
			var dx = current[0]-former[0];
			if(Math.abs(dx)==2){
				var sign =1;
				var rpos = 7;
				if(dx<0){
					sign = -1;
					rpos = 0;
				}
				var rsq = this.index(rpos,current[1]);
				if(rsq!=null && rsq.p!=null && Math.abs(rsq.p.index)==5){
					//move the rook
					var newrsq = this.index(current[0]-sign,current[1]);
					this.Move(rsq,newrsq);
				}

			}
		}
	}
	//move piece from sq1 to sq2
	this.Move = function(sq1,sq2){
		if(sq1.p!=null && sq2.p==null){
			sq1.p.upmid(sq2.getmid());
			sq2.p = sq1.p;
			sq1.p =null;
			sq2.p.sq = sq2;
		}
	}
	//clear all unhighlight all highlighted squares
	this.unfocus = function(){
		for(var i=0;i<this.squares.length;i++){
			this.squares[i].focused = false;
		}
	}
	//functions init
	this.init = function(){
		this.gameover=false;
		this.clear();
		if(this.flipped){
			this.flip();
		}
		//set up squares
		var count = 1;
		var xwidth = this.width/this.size;
		var ywidth = this.height/this.size;
		for(var y =0;y<this.size;y++){
			for(var x =0;x<this.size;x++){
				var xpos = this.pos[0] + ((xwidth)*x);
				var ypos = this.pos[1] + ((ywidth)*y);
				this.squares.push(new square([xpos,ypos],xwidth));
				//set tile color
				this.squares[this.squares.length-1].setcolor(count+1);
				if(x ==(this.size -1)){
					count=count;
				}
				else if(count ==0){
					count =1;
				}
				else{
					count =0;
				}
			}
		}
		this.initPieces();
		this.AI.turn = this.turn;
		this.AI.grid = this.getgrid();
	}
	this.getgrid = function(){
		var ans = [];
		for(var y =0;y<this.size;y++){
			ans.push([]);
			for(var x =0;x<this.size;x++){
				var sq = this.index(x,y);
				var i =0;
				if(sq.p!=null){
					i = sq.p.index;
				}
				ans[y].push(i);
			}
		}
		return ans;
	}
	this.undo = function(){
		this.AI.undo();
		this.upgrid(this.AI.getgrid());
		this.turn = this.AI.turn;
		this.unfocus();
		var lmove = this.AI.getlastmove();
		if(lmove.length>0){
			var sq1 = this.index(lmove[1][0],lmove[1][1]);
			if(sq1!=null){
				sq1.focused = true;
			}
			var sq2 = this.index(lmove[3][0],lmove[3][1]);
			if(sq2!=null){
				sq2.focused = true;
			}
		}
		
	}
	this.flip = function(){
		var temp = this.flipped;
		this.flipped= false;
		for(var i = 0; i<this.squares.length;i++){
			var ywidth = this.height/this.size;
			var sq = this.squares[i];
			
			var ind = this.getindex(sq.getmid());
			var newy = ((7-ind[1])* ywidth) +this.pos[1];
			if(newy!=sq.pos[1]){
				sq.pos = [sq.pos[0],newy];
			}
			if(sq.p!=null){
				sq.p.upmid(sq.getmid());
			}
		}
		this.flipped = !temp;
		//this.flipped = !this.flipped;
	}
	this.upgrid = function(cells){
		this.pieces = [];
		for(var y =0;y<this.size;y++){
			for(var x =0;x<this.size;x++){
				var sq = this.index(x,y);
				sq.p =null;
				sq.selected = false;
			}
		}
		this.initPieces(cells);
	}
	this.unfocus= function(){
		for(var y =0;y<this.size;y++){
			for(var x =0;x<this.size;x++){
				var sq = this.index(x,y);
				sq.focused = false;
			}
		}
	}
	this.clear = function(){
		this.pieces =[];
		this.squares =[];
		this.turn =0;
		this.pieces = [];
		this.AI = new move();
	}
	//init peices
	this.initPieces = function(p=null){
		if(p==null){
			p = this.defpos;
		}
		for(var y = 0;y<p.length;y++){
			for(var x = 0;x<p[y].length;x++){
				this.addPiece(p[y][x],x,y);
			}
		}
	}
	this.index = function(x,y){
		if(this.flipped){
			//y = 7-y;
		}
		//convert to one dimension
		var i = (y*this.size) + x;
		if(x<0 || y<0 || x>=this.size || y>=this.size){
			return null;
		}
		if(i<this.squares.length){
			return this.squares[i];
		}
		return null;
	}
	this.addPiece = function(i,x,y){
		var sq = this.index(x,y);
		if(sq!=null && i!=0){
			var pi = new piece(i,[100,100],sq.width*this.ratio);
			pi.upmid(sq.getmid());
			pi.sq = sq;
			sq.p = pi;
			this.pieces.push(pi);
		}
		
	}
	this.move = function(p1,p2){
		var sq1 = this.index(p1[0],p1[1]);
		var sq2 = this.index(p2[0],p2[1]);
		if(sq1!=null && sq2!=null){
			this.mousedown(sq1.getmid());
			this.mouseup(sq2.getmid());
		}
	}
	//just play a random move
	this.playrandom = function(){
		this.AI.turn = this.turn;
		this.AI.grid = this.getgrid();
		var moves = this.AI.alllegalmoves();
		if(moves.length>0){
			var m = moves[randrange(0,moves.length)];
			this.move(m[0],m[1]);
		}
		
	}
	//play a move
	this.play = function(t=1){
		if(this.currenttime==0 && !this.gameover){
			this.AI.turn = this.turn;
			this.AI.grid = this.getgrid();
			var m = this.head.play(this.AI,t);
			if(m!=null){
				this.move(m[0],m[1]);
			}
			this.currenttime = this.maxtime;
		}
		else if(this.currenttime>0){
			this.currenttime --;
		}
	}
	this.randrange = function(start,end){
		var size=end-start;
		var ans=Math.random()*size;
		ans=Math.floor(ans);
		return ans+start;
	}
	this.click = function(v){
		//this.unselect();
		var ax = this.width/this.size;
		var ay = this.height/this.size;
		var x =  Math.floor((v[0]-this.pos[0])/ax);
		var y =  Math.floor((v[1]-this.pos[1])/ay);
		if(this.flipped){
			y = 7-y;
		}
		var s = this.index(x,y);
		return s;
		//if(s!=null){
			//s.selected = true;
		//}
	}
	this.getindex = function(v){
		var ax = this.width/this.size;
		var ay = this.height/this.size;
		var x =  Math.floor((v[0]-this.pos[0])/ax);
		var y =  Math.floor((v[1]-this.pos[1])/ay);
		if(this.flipped){
			y = 7-y;
		}
		return [x,y];
	}
	//get new square for piece, return null if there is no good square
	this.getsquare = function(pi,pos){
		var sq = this.click(pos);
		
		//get moves
		if(sq.selected){
			return sq;
		}
		return null;
	}
	//get the right moves for a piece
	this.getmoves = function(sq){
		if(sq.p!=null){
			var pos = this.getindex(sq.getmid());
			//this.AI.turn = this.turn;
			//this.AI.grid = this.getgrid();
			this.selectAll(this.AI.getlegalmoves(sq.p.index,pos));
		}
		
	}
	//select all grids represented
	this.selectAll = function(moves){
		for(var i=0;i<moves.length;i++){
			var sq = this.index(moves[i][0],moves[i][1]);
			sq.selected = true;
		}
		this.selected = true;
	}
	this.unselect = function(){
		for(var i=0;i<this.squares.length;i++){
			this.squares[i].selected=false;
		}
		this.selected = false;
	}
	this.draw = function(){
		
		for(var i=0;i<this.squares.length;i++){
			this.squares[i].draw();
		}
		//the peices should be infront of the squares
		for(var i=0;i<this.pieces.length;i++){
			this.pieces[i].draw();
		}
		//draw the selected piece
		if(this.current!=null){
			this.current.draw();
		}
		
	}
}