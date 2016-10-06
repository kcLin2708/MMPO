cc.Class({
    extends: cc.Component,

    properties: {

    },

    // use this for initialization
    onLoad: function () {
        
        this.canMove = true;
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

    move: function(nextX, nextY, left){
        
        cc.log("left: "+left);

        var bezierX = 70;
        if(this.node.getPosition().x > nextX){
              bezierX *= -1;
        }
        
        var flip = cc.flipX(left);
        
        var flipValue = 1;
        if (!left){
            flipValue *= -1;
        }
                                                      //1.2
        var jumpAction = cc.sequence(cc.scaleTo(0.2, flipValue, 1.2),cc.scaleTo(0.2, flipValue, 0.9),cc.scaleTo(0.2, flipValue, 1.0));
        //flip:1.0
              
              
        var bezier = [cc.p(this.node.getPosition().x + bezierX, this.node.getPosition().y), cc.p(nextX,nextY), cc.p(nextX,nextY)];
        var bezierTo = cc.bezierTo(0.4, bezier); //0.5
        var scale = cc.scaleTo(1.5, 1.2);


        var spawn = cc.spawn(flip, jumpAction, bezierTo);//scale
        

        this.node.runAction(cc.sequence(spawn,cc.callFunc(this.group.policeMoveFinished(this), this.group)));
        

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
