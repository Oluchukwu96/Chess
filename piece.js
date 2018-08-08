function piece(index,pos,size = 100){
	this.pos = pos;
	this.index = index;
	this.size = size;
	this.img = new Image();
	this.sq = null;
	//function to get the appropriate image for the piece
	this.getImage = function(){
		//white peices
		if(this.index == 1){
			this.img.src = "img/wP.png"
		}
		if(this.index == 3){
			this.img.src = "img/wN.png"
		}
		if(this.index == 4){
			this.img.src = "img/wB.png"
		}
		if(this.index == 5){
			this.img.src = "img/wR.png"
		}
		if(this.index == 9){
			this.img.src = "img/wQ.png"
		}
		if(this.index > 10){
			this.img.src = "img/wK.png"
		}
		//black peices
		if(this.index == -1){
			this.img.src = "img/bP.png"
		}
		if(this.index == -3){
			this.img.src = "img/bN.png"
		}
		if(this.index == -4){
			this.img.src = "img/bB.png"
		}
		if(this.index == -5){
			this.img.src = "img/bR.png"
		}
		if(this.index == -9){
			this.img.src = "img/bQ.png"
		}
		if(this.index < -10){
			this.img.src = "img/bK.png"
		}
	}
	//initialize
	this.getImage();
	
	
	//function
	//update the middle to the center
	this.upmid = function(p){
		var x = p[0] - (this.size/2);
		var y = p[1] - (this.size/2);
		this.pos = [x,y];
		
	}
	//get the center of the piece
	this.getmid = function(){
		var x = this.pos[0] + (this.size/2);
		var y = this.pos[1] + (this.size/2);
		return [x,y];
	}
	this.revert = function(){
		if(this.sq!=null){
			this.upmid(this.sq.getmid());
			this.sq.focused = false;
			this.sq.p = this;
		}
		
	}
	this.move = function(dx,dy){
		this.pos[0]+=dx;
		this.pos[1]+=dy;
	}
	this.draw = function(){
		can.drawImage(this.img,this.pos[0],this.pos[1],this.size,this.size);
	}
}


