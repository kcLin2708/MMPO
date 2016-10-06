cc.Class({
    extends: cc.Component,

    properties: {
        overlay:{
            default: null,
            type:   cc.Node
        },
        emmitter:{
            default:null,
            type:   cc.ParticleSystem
        },

        animation:{
            default:null,
            type:   cc.Animation
        },
        
      
        
        overlayType: "none",
        groundType: "none",
        
     },

    // use this for initialization
    onLoad: function () {
        this.particles = this.emmitter;
        this.particles.stopSystem();
        
        this.ground_tiles = {
            DEFAULT: 'none',
            NORMAL: 'isocube',
            FATAL: 'othercube',
            BlOODONE: 'bloodcube_1',
            BlOODTWO: 'bloodcube_2',
            BlOODTHREE: 'bloodcube_3',
            JAIL: 'jail',
            CAGE:'slayer_cage',
         //   CAGE2: 'woman_cage',

        };

        this.State = cc.Enum({
            Visible: -1,
            Invisible : -1,
        });



        //this.loadPolice;
        this.spikeOut = false;

        this.animation.parent = this;
        this.state = this.State.Visible;
       
        
    },


    loadPolice: function(){

        

    },

    setSpriteFrame:function(frame){

        var sprite = this.getComponent(cc.Sprite);
        
      /*if(frame === "zacken"){
            this.animation.play("zacken");
            sprite.spriteFrame = this.group.game.atlas.getSpriteFrame("cube2");
        }else{
            this.animation.stop();
            sprite.spriteFrame = this.group.game.atlas.getSpriteFrame(frame);
        }*/

        this.groundType = frame;
        if(frame!== null){
            sprite.spriteFrame = this.group.game.atlas.getSpriteFrame(frame);
        }
 
    },
    
    setOverlay:function(overlayType){
        
        if(overlayType==="none"){
            //cc.log("Overlay Type: "+ overlayType);
            return ;
        }


        if(overlayType==="Polizist"){
          return;
        }
            

        var self = this; 

        if(this.overlay === null){
            // Create a new node and add sprite components.
            self.overlay = new cc.Node("New Node");
            self.node.addChild(self.overlay);

        }
        
        var sprite = this.overlay.addComponent(cc.Sprite);
        sprite.spriteFrame = this.group.game.atlas.getSpriteFrame(overlayType);
        this.overlay.y += 32;

        this.overlayType = overlayType;
        

    },

    canStepOverlay: function(){
    
      var result = true;
     
      switch(this.overlayType){

            default:
                result = true;                  
      } 
     return result; 
        
    },


    scaleFunction: function(){

       var scale = cc.scaleTo(1.5,3.5);
       return scale;

    },

    
    checkAction:function(){
       

        switch(this.groundType){



            case this.ground_tiles.NORMAL:
                this.setSpriteFrame("clues2"); 
                break;
            case this.ground_tiles.FATAL:
                var col = this.group.playerCol;
                var row = this.group.playerRow;
                this.group.game.delay(1000);
                this.group.player.runAction(cc.sequence(cc.fadeOut(0.01), cc.fadeIn(0.85)));
                this.group.placeMarker(col,row+2,true);
                
                break;
                
            case
                this.ground_tiles.JAIL:
                this.setSpriteFrame("stop");
                this.group.game.delay(1500);
                
                break;

        }

        switch(this.overlayType){

            case 'beil':
			this.scaleFunction();
                 this.overlay.removeFromParent(true);
                 this.group.game.gainScore();
                 break;
            case 'gun':
			this.scaleFunction();
                 this.overlay.removeFromParent(true);
                 this.group.game.gainScore();

                 break;
           case 'Polizist':
                 this.group.game.delay(1000);
                 this.overlay.removeFromParent(true);
                 this.setSpriteFrame("stop");
                 break;
            case 'bombe':
                this.overlay.removeFromParent(true);
                this.group.game.gainScore();
                break;
            case 'Alien':
                this.overlay.removeFromParent(true);
                this.group.game.gainScoreAlien();
                this.setSpriteFrame("bloodcubeA2");
                cc.audioEngine.playEffect(this.group.game.screamAAudio,false,2);
                break;
            case 'Wiesnbiatch':
                this.overlay.removeFromParent(true);
                this.group.game.gainScoreBabsi();
                this.setSpriteFrame("bloodcube_3"); 
                cc.audioEngine.playEffect(this.group.game.screamWAudio,false,0.5);
                break;
            case 'Trump':
                this.overlay.removeFromParent(true);
                this.group.game.gainScoreTrump();
                this.setSpriteFrame("bloodcube_1"); 
                cc.audioEngine.playEffect(this.group.game.screamMAudio,false,2);
                break;
        
        }
    },

    // called every frame, uncomment this function to activate update callback
     update: function (dt) {
        if(this.overlayType == 'Polizist'){

          this.overlay.y+= dt; 
        }
    }
});
