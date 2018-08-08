//function for selecting the best move available
function brain(){
	this.name = "brain";
	this.board = null;
	this.maxdepth=4;
	this.maxtime = 0;
	this.turn =0;
	this.date = new Date();
	this.istime = false;
	this.moves=[];
	//functions
	//return sorted moves
	this.sort = function(moves,scores){
		var newmoves =[];
		while(moves.length>0){
			var i = this.getbestindex(scores);
			//remove
			newmoves.push(moves[i]);
			moves.splice(i,1);
			scores.splice(i,1);
		}
		return newmoves;
	}
	//return moves with the best scores
	this.getbestmoves = function(moves,scores){
		var ans =[];
		var s = scores[this.getbestindex(scores)];
		for(var i=0;i<scores.length;i++){
			if(scores[i]==s){
				ans.push(moves[i]);
			}
		}
		return ans;
	}
	//get the index of the best value
	this.getbestindex = function(scores){
		if(scores.length==0){
			return null;
		}
		ans=0;
		var max = scores[0];
		for(var i=1;i<scores.length;i++){
			if((this.turn%2==0 && scores[i]>max) || (this.turn%2==1 && scores[i]<max)){
				max = scores[i];
				ans = i;
			}
		}
		return ans;
	}
	//getscores from moves
	this.getscores = function(board,moves){
		var scores = [];
		for(var i=0;i<moves.length;i++){
			board.makemove(moves[i][0],moves[i][1]);
			scores.push(board.getscore());
			board.undo();
			
		}
		return scores;
	}
	this.realscores = function(board,moves){
		var scores = [];
		for(var i=0;i<moves.length;i++){
			board.makemove(moves[i][0],moves[i][1]);
			if(board.turn%2==0){
				//scores.push(this.minmax(board,1));
			}
			else{
				//scores.push(this.alphabeta(board,1));
			}
			//scores.push(this.minmax(board,1));
			scores.push(this.alphabeta(board,1));
			board.undo();
		}
		return scores
	}
	//minmax
	this.minmax = function(board,depth){
		var moves = board.getallmoves();
		var scores =[];
		for(var i=0;i<moves.length;i++){
			board.makemove(moves[i][0],moves[i][1]);
			var ans = 0
			if(depth>=this.maxdepth){
				ans = board.getscore();
			}
			else{
				ans = this.minmax(board,depth+1);
			}
			scores.push(ans);
			board.undo();
		}
		this.turn = board.turn;
		return scores[this.getbestindex(scores)];
		
	}
	//alpha beta pruning
	this.alphabeta = function(board,depth,alpha= -100000,beta=100000,moves=[]){
		if(moves.length==0){
			moves = board.getallmoves();
			//moves = board.alllegalmoves();
			if(board.isstalemate()){
				return 0;
			}
			if(board.checkdraw()){
				return 0;
			}
		}
		var scores =[];
		for(var i=0;i<moves.length;i++){
			if(alpha<beta){
				var id = Math.abs(board.index(moves[i][1]));
				board.makemove(moves[i][0],moves[i][1]);
				var ans =0;
				if(depth>=this.maxdepth || this.checktime() || id>9){
					/*
					var qmoves = board.getquitemoves();
					if(qmoves.length>0){
						ans = this.alphabeta(board,depth+1,alpha,beta,qmoves);
					}
					else{
						ans = board.getscore();
					}
					*/
					ans = board.getscore();
					var md = 0.05*depth;
					if(board.turn%2==1){
						ans-=md;
					}
					else{
						ans+=md;
					}
				}
				else{
					ans = this.alphabeta(board,depth+1,alpha,beta);
				}
				scores.push(ans);
				if(board.turn%2==1){
					if(alpha<ans){
						alpha = ans;
					}
				}
				else{
					if(beta>ans){
						beta= ans
					}
				}
				board.undo();
			}
			else{
				//console.log("prune");
				break;
			}
		}
		if(scores.length==0){
			return 0;
		}
		this.turn = board.turn;
		this.moves.push(moves[this.getbestindex(scores)]);
		return scores[this.getbestindex(scores)];
		
	}
	this.checktime = function(){
		if(!this.istime){
			return false;
		}
		if(this.gettime()>this.maxtime){
			return true;
		}
		return false;
	}
	//play a simple move 
	this.lay = function(board){
		var moves = board.alllegalmoves();
		
		//var scores = this.getscores(board,moves);
		var scores = this.realscores(board,moves);
		this.turn = board.turn;
		moves = this.getbestmoves(moves,scores);
		//alert(scores);
		if(moves.length>0){
			var m = moves[randrange(0,moves.length)];
			return m;
		}
		return null;
	}
	this.gettime = function(){
		var date = new Date();
		return date.getTime();
		
	}
	//
	this.play = function(board, time=1){
		this.istime = true;
		var moves = board.alllegalmoves();
		var depth = 0;
		this.maxdepth =0;
		var scores = this.realscores(board,moves);
		this.maxtime = this.gettime() + (time*1000);
		this.moves=[];
		while(this.gettime()<this.maxtime && !board.gameover){
			depth++;
			this.maxdepth = depth;
			//this.turn = board.turn;
			//moves = this.sort(moves,scores);
			var newscores = this.realscores(board,moves);
			if(this.gettime()<this.maxtime){
				scores = newscores;
			}
			//check if checkmate has been found;
			this.turn = board.turn;
			if(Math.abs(scores[this.getbestindex(scores)])>150){
				break;
			}
		}
		//get best move
		if(!board.gameover && scores.length>0 && this.maxdepth<100){
			this.turn = board.turn;
			console.log("Depth was "+this.maxdepth);
			console.log("Score is "+scores[this.getbestindex(scores)]);
			this.moves.push(moves[this.getbestindex(scores)]);
		}
		
		this.turn = board.turn;
		moves = this.getbestmoves(moves,scores);
		if(moves.length>0){
			var m = moves[randrange(0,moves.length)];
			return m;
		}
		board.gameover = true;
		return null;
	}
	//randrange
	this.randrange = function(start,end){
		var size=end-start;
		var ans=Math.random()*size;
		ans=Math.floor(ans);
		return ans+start;
	}
}


