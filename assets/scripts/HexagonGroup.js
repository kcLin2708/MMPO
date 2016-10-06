cc.Class({
    extends: cc.Component,

    properties: {
        gridSizeX: 0,
        gridSizeY: 0,
        
        hexagon: {
            default: null,
           type: cc.Prefab,
        },
        
        police: {
            default: null,
            type: cc.Prefab,
        },

  

    },

    // initialize the hexagon grid
    onLoad: function () {
        
        this.reset();
  
    },
            
    reset:function(){

        this.player = this.game.player;
        this.running = false;
        this.playerHasMoved = false;
        this.setInputControl();
        
        this.level_base = [];
        this.level_overlay = [];
        
        this.policemen = [];
        
        this.playerCol = 2;
        this.playerRow = 0; 
        this.playerMove = true;
        this.playerSlide = false;

        this.hexagonArray = [];
        this.hexagonWidth = 64;  
        this.hexagonHeight = 64; 
        this.minRow = 0;
        
        this.player = cc.instantiate(this.game.playerPrefab);
        this.player.getComponent('Player').game = this.game;
        this.player.getComponent('Player').setSpriteFrame();
        this.node.removeChild(this.player); 
        
         //initialize hexagons
        this.hexGroup = new cc.Node();
        this.hexGroup.setAnchorPoint(cc.p(0,1))
        this.hexGroup.setPosition(cc.p(0,0));
        this.node.addChild(this.hexGroup);  
        this.hexGroup.x += this.hexagonWidth/2 + (480 - this.gridSizeX*this.hexagonWidth)/2 ;
        this.hexGroup.y -= this.hexagonHeight - 20 ;
        
        this.generateRandomRows(this.gridSizeY*2, this.gridSizeX);
        
        for(var i = 0; i < this.gridSizeY; i ++){
               this.addHexagonRow(i);
        }
        this.hexGroup.addChild(this.player);
        
        // initialize player
        this.player.getComponent('Player').group = this;
        var markerX = (this.hexagonWidth * (2 * this.playerCol + 1 + this.playerRow % 2) / 2) - this.hexagonWidth / 2;
        var markerY = (this.hexagonHeight * (3 * - this.playerRow + 1) / 4) + 64/4;
        this.markerStartPosition = cc.p(markerX, markerY);
        this.player.setPosition(this.markerStartPosition);
        this.player.setLocalZOrder(1000);

        // initialize input
        this.leftDown = false;
        this.rightDown = false;
        this.canStepLeft = false;
        this.canStepRight = false;
        
    },


    start: function(){
        cc.log("Start");
        setInterval(this.movePolice.bind(this),2000);
    },


    startGame:function(){
        
        if(!this.running){
            this.running = true;
            this.checkNextSteps();
        }
        
    },

    stop:function(){
        this.running = false;
    },
    
    addHexagonRow: function(i){

        this.hexagonArray[i] = [];
        
        var columnLength = this.gridSizeX;

        if(i % 2 == 1 ){
            columnLength -=  1;
        }
  
     	for(var j = 0; j < columnLength; j ++){
            
            var hexagonX = this.hexagonWidth * j + (this.hexagonWidth / 2) * (i % 2);
            var hexagonY = this.hexagonHeight * -i / 4 * 3;	
            
            var newHexagon = cc.instantiate(this.hexagon);
            
            newHexagon.getComponent('Hexagon').group = this;
            newHexagon.getComponent('Hexagon').row = i;
            newHexagon.getComponent('Hexagon').col = j;
            newHexagon.getComponent('Hexagon').setSpriteFrame(this.getFrameFromId(this.level_base[i][j]));
            
            var overlay = this.getFrameFromId(this.level_overlay[i][j]);
            
            //initialize Police
            if (overlay==='Polizist'){
                cc.log("police");
                var policeman = cc.instantiate (this.police);
                policeman.getComponent('Polizist').group = this;
                policeman.getComponent('Polizist').row = i;
                policeman.getComponent('Polizist').col = j;
                policeman.setLocalZOrder(100);
                policeman.setPosition(cc.p(hexagonX, hexagonY+32));
                
                this.policemen.push(policeman);
                this.hexGroup.addChild(policeman);
            }else{
                newHexagon.getComponent('Hexagon').setOverlay(this.getFrameFromId(this.level_overlay[i][j]));
            }
            
            newHexagon.setPosition(cc.p(hexagonX,hexagonY));     
     		this.hexagonArray[i][j] = newHexagon;
     		this.hexGroup.addChild(newHexagon);	
            
     	}

    },
    
    generateRandomRows:function(rows, columns){
  
        //building viable ground layer
        var rows_ground = [];
        var columns_ground = [];
        
        //building overlay layer
        var rows_overlay = [];
        var columns_overlay = [];

        var self = this;
        
        
        //Ground layer: distribution of normal and fatal tiles
        var maxOtherCube = 1;
        var maxjailperRpw = 1;
        for(var i = 0; i<rows; i++){
            var columnLength = columns;
            
            if(i % 2 == 1 ){
                columnLength -=  1;
            }
            var jailperRow = 0;
            var otherCube = 0;
            for(var j = 0; j < columnLength; j ++){                

                if (i % 2 === 0 ){
                    columns_ground[j] = 1;
                    
                }else {
                    var r = Math.random(); 
                    if(r < 0.4 && jailperRow < maxjailperRpw && columns_ground[j]!=8 ){
                        columns_ground[j] = 8; 
                        jailperRow += 1;
                    }else if( r >= 0.95 && otherCube < maxOtherCube){
                        columns_ground[j] = 2;
                        otherCube += 1;

                    }else{
                        columns_ground[j] = 1;
                    }
                }
                
            }
            rows_ground[i] = columns_ground;
            columns_ground = [];
            
        }
     
       
        //initialize overlays
        var maxPolizeiPerRow = 1; 
        var maxbeilperRow = 1;

        for(var k = 0; k<rows; k++){

            var columnLength = columns;
            if(k % 2 == 1 ){
                columnLength -=  1;
            }

            var PolizeiPerRow = 0;
            var beilperRow = 0;

            for(var l = 0; l<columnLength; l++){
               
                columns_overlay[l] = 0; 

                var rand = Math.random();
                if(rand < 0.4){ 
                    if(k > 0 && k % 2 == 1 && rows_ground[k][l] == 1 && PolizeiPerRow < maxPolizeiPerRow && columns_ground[j]!=8 ){
                        if(l < 0.4  && l < columnLength){
                            if(columns_overlay[l-1] != 4){
                                columns_overlay[l] = 9;
                                PolizeiPerRow++;
                            }
                        } 
                    }
                }
                
                else if(rand >= 0.4 && rand < 0.85){
                    if(k > 0 && k % 2 == 0 && (rows_ground[k][l] == 1 || rows_ground[k][l] == 2 && beilperRow < maxbeilperRow)){                        
                        if(Math.random() < 0.4 ){

                                cc.log(maxbeilperRow);
                                cc.log(beilperRow);
                                columns_overlay[l] = 11;
                                beilperRow++;
                     
                        }
                    }
                }else{
                    
                    if(k > 0 && rows_ground[k][l] != 0 && rows_ground[k][l] != 8){
                        //flipped, trap, sticky...
                        var rand2 = Math.random();
                        if(rand2 <= 0.3){
                            columns_overlay[l] = 11;
                        }
                        else if(rand2 > 0.3 && rand2 <= 0.55){
                            columns_overlay[l] = 6;
                        }else if(rand2 > 0.55 && rand2 <= 0.85){
                            columns_overlay[l] = 10;
                        }else if(rand2 > 0.85 && rand2 <= 0.9){
                            columns_overlay[l] = 13;
                        }
                        else if(rand2 > 0.9 && rand2 <= 0.95){
                            columns_overlay[l] = 12;
                        }
                        else if(rand2 > 0.95 && rand2 <= 1){
                            columns_overlay[l] = 7;
                        }
                        
                    } 
                }    
   
            }
            rows_overlay[k] = columns_overlay;
            columns_overlay = [];
        }

        
        //Bloodcube
        var length1 = this.getRandomArbitrary(2,7);
        var offsetX1 = this.getRandomArbitrary(1,3);
        var offsetY1 = this.getRandomArbitrary(1,13);
        

        for(var u = 0; u<length1;u++){
            if(u==0){
                rows_ground[offsetY1+u][offsetX1] = 4;
                //rows_overlay[offsetY1+u][offsetX1] = 3;
            }
            else if((offsetY1+u)%2 == 0){
                rows_ground[offsetY1+u][offsetX1] = 3;
                //rows_overlay[offsetY1+u][offsetX1] = 32;
            }else{
                rows_ground[offsetY1+u][offsetX1] = 5;
                //rows_overlay[offsetY1+u][offsetX1] = 31;
            }

        }

    
        this.level_base = this.level_base.concat(rows_ground);
        this.level_overlay = this.level_overlay.concat(rows_overlay);
        
    },
    
    // Gibt eine Zufallszahl zwischen min (inklusive) und max (exklusive) zurück
    getRandomArbitrary: function(min, max) {
        return Math.round( Math.random() * (max - min) + min);
    },
    
    getFrameFromId: function(id){
        var result = "";
        switch(id){
            
            case 1:
                result = "isocube";
                break;
            case 2:
                result = "othercube";
                break;
            case 3:
                result = "bloodcube_2";
                break;
            case 4:
                result = "bloodcube_1";
                break;
            case 5:
                result = "bloodcube_3";
                break;
            case 6:
                result = "bombe";
                break;
            case 7:
                 result = "Trump";
                 break;
            case 8:
                result= "jail";
                break;     
            case 9:
                result= "Polizist";
                break;     
            case 10:
                result = "gun";
                break;
            case 11:
                result = "beil";
                break;
            case 12:
                result = "Alien";
                break;
            case 13:
                result = "Wiesnbiatch";
                break;

            default:
                result = "none";
        }
        return result;
 
    },
    
    setInputControl: function () {

        var self = this;
        
        // add keyboard event listener
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            
            onKeyPressed: function(keyCode, event) {
                
                if(self.game.gameState !== self.game.GameState.Run){
                    return;
                }
                if(!self.running && !self.playerHasMoved){
                    self.startGame();
                }

                switch(keyCode) {
                    case cc.KEY.a:
                        
                        self.leftDown = true;
                        self.rightDown = false;
                        if(!self.playerHasMoved){
                           self.playerHasMoved = true;
                        }if(self.game.flipped){
                            self.leftDown = false;
                            self.rightDown = true;
                        }
                        break;
                    case cc.KEY.d:

                        self.leftDown = false;
                        self.rightDown = true;
                        if(!self.playerHasMoved){
                           self.playerHasMoved = true;
                        }
                        if(self.game.flipped){
                            self.leftDown = true;
                            self.rightDown = false;
                        }
                        break;
                }
            },
            
            onKeyReleased: function(keyCode, event) {
                switch(keyCode) {
                    case cc.KEY.a:
                        self.leftDown = false;
                        if(self.game.flipped){
                            self.rightDown = false;
                        }
                        break;
                    case cc.KEY.d:
                        self.rightDown = false;
                        if(self.game.flipped){
                            self.leftDown = false;
                        }
                        break;
                }
            }
        }, self.node);
    },
    
    checkNextSteps: function(){
        
        var posX = this.playerCol;
        var posY = this.playerRow;


        this.canStepLeft = true;
        this.canStepRight = true;


        /*if(posY % 2 == 1){
            this.canStepLeft = this.hexagonArray[(posY+1)][posX].getComponent('Hexagon').canStepOverlay();
            this.canStepRight = this.hexagonArray[(posY+1)][posX+1].getComponent('Hexagon').canStepOverlay();     
        }else{
            if(this.playerCol == 4){
                this.canStepRight = false;
                this.canStepLeft = this.hexagonArray[(posY+1)][(posX-1)].getComponent('Hexagon').canStepOverlay();
            }else if(this.playerCol == 0){
                this.canStepLeft = false;
                this.canStepRight = this.hexagonArray[(posY+1)][(posX)].getComponent('Hexagon').canStepOverlay();
            }else{
                this.canStepLeft = this.hexagonArray[(posY+1)][(posX-1)].getComponent('Hexagon').canStepOverlay();
                this.canStepRight = this.hexagonArray[(posY+1)][(posX)].getComponent('Hexagon').canStepOverlay();
            }    
        }*/
    },
    
    //move player
    placeMarker: function(posX, posY, left){
        
        this.playerMove = false;

        this.playerCol = posX;	
        this.playerRow = posY;

	    var nextX = (this.hexagonWidth * (2 * posX + 1 + posY % 2) / 2)  - this.hexagonWidth/2;
		var nextY = this.hexagonHeight * (3 * -posY + 1) / 4  + 64/4; // + (80-57)/2;

        this.player.getComponent('Player').move(nextX, nextY, left);

//this.policemen[0].getComponent('Polizist').move(nextX, nextY, left);

	},

     movePolice: function(){

       //cc.log(this.policemen.length);

        for(var i = 0; i < this.policemen.length; i++){
            
            var col = this.policemen[i].getComponent('Polizist').col;
            var row = this.policemen[i].getComponent('Polizist').row;
            //cc.log(this.policemen[i])
            //cc.log("position: "+row +", "+col);
           
            // right
            var leftUpX = col - (1 - row % 2);
            var leftUpY = row -1;

            var rightUpX = col + (row % 2);
            var rightUpY = row -1;

            //left
            var leftDownX = col - (1 - row % 2);
            var leftDownY = row + 1; 

            var rightDownX = col + (row % 2);
            var rightDownY = row + 1;

            //Left and right possible?
            var canStepLeft = false;
            var canStepRight = false;

            var canStepLeftUp = false;
            var canStepRightUp = false;

            var nextLeftUp = this.level_overlay[leftUpY][leftUpX];
            canStepLeftUp = this.canPoliceStep(nextLeftUp);

            var nextRightUp = this.level_overlay[rightUpY][rightUpX];
            canStepRightUp = this.canPoliceStep(nextRightUp);

            var nextLeft = this.level_overlay[leftDownY][leftDownX];
            canStepLeft = this.canPoliceStep(nextLeft);

            var nextRight = this.level_overlay[rightDownY][rightDownX];
            canStepRight = this.canPoliceStep(nextRight);

            if(leftDownX < 0){
                canStepLeft = false;
            }

            var rowLength = 4;
            if(this.policemen[i].getComponent('Polizist').row % 2 == 0){
                rowLength -= 1;
            }
            if(rightDownX > rowLength){
                canStepRight = false;
            }   

            if(leftUpX < 0){
                canStepLeftUp = false;
            }
            if(rightUpX > rowLength){
                canStepRightUp = false;
            }

            //decision if left or right
            var left = true;
            
            if(Math.random() > 0.5 ){
                left = false;
            }


            if(left){
                if(canStepLeft){
                    var nextX = (this.hexagonWidth * (2 * leftDownX + 1 + leftDownY % 2) / 2)  - this.hexagonWidth/2;
                    var nextY = this.hexagonHeight * (3 * -leftDownY + 1) / 4  + 64/4;
                    this.policemen[i].getComponent('Polizist').move(nextX, nextY, left);
                    this.policemen[i].getComponent('Polizist').col = leftDownX;
                    this.policemen[i].getComponent('Polizist').row = leftDownY; 
                    //this.policemen[i].getComponent('Polizist').canMove = false; 
                }else if(!canStepLeft && canStepRight){
                    var nextX = (this.hexagonWidth * (2 * rightDownX + 1 + rightDownY % 2) / 2)  - this.hexagonWidth/2;
                    var nextY = this.hexagonHeight * (3 * -rightDownY + 1) / 4  + 64/4;  
                    this.policemen[i].getComponent('Polizist').move(nextX, nextY, left);
                    this.policemen[i].getComponent('Polizist').col = rightDownX;
                    this.policemen[i].getComponent('Polizist').row = rightDownY;
                    //this.policemen[i].getComponent('Polizist').canMove = false;
                }else if(canStepLeftUp){
                    var nextX = (this.hexagonWidth * (2 * leftDownX + 1 + leftDownY % 2) / 2)  - this.hexagonWidth/2;
                    var nextY = this.hexagonHeight * (3 * -leftDownY + 1) / 4  - 64/4;
                    this.policemen[i].getComponent('Polizist').move(nextX, nextY, left);
                    this.policemen[i].getComponent('Polizist').col = leftUpX;
                    this.policemen[i].getComponent('Polizist').row = leftUpY; 
                    //this.policemen[i].getComponent('Polizist').canMove = false; 
                }else if(!canStepLeftUp && canStepRightUp){
                    var nextX = (this.hexagonWidth * (2 * rightDownX + 1 + rightDownY % 2) / 2)  - this.hexagonWidth/2;
                    var nextY = this.hexagonHeight * (3 * -rightDownY + 1) / 4  - 64/4;  
                    this.policemen[i].getComponent('Polizist').move(nextX, nextY, left);
                    this.policemen[i].getComponent('Polizist').col = rightUpX;
                    this.policemen[i].getComponent('Polizist').row = rightUpY;
                    //this.policemen[i].getComponent('Polizist').canMove = false;

                }
                
            }else if (!left){
                if(canStepRight){
                    var nextX = (this.hexagonWidth * (2 * rightDownX + 1 + rightDownY % 2) / 2)  - this.hexagonWidth/2;
                    var nextY = this.hexagonHeight * (3 * -rightDownY + 1) / 4  + 64/4;  
                    this.policemen[i].getComponent('Polizist').move(nextX, nextY, left);
                    this.policemen[i].getComponent('Polizist').col = rightDownX;
                    this.policemen[i].getComponent('Polizist').row = rightDownY;
                    //this.policemen[i].getComponent('Polizist').canMove = false; 
                }else if(!canStepRight && canStepLeft){
                    var nextX = (this.hexagonWidth * (2 * leftDownX + 1 + leftDownY % 2) / 2)  - this.hexagonWidth/2;
                    var nextY = this.hexagonHeight * (3 * -leftDownY + 1) / 4  + 64/4;
                    this.policemen[i].getComponent('Polizist').move(nextX, nextY, left);
                    this.policemen[i].getComponent('Polizist').col = leftDownX;
                    this.policemen[i].getComponent('Polizist').row = leftDownY; 
                    //this.policemen[i].getComponent('Polizist').canMove = false; 
                }else if(canStepRightUp){
                    var nextX = (this.hexagonWidth * (2 * rightDownX + 1 + rightDownY % 2) / 2)  - this.hexagonWidth/2;
                    var nextY = this.hexagonHeight * (3 * -rightDownY + 1) / 4  - 64/4;  
                    this.policemen[i].getComponent('Polizist').move(nextX, nextY, left);
                    this.policemen[i].getComponent('Polizist').col = rightDownX;
                    this.policemen[i].getComponent('Polizist').row = rightDownY;
                    //this.policemen[i].getComponent('Polizist').canMove = false;
                }else if(!canStepRightUp && canStepLeftUp){
                    var nextX = (this.hexagonWidth * (2 * leftDownX + 1 + leftDownY % 2) / 2)  - this.hexagonWidth/2;
                    var nextY = this.hexagonHeight * (3 * -leftDownY + 1) / 4  - 64/4;
                    this.policemen[i].getComponent('Polizist').move(nextX, nextY, left);
                    this.policemen[i].getComponent('Polizist').col = leftDownX;
                    this.policemen[i].getComponent('Polizist').row = leftDownY; 
                    //this.policemen[i].getComponent('Polizist').canMove = false; 
                }
            }
        }    

        this.checkPoliceCollision();
    },

    canPoliceStep:function(next){
        var result = true;
        switch(next){ 
                    case 9: result=false; break;
                    case 6: result=false; break;
                    case 7: result=false; break;
                    case 10: result=false; break;
                    case 11: result=false; break;
                    case 12: result=false; break;
                    case 14: result=false;  break;
                }
        //cc.log(result);        
        return result;        
    },
	
	moveFinished: function(){
        this.hexagonArray[this.playerRow][this.playerCol].getComponent('Hexagon').checkAction();
	    this.playerMove = true; 
	    
	    if(this.gridSizeY - this.playerRow < 8){
            this.addHexagonRow(this.gridSizeY);
            this.gridSizeY ++;
        }
          
        if(this.gridSizeY > 9 && (this.gridSizeY % 18) == 17){
            this.generateRandomRows(this.gridSizeY*2, this.gridSizeX);
        }
        
        this.checkPoliceCollision();
        this.checkNextSteps();
	},


    policeMoveFinished: function(policeman){
        cc.log("police move finished");
        policeman.getComponent('Polizist').canMove = true;
        
    },


    checkPoliceCollision: function(){
     //   cc.log("police move finished");
      //  policeman.getComponent('Polizist').canMove = true;
        var result = false;
        for(var i = 0; i < this.policemen.length; i++){

            if(this.policemen[i].getComponent('Polizist').col == this.playerCol 
                && this.policemen[i].getComponent('Polizist').row == this.playerRow){
                result = true;
             
               this.game.gameOver();

                cc.log("Game Over");
                return result;    
            }

        }
        cc.log("Not Game Over");
        return result;
    },



    
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        
        if(!this.running){
            return;
        }
            
        if(this.playerMove && !this.game.sticky){
            var currentOverlay = this.level_overlay[this.playerRow][this.playerCol];
            cc.log("Current Overlay: "+currentOverlay);
            
            if(currentOverlay == 3 || currentOverlay == 31 || currentOverlay == 32){
                
                this.playerSlide = true;
                var nextWaterTile = -1;
                var columnLength = this.gridSizeX;
            
                if(this.playerRow % 2 == 0 ){
                    columnLength -=  1;
                }
                
                for(var i = 0; i < columnLength; i++){
                    var nextRow = this.level_overlay[this.playerRow+1];
                    if(nextRow[i] == 3 || nextRow[i] == 31 || nextRow[i] == 32){
                        nextWaterTile = i;
                    }
                }
               
                if(nextWaterTile > -1){
                    var columnLength = this.gridSizeX;
            
                    if(this.playerRow % 2 == 0 ){
                        columnLength -=  1;
                    }
                    
                    if(columnLength == this.gridSizeX){
                        if(nextWaterTile < this.playerCol){
                            this.placeMarker(nextWaterTile, this.playerRow + 1, false);
                        }
                        else{
                            this.placeMarker(nextWaterTile, this.playerRow + 1, true);
                        }
                    }else if(columnLength == this.gridSizeX-1){
                        if(nextWaterTile <= this.playerCol){
                            this.placeMarker(nextWaterTile, this.playerRow + 1, false);
                        }
                        else{
                            this.placeMarker(nextWaterTile, this.playerRow + 1, true);
                        }
                    }
                    
                }else{
                    this.playerSlide = false;
                }
                
            }

            if(!this.playerSlide){         
                if(this.leftDown && (this.playerCol > 0 || (this.playerRow % 2 == 1))){	
                
                    if(this.canStepLeft){
                        this.placeMarker(this.playerCol - (1 - this.playerRow % 2), this.playerRow + 1, true);
                    }
			}
    			if(this.rightDown && this.playerCol < this.gridSizeX - 1){	
    		        
    		        if(this.canStepRight){
    			        this.placeMarker(this.playerCol + (this.playerRow % 2), this.playerRow + 1, false);  
    		        }
                    
    			}
            }   
        }
        
        var elapsed = 12 * dt; //12dt
       


        //console.log(this.game.checkPoint());
         
  
         
         
        if(this.game.checkPoint() > 2){
            
            this.hexGroup.y += (20 * dt);
    
        }else if(this.game.checkPoint() > 5){
            this.hexGroup.y += (30 * dt);
        }else if(this.game.checkPoint() > 7){
            this.hexGroup.y += (40 * dt);
        }else if(this.game.checkPoint() > 9){
            this.hexGroup.y += (50 * dt);
        }else if(this.game.checkPoint() > 15){
            this.hexGroup.y += (80 * dt);
       }else if(this.game.checkPoint() > 30){
            this.hexGroup.y += (90 * dt);
       }else if(this.game.checkPoint() > 50){
            this.hexGroup.y += (250 * dt);
       }else if(this.game.checkPoint() > 100){
            this.hexGroup.y += (350 * dt);
       }


        if(this.playerHasMoved){
            this.hexGroup.y += elapsed;            
        }    
        //<448    
        if(this.hexGroup.convertToWorldSpace(this.player.getPosition()).y < 395){
            this.hexGroup.y += (30 * dt); //64 //30
        }  

        if(this.hexGroup.convertToWorldSpace(this.player.getPosition()).y > 540){
               this.game.gameOver(); // 520

        }

        if(this.hexGroup.convertToWorldSpace(this.player.getPosition()).y < (480 - 240)){
                //To-Do
        }

            
        var destroyedRow = false;
            
        for(var i = this.minRow; i < this.gridSizeY; i ++){
			
		    for(var j = 0; j < this.gridSizeX; j ++){
				if((i % 2 === 0 || j < this.gridSizeX - 1) && this.hexGroup.convertToWorldSpace(this.hexagonArray[i][j].getPosition()).y  > 520){
                    
                    this.hexagonArray[i][j].runAction(cc.sequence(cc.fadeOut(0.5),cc.callFunc(this.onFadedOut.bind(this.hexagonArray[i][j]), this)));
                    destroyedRow = true;                        
				}
			}
		}
            
        if(destroyedRow){
            this.minRow ++; 
        }



        /*if(this.playerMove){
            //var x = this.getFrameFromId("Polizist").convertToWorldSpace(this.police.getPosition()).x;
            var x = this.hexGroup.convertToWorldSpace(this.police.getPosition()).x;
            cc.log(x);
            //var y = this.getFrameFromId("Polizist").convertToWorldSpace.getPosition.y;
            //var policeOverlay = this.level_overlay[x][y];
            cc.log(" Police Overlay: "+policeOverlay);
            if(policeOverlay == 9){}

        }*/


    },


    onFadedOut:function(node){
        //node.getComponent('Hexagon').state = node.getComponent('Hexagon').State.Invisible;
        node.removeFromParent(true);
    },
    
    traceNextPos: function(overlay){
	    
	    var level = !overlay?this.level_base:this.level_overlay;
	    
	    if((this.playerRow % 2 == 1)){
            console.log("Next left:" + level[(this.playerRow+1) % 9][this.playerCol]);
            console.log("Next right:" + level[(this.playerRow+1) % 9][this.playerCol+1]);
        }else{
            console.log("Next left:" + level[(this.playerRow+1) % 9][this.playerCol-1]);
            console.log("Next right:" + level[(this.playerRow+1) % 9][this.playerCol]);
        }
	},
});


