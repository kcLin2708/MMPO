cc.Class({
    extends: cc.Component,

    properties: {
    

        jumpAudio: {
            default: null,
            url: cc.AudioClip
        },

        
    },

    // use this for initialization
    onLoad: function () {
    
      
    },

    start:function(){
        this.loadPlayer();
    },
    setSpriteFrame:function(){
        var f = cc.sys.localStorage;
        
        var playerFrame = f.getItem("playerFrame");
        

        if(playerFrame !== null){
            cc.log("playerframe");
            cc.log(this.game.atlas.getSpriteFrame(playerFrame));
            this.getComponent(cc.Sprite).spriteFrame = this.game.atlas.getSpriteFrame(playerFrame);
        }
    },
    loadPlayer: function(){
	
    },
    
 

    move: function(nextX, nextY, left){
        

	    var bezierX = 70;
        if(this.group.player.getPosition().x > nextX){
              bezierX *= -1;
        }
        
        var flip = cc.flipX(left);
        
        var flipValue = 1;
        if (!left){
            flipValue *= -1;
        }
        
        var jumpAction = cc.sequence(cc.scaleTo(0.2, flipValue, 1.2),cc.scaleTo(0.2, flipValue, 0.9),cc.scaleTo(0.2, flipValue, 1.0));
              
              
	    var bezier = [cc.p(this.group.player.getPosition().x + bezierX, this.group.player.getPosition().y), cc.p(nextX,nextY), cc.p(nextX,nextY)];
        var bezierTo = cc.bezierTo(0.4, bezier);
        var scale = cc.scaleTo(1.5,1.2);

        var spawn = cc.spawn(flip, jumpAction, bezierTo);
        

        this.group.player.runAction(cc.sequence(spawn,cc.callFunc(this.group.moveFinished, this.group)));
        

	},

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
