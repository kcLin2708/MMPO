cc.Class({
    extends: cc.Component,

    properties: {

    },

    // use this for initialization
    onLoad: function () {
        this.ls = cc.sys.localStorage;
    },
    backToStart:function(){
        cc.director.loadScene('start')
    },
    buttonPlay:function(){
        cc.director.loadScene('playerMenue')
    },
    buttonTryAgain:function(){
        cc.director.loadScene('playerMenue');
    },
    buttonExit:function(){
       cc.director.end();
    },
    
    buttonPlayer1:function(){
        
        this.ls.setItem("playerFrame","Slayer_man");
        cc.director.loadScene('game');
        
    },
    
    buttonPlayer2:function(){
        this.ls.setItem("playerFrame","Slayer_woman");
        cc.director.loadScene('game');
        
    },
    
    buttonControlCallback: function(){
        //cc.director.loadScene('game');
    },
    pauseButtonControlCallback: function(){
        cc.log("Pause");
        if(!cc.director.isPaused()){
            cc.director.pause();

        }else{
            cc.director.resume(); 
        }
        
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
