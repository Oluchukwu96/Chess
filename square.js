//class representing a chessboard
function square(pos,size,color="#CC9F64"){
	this.pos = pos;
	this.color = color;
	this.width = size;
	this.height = size;
	//default colors
	this.color1 = "#CC9F64";
	this.color2 = "#E6D5A8";
	this.index =0;
	this.p = null;
	this.selected = false;
	this.focused = false; //To show the last move that was just made
	
	//function
	//get the center of the square
	this.getmid = function(){
		var x = this.pos[0] + (this.width/2);
		var y = this.pos[1] + (this.height/2);
		return [x,y];
	}
	this.setcolor = function(index){
		if(index ==1){
			this.color = this.color1;
			this.index = 1;
		}
		if(index ==2){
			this.color = this.color2;
			this.index = 2;
		}
	}
	this.collide = function(p){
		var endx = this.pos[0] + this.width;
		var endy = this.pos[1] + this.height;
		if(p[0]>=this.pos[0] && p[0]<=endx){
			if(p[1]>=this.pos[1] && p[1]<=endy){
				return true;
			}
		}
		return false;
	}
	this.draw = function(){
		can.beginPath();
		can.fillStyle=this.color;
		if(this.selected){
			can.fillStyle = "#4ad357";
		}
		if(this.focused){
			can.fillStyle = "#e8e23c";
			if(this.index ==1){
				can.fillStyle = "#ddd83e";
			}
		}
		can.rect(this.pos[0],this.pos[1],this.width,this.height);
		can.fill();
		can.closePath();
	}
}
