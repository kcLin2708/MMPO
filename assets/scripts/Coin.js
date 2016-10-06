cc.Class({
    extends: cc.Component,

    properties: {
       pickRadius: 3,
    },

    // use this for initialization
    onLoad: function () {
        this.getComponent(cc.Sprite).setVisible(false);
        this.animate();
        
    },
    animate:function(){
        var moveUp = cc.moveBy(1.5,cc.p(0,3));
        var moveDown = cc.moveBy(1.5,cc.p(0,-3));
        cc.log("animate");
        this.node.runAction(cc.sequence(moveUp,moveDown));
    },
    getPlayerDistance: function () {
        // judge the distance according to the position of the player node
        var playerPos = this.group.hexGroup.convertToWorldSpace(this.group.player.getPosition());
        var coinPos = this.group.hexGroup.convertToWorldSpace(this.node.getPosition());
        // calculate the distance between two nodes according to their positions
        var dist = cc.pDistance(coinPos, playerPos);
        return dist;
    },

    onPicked: function() {
        // When the stars are being collected, invoke the interface in the Game script to generate a new star
        
        this.game.gainScore();
        // then destroy the current star's node
        this.node.destroy();
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        
        if(this.group.hexGroup.convertToWorldSpace(this.node.getPosition()).y  > 96){
            this.getComponent(cc.Sprite).setVisible(true);  
        }
        //console.log("distance: "+this.getPlayerDistance());
        // judge if the distance between the star and main character is shorter than the collecting distance for each frame
        if(this.getPlayerDistance()<=64)
        cc.log(this.getPlayerDistance());
        if (this.getPlayerDistance() <= this.pickRadius) {
            this.onPicked();
            return;
        }


        //console.log(this.node.getPosition().y);
        if(this.group.hexGroup.convertToWorldSpace(this.node.getPosition()).y  > 480){
           this.node.destroy();
        }
    },
});
