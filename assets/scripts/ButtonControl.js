cc.Class({
    extends: cc.Component,

    properties: {
   
      
    },

    // use this for initialization
    onLoad: function () {

    },
    
    backToStart:function(){
      cc.director.loadScene('start')  
    },
    
    buttonPlay:function(){
        
        cc.director.loadScene('playerMenue')
    },
    
    
    tutorialButton:function(){
        cc.director.loadScene('tutorial');
    },
    impressumButton:function(){
        cc.director.loadScene('impressum');
    },
    
    buttonTryAgain:function(){
        cc.director.loadScene('game');
    },
    
    buttonExit:function(){
       cc.director.end();
    },
    
    buttonPlayer1:function(){
        cc.director.loadScene('game');
      
        cc.game.getComponent('Game').chooseFigure(1)
    },
    
    buttonPlayer2:function(){
        cc.director.loadScene('game');
      
        cc.game.getComponent('Game').chooseFigure(2)
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
