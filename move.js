//class to generate chess moves
function move(size=8){
	this.size = size;
	this.grid = [[-5,-3,-4,-9,-45,-4,-3,-5],
				  [-1,-1,-1,-1,-1,-1,-1,-1],
				  [0,0,0,0,0,0,0,0],
				  [0,0,0,0,0,0,0,0],
				  [0,0,0,0,0,0,0,0],
				  [0,0,0,0,0,0,0,0],
				  [1,1,1,1,1,1,1,1],
				  [ 5,3,4,9,45,4,3,5]];
	this.turn = 0;
	this.moves = []; //[i1,pos1,i2,pos2]
	this.gameover = false;
	this.epos = [-1,-1];
	this.castles = [true,true,true,true,0];//castling information
	this.flipped = false;
	this.onlyking = false;//varaible 
	this.lastkpos = [0,0];
	this.leafscore=0;
	
	//functions
	this.isin = function(x,y){
		if(x<0 || x>=this.size){
			return false;
		}
		if(y<0 || y>=this.size){
			return false;
		}
		return true;
	}
	this.getgrid = function(){
		return this.grid;
	}
	//check if the move is outside the scope of the grids 
	this.isoutside = function(pos){
		if(pos[1]<0){
			return true;
		}
		if(pos[0]<0){
			return true;
		}
		if(pos[1]>=this.grid.length){
			return true;
		}
		if(pos[0]>=this.grid[0].length){
			return true;
		}
		
		return false
	}
	this.getmove = function(index,pos,vel,store=[],no=8){
		//do the first loop
		var count =0;
		var conti = true;
		pos = this.add(pos,vel);
		while(count<no && conti){
			if(this.isoutside(pos)){
				conti = false;
			}
			else if((this.grid[pos[1]][pos[0]] < 0 && index >0) || (this.grid[pos[1]][pos[0]] > 0 && index <0)){
				if(Math.abs(index)!=1 || vel[0]!=0){
					store.push(pos);
				}
				conti = false;
			}
			else if(this.grid[pos[1]][pos[0]] == 0){
				store.push(pos);
			}
			else{
				conti = false;
			}
			pos = this.add(pos,vel);
			count++;
		}
		return store;
	}
	this.mequal = function(m1,m2){
		if(m1.length == m2.length){
			if(m1.length>3){
				if(m1[1][0] == m2[1][0] && m1[1][1] == m2[1][1]){
					if(m1[3][0] == m2[3][0] && m1[3][1] == m2[3][1]){
						return true;
					}
				}
			}
		}
		return false;
	}
	//check draw
	this.checkdraw = function(){
		//three fold repetition
		if(this.moves.length>7){
			var m1 = this.moves[this.moves.length-1];
			var m2 = this.moves[this.moves.length-2];
			var m3 = this.moves[this.moves.length-3];
			var m4 = this.moves[this.moves.length-4];
			var m5 = this.moves[this.moves.length-5];
			var m6 = this.moves[this.moves.length-6];
			var m7 = this.moves[this.moves.length-7];
			var m8 = this.moves[this.moves.length-8];
			if(this.mequal(m1,m5)&&this.mequal(m2,m6)){
				if(this.mequal(m3,m7)&&this.mequal(m4,m8)){
					return true;
				}
			}
		}
		return false;
	}
	this.isdraw = function(){
		if(this.castles[4]>=50){
			return "draw by 50 move rule";
		}
		if(this.checkdraw()){
			return "draw by 3 folds repetition";
		}
		if(this.isstalemate()){
			return "stalemate";
		}
		//final check
		var count=0
		for(var y =0;y<this.grid.length;y++){
			for(var x =0;x<this.grid[y].length;x++){
				var index = this.grid[y][x];
				var id = Math.abs(index);
				if(id==3 || id == 4){
					if(count==0){
						count++;
					}
					else if(count>0){
						return null;
					}
				}
				else if(id>0 && id<10){
					return null;
				}
			}
		}
		return "draw by insuffient material";
		
	}
	//return a score for the specific board state
	this.getscore = function(){
		var score =0; 
		//helper variables
		var bcount = [0,0];
		var wpawns = [0,0,0,0,0,0,0,0];
		var bpawns = [0,0,0,0,0,0,0,0];
		var wpos = [0,0,0,0,0,0,0,0];
		var bpos = [0,0,0,0,0,0,0,0];
		var wking = false;
		var bking = false;
		var wqueen = false;
		var bqueen = false;
		var wkpos = [0,0];
		var bkpos = [0,0];
		var wrooks = [];
		var brooks = [];
		var wpcount =0;
		var bpcount = 0;
		
		for(var y =0;y<this.grid.length;y++){
			for(var x =0;x<this.grid[y].length;x++){
				var index = this.grid[y][x];
				var v = Math.abs(index);
				var id = Math.abs(index);
				if(index>1 && index<10){
					wpcount+=id;
					if(id == 9){
						wqueen = true;
					}
					if(id == 5){
						wrooks.push([x,y]);
					}
				}
				if(index<-1 && index>-10){
					bpcount+=id;
					if(id == 9){
						bqueen = true;
					}
					if(id == 5){
						brooks.push([x,y]);
					}
				}
				if(index>9){
					wking = true;
					wkpos = [x,y];
				}
				if(index<-9){
					bking = true;
					bkpos = [x,y];
				}
				if(v==4){
					v = 3;
				}
				//develop
				if(id>1 && id<5){
					if(y!=0 && y!=7){
						v+=0.01;
					}
				}
				//center
				if(id ==1){
					if(x==3 || x==4){
						v+=0.0001;
					}
					if(y==3 || y==4){
						v+=0.001;
						if(x==3 || x==4){
							v+=0.01;
						}
					}
				}
				if(index<0){
					v*=-1;
				}
				score+=v;
				//count bishops
				if(id ==4){
					if(index<0){
						bcount[1]+=1;
					}
					else{
						bcount[0]+=1;
					}
				}
				
				//count pawns
				if(id == 1){
					if(index<0){
						bpawns[x]+=1;
						bpos[x] = y;
					}
					else{
						wpawns[x]+=1;
						wpos[x] = y;
					}
				}
			}
		}
		//check mate
		if(!wking){
			return -200;
		}
		if(!bking){
			return 200;
		}
		//bishops
		if(bcount[0]>1){
			score+=0.5;
		}
		if(bcount[1]>1){
			score-=0.5;
		}
		//double pawns
		for(var a = 0;a<8;a++){
			var sa = 0.15;
			var sb = 0.15;
			if(wpawns[a]>1){
				score-=0.5;
			}
			if(bpawns[a]>1){
				score+=0.5;
			}
			if(!this.isprotected(a,wpawns)){
				sa =0.05;
				score-=0.25;
			}
			if(!this.isprotected(a,wpawns)){
				sb =0.05;
				score+=0.25;
			}
			score+= this.pastscore(wpawns[a],bpawns[a],wpos[a],bpos[a],sa,sb);
			
		}
		//rooks
		if(wrooks.length>1){
			if(this.connectrook(wrooks[0],wrooks[1])){
				score+=0.4
			}
		}
		if(brooks.length>1){
			if(this.connectrook(brooks[0],brooks[1])){
				score-=0.4
			}
		}
		//endgame
		var wkd = this.distance(wkpos,[3.5,3.5])*0.01;
		var bkd = this.distance(bkpos,[3.5,3.5])*0.01;
		if(bpcount<7 || wpcount<7){
			score-=wkd;
			score+=bkd
		}
		else{
			score+=wkd;
			score-=bkd;
		}
		var rd = this.distance(wkpos,bkpos)*0.02;
		if(wpcount<5){
			score+=rd;
		}
		if(bpcount<5){
			score-=rd;
		}
		if(score>0){
			//score-=(wpcount/50);
			//score-=(bpcount/50);
		}
		else if(score<0){
			//score+=(wpcount/50);
			//score+=(bpcount/50);
		}
		return score;
	}
	this.pastscore = function(a,b,ay,by,sa,sb){
		var ans = 0;
		if(a>0 && b>0){
			return ans;
		}
		var diff = a-b;
		if(diff<0){
			ans = -0.1;
			ans-= by*sb;
		}
		else if(diff>0){
			ans = 0.1;
			newy = 7 - ay;
			ans+= newy*sa;
		}
		return ans;
	}
	//scoring functions
	this.isprotected = function(a,pawns){
		var i = a-1;
		var j = a+1;
		if(i>=0 && pawns[i]!=0){
			return true;
		}
		if(j<8 && pawns[j]!=0){
			return true;
		}
	}
	this.norm = function(v){
		if(v>0){
			v=1;
		}
		else if(v<0){
			v=-1;
		}
		return v;
	}
	this.connectrook = function(p1,p2){
		if(p1[0]==p2[0] || p1[1]==p1[1]){
			var vel = [p2[0]-p1[0],p2[1]-p1[1]];
			vel = [this.norm(vel[0]),this.norm(vel[1])];
			var pos = this.add(p1,vel);
			while(!this.isoutside(pos)){
				if(pos[0]==p2[0] && pos[1]==p2[1]){
					return true;
				}
				else if(this.index(pos)!=0){
					return false;
				}
				pos = this.add(pos,vel);
			}
		}
		return false;
	}
	this.distance = function(p1,p2){
		return Math.abs(p1[0]-p2[0]) + Math.abs(p1[1]-p2[1]);
	}
	
	//end
	this.pawneat = function(index,pos,vel,store){
		var newp = this.add(pos,vel);
		var emp = [pos[0]+vel[0],pos[1]];
		if(!this.isoutside(newp)){
			if((this.grid[newp[1]][newp[0]] < 0 && index >0) || (this.grid[newp[1]][newp[0]] > 0 && index <0)){
				store = this.getmove(index,pos,vel,store,1);
			}
			//empassant
			else if((this.grid[emp[1]][emp[0]] < 0 && index >0) || (this.grid[emp[1]][emp[0]] > 0 && index <0)){
				//is it positioned well?;
				if((index>0 && pos[1]==3) || (index<0 && pos[1]==4)){
					var m = this.getlastmove();
					if(m.length>0 && m[3][0] == emp[0] && m[3][1] == emp[1]){
						if(Math.abs(m[1][1]-m[3][1]) == 2){
							store = this.getmove(index,pos,vel,store,1);
						}
					}
				}
			}
			
		}
		return store;
	}
	this.isstalemate = function(){
		if(this.castles[4]>=50){
			return true;
		}
		if(this.hasmove()){
			return false;;
		}
		var store = this.alllegalmoves();
		if(store.length==0){
			var pos = null;
			if(this.turn%2==0){
				pos = this.find(45);
			}
			else{
				pos = this.find(-45);
			}
			if(pos!=null && !this.ischecked(pos)){
				return true;
			}
			
		}
		return false;
	}
	//get index
	this.find = function(id){
		for(var y =0;y<this.grid.length;y++){
			for(var x =0;x<this.grid[y].length;x++){
				var index = this.grid[y][x];
				if(index==id){
					return [x,y];
				}
			}
		}
		return null;
	}
	this.castleadjust = function(p1,p2){
		//king
		if(Math.abs(this.index(p1))>9){
			if(this.index(p1)>0){
				this.castles[0]= false;
				this.castles[1]=false;
			}
			else{
				this.castles[2]= false;
				this.castles[3]=false;
			}
		}
		//rook
		if(Math.abs(this.index(p1))==5){
			if(p1[1]==7){
				if(p1[0]==7){
					this.castles[0]=false;
				}
				else if(p1[0]==0){
					this.castles[1]= false;
				}
			}
			else if(p1[1] == 0){
				if(p1[0]==7){
					this.castles[2]=false;
				}
				else if(p1[0]==0){
					this.castles[3]= false;
				}
			}
		}
	}
	//position of the king where castle info is stored
	this.kingpos = function(pos,vel){
		var ans =0;
		if(pos[1] == 0){
			ans+=2;
		}
		if(vel[0]<0){
			ans+=1;
		}
		return ans;
	}
	this.castle = function(index,pos,vel,store){
		var count = 1;
		if(pos[0]==4 && this.castles[this.kingpos(pos,vel)]){
			var rpos = this.findrook(pos,vel[0]);
			if(rpos!=null){
				if(rpos[0]==0 || rpos[0]==7){
					count = 2;
				}
			}
		}
		return this.getmove(index,pos,vel,store,count);
	}
	//find rook
	this.findrook = function(pos,xdir){
		var vel = [xdir,0];;
		pos = this.add(pos,vel);
		var conti = true;
		while(!this.isoutside(pos) && conti){
			if(Math.abs(this.grid[pos[1]][pos[0]])==5){
				return pos;
			}
			else if(Math.abs(this.grid[pos[1]][pos[0]])!=0){
				return null;
			}
			pos = this.add(pos,vel);
		}
		return null;
	}
	//check if it is the turn of the player to move
	this.checkturn = function(index){
		if(index>0 && this.turn%2==0){
			return true;
		}
		if(index<0 && this.turn%2==1){
			return true;
		}
		return false;
	}
	//check if two numbers have different signs
	this.isdiff = function(n1,n2){
		if(n1<0 && n2>0){
			return true;
		}
		if(n1>0 && n2<0){
			return true;
		}
		return false;
	}
	this.ischeck = function(pos){
		for(var i=0;i<pos.length;i++){
			if(Math.abs(this.index(pos[i]))>11){
				return true;
			}
		}
		return false;
	}
	//if the king is attacked by enemy
	this.ischecked = function(kpos){
		var save = this.turn;
		if(this.index(kpos)>0){
			this.turn=1;
		}
		else{
			this.turn = 0;
		}
		var store = this.getallmoves();
		for(var j =0;j<store.length;j++){
			var npos = [store[j][1]];
			if(this.ischeck(npos)){
				this.turn = save;
				return true;
			}
		}
		
		this.turn=save;
		return false;
	}
	//
	this.legalize = function(index,pos,store){
		var ans = [];
		for(var i=0;i<store.length;i++){
			var s1 = this.index(store[i]);
			this.makemove(pos,store[i]);
			var newstore = this.getallmoves();
			var addto = true;
			var waschecked = false;
			for(var j =0;j<newstore.length;j++){
				//castling check begins
				if(Math.abs(index)>9){
					if(Math.abs(pos[0]-store[i][0])>1){
						var dv = 1;
						if(pos[0]>store[i][0]){
							dv=-1;
						}
						for(var ni=0;ni<Math.abs(pos[0]-store[i][0]);ni++){
							var kpos = [pos[0]+(dv*ni),pos[1]];
							if(kpos[0]==newstore[j][1][0] && kpos[1]==newstore[j][1][1]){
								addto = false;
								break;
							}
						}
						
					}
				}
				//end
				var npos = [newstore[j][1]];
				if(this.ischeck(npos)){
					addto=false;
					break;
				}
			}
			this.undo();
			if(addto){
				ans.push(store[i]);
			}
		}
		return ans;
	}
	this.index = function(p){
		return this.grid[p[1]][p[0]];
	}
	this.update = function(index,p){
		this.grid[p[1]][p[0]] = index;
	}
	this.docastle = function(m){
		var p1 = m[1];
		var p2 = m[3];
		var v = p2[0]-p1[0];
		if(Math.abs(m[0]) > 9 && Math.abs(v)>1 && p1[0] ==4){
			var rx = 7;
			var dr = -1;
			if(v<0){
				rx =0;
				dr =1;
			}
			//update
			var sr = [rx,p2[1]];
			var se = [p2[0]+dr,p2[1]];
			//alert(sr +" "+se);
			if(Math.abs(this.index(sr))==5){
				m.push(this.index(sr));
				m.push(sr);
				m.push(this.index(se));
				m.push(se);
				this.update(this.index(sr),se);
				this.update(0,sr);
			}
			
		}
		return m;
	}
	this.empassant = function(m){
		var p1 = m[1];
		var p2 = m[3];
		var emp = [p2[0],p1[1]];
		var index = m[0];
		if(Math.abs(index)==1 && Math.abs(this.grid[emp[1]][emp[0]])==1){
			if((this.grid[emp[1]][emp[0]] < 0 && index >0) || (this.grid[emp[1]][emp[0]] > 0 && index <0)){
				//is it positioned well?;
				if((index>0 && p1[1]==3) || (index<0 && p1[1]==4)){
					var nm = this.getlastmove();
					if(nm.length>0 && nm[3][0] == emp[0] && nm[3][1] == emp[1]){
						if(Math.abs(nm[1][1]-nm[3][1]) == 2){
							m.push(this.index(emp));
							m.push(emp);
							this.update(0,emp);
						}
					}
				}
			}
		}
		return m
	}
	//make move
	this.makemove = function(p1,p2){
		//store the move first
		var m = [this.index(p1),p1,this.index(p2),p2];
		m = this.empassant(m);
		m = this.docastle(m);// check if castling is c
		m.push(this.castles.slice());//add castling info
		this.moves.push(m);
		if(!this.isoutside(p1) && !this.isoutside(p2)){
			//50 move rule
			if(Math.abs(m[0])==1 || Math.abs(m[2])>0){
				this.castles[4]=0;
			}
			else{
				this.castles[4]++;
			}	
			//end
			this.castleadjust(p1,p2);
			this.update(this.index(p1),p2);
			this.update(0,p1);
			//promote
			if((p2[1]==0 || p2[1]==7) && Math.abs(this.index(p2))==1){
				this.update(9*this.index(p2),p2);
			}
			this.turn++;
		}
	}
	this.undo = function(){
		if(this.moves.length>0){
			var m = this.moves[this.moves.length-1];
			for(var i=0;i<m.length;i+=2){
				if(i<m.length-1){
					this.update(m[i],m[i+1]);
				}
			}
			//retrieve castling info
			this.castles = m[m.length-1];
			this.moves.splice(this.moves.length-1,1);//pop
			this.turn--;
		}
	}
	this.getlastmove = function(){
		if(this.moves.length>0){
			return this.moves[this.moves.length-1];
		}
		return [];
	}
	//get all moves that are available
	this.getallmoves = function(){
		var ans = [];
		var fmove = [];
		for(var y =0;y<this.grid.length;y++){
			for(var x =0;x<this.grid[y].length;x++){
				var index = this.grid[y][x];
				if(index!=0){
					var store = this.getmoves(index,[x,y]);
					for(var i=0;i<store.length;i++){
						if(Math.abs(this.index(store[i]))>0){
							fmove.push([[x,y],store[i]]);
						}
						else if(Math.abs(index)==1 && (store[i][1]==0 || store[i][1]==7)){
							fmove.push([[x,y],store[i]]);
						}
						else{
							ans.push([[x,y],store[i]]);
						}
						
					}
				}
			}
		}
		return this.combine(fmove,ans);
	}
	this.getquitemoves = function(){
		var ans = [];
		var best = 0;
		for(var y =0;y<this.grid.length;y++){
			for(var x =0;x<this.grid[y].length;x++){
				var index = this.grid[y][x];
				if(index!=0){
					var store = this.getmoves(index,[x,y]);
					for(var i=0;i<store.length;i++){
						if(Math.abs(this.index(store[i]))>0){
							ans.push([[x,y],store[i]]);
						}
						else if(Math.abs(index)==1 && (store[i][1]==0 || store[i][1]==7)){
							ans.push([[x,y],store[i]]);
						}
						
					}
				}
			}
		}
		return ans;
	}
	//check if there is aleast i move
	this.hasmove = function(){
		for(var y =0;y<this.grid.length;y++){
			for(var x =0;x<this.grid[y].length;x++){
				var index = this.grid[y][x];
				if(index!=0 && Math.abs(index)<10){
					var store = this.getmoves(index,[x,y]);
					if(store.length>0){
						return true;
					}
				}
			}
		}
		return false;
	}
	this.combine = function(a,b){
		for(var i=0;i<b.length;i++){
			a.push(b[i]);
		}
		return a;
	}
	this.getmoves = function(index,pos,store=[]){
		if(this.checkturn(index)){
			return this.genmoves(index,pos,store);
		}
		return store;
	}
	this.makequite = function(store){
		return [];
		var ans =[];
		var v = null;
		for(var i =0;i<store.length;i++){
			var m = store[i];
			if(Math.abs(this.index(m[1]))>0){
				if(v == null || v<Math.abs(this.index(m[1]))){
					v = Math.abs(this.index(m[1]));
					ans = [m];
				}
				//ans.push(m);
				//return ans;
			}
		}
		return ans;
	}
	
	this.getlegalmoves = function(index,pos,store=[]){
		store = this.getmoves(index,pos,store);
		return this.legalize(index,pos,store);
	}
	//no stalemate
	this.getgoodmoves = function(){
		this.kingonly = true;
		var store = this.getallmoves();
		if(this.kingonly){
			return this.getlegalmoves();
		}
		return store;
	}
	this.carefulscore = function(pos){
		if(this.ischecked(pos)){
			if(this.index(pos)>0){
				return -300
			}
			else if(this.index(pos)<0){
				return 300;
			}
		}
		return 0;
	}
	this.alllegalmoves = function(){
		var ans = [];
		for(var y =0;y<this.grid.length;y++){
			for(var x =0;x<this.grid[y].length;x++){
				var index = this.grid[y][x];
				if(index!=0){
					var store = this.getlegalmoves(index,[x,y]);
					for(var i=0;i<store.length;i++){
						ans.push([[x,y],store[i]]);
					}
				}
			}
		}
		return ans;
	}
	//get all moves a piece can make
	this.genmoves = function(index,pos,store =[]){
		if(Math.abs(index)<10){
			this.kingonly = false;
		}
		//pawns
		if(Math.abs(index) == 1){
			//black
			var count =1;
			var yvel = 1;
			if(index>0){
				yvel = -1;
			}
			//check if the pawn is at the begining
			if(pos[1]==1 && index<0){
				count = 2;
			}
			if(pos[1]==(this.size-2) && index>0){
				count = 2;
			}
			//generate moves
			store = this.getmove(index,pos,[0,yvel],store,count);
			//eating
			var vel = [1,yvel];
			store = this.pawneat(index,pos,vel,store);
			var vel = [-1,yvel];
			store = this.pawneat(index,pos,vel,store);
			
		}
		//knights
		if(Math.abs(index) == 3){
			store = this.getmove(index,pos,[1,2],store,1);
			store = this.getmove(index,pos,[1,-2],store,1);
			store = this.getmove(index,pos,[-1,2],store,1);
			store = this.getmove(index,pos,[-1,-2],store,1);
			store = this.getmove(index,pos,[2,1],store,1);
			store = this.getmove(index,pos,[2,-1],store,1);
			store = this.getmove(index,pos,[-2,1],store,1);
			store = this.getmove(index,pos,[-2,-1],store,1);
		}
		//Bishops
		if(Math.abs(index) == 4){
			store = this.getmove(index,pos,[1,1],store);
			store = this.getmove(index,pos,[1,-1],store);
			store = this.getmove(index,pos,[-1,1],store);
			store = this.getmove(index,pos,[-1,-1],store);
		}
		//Bishops
		if(Math.abs(index) == 5){
			store = this.getmove(index,pos,[1,0],store);
			store = this.getmove(index,pos,[-1,0],store);
			store = this.getmove(index,pos,[0,1],store);
			store = this.getmove(index,pos,[0,-1],store);
		}
		//Queen 
		if(Math.abs(index) == 9){
			store = this.getmove(index,pos,[1,1],store);
			store = this.getmove(index,pos,[1,-1],store);
			store = this.getmove(index,pos,[-1,1],store);
			store = this.getmove(index,pos,[-1,-1],store);
			store = this.getmove(index,pos,[1,0],store);
			store = this.getmove(index,pos,[-1,0],store);
			store = this.getmove(index,pos,[0,1],store);
			store = this.getmove(index,pos,[0,-1],store);
		}
		//King
		if(Math.abs(index) > 10){
			store = this.getmove(index,pos,[1,1],store,1);
			store = this.getmove(index,pos,[1,-1],store,1);
			store = this.getmove(index,pos,[-1,1],store,1);
			store = this.getmove(index,pos,[-1,-1],store,1);
			store = this.getmove(index,pos,[0,1],store,1);
			store = this.getmove(index,pos,[0,-1],store,1);
			//castling things
			store = this.castle(index,pos,[1,0],store);
			store = this.castle(index,pos,[-1,0],store);
		}
		return store;
	}
	this.add = function(pos,vel){
		var x = pos[0]+vel[0];
		var y = pos[1]+vel[1];
		return [x,y]
	}
}
