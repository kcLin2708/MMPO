cc.Class({
    extends: cc.Component,

    properties: {
       
       buttonAudio:{
           default: null,
           url: cc.AudioClip,
       }
       
    },

    playSound:function(){
      cc.audioEngine.playEffect(this.buttonAudio,false);  
    },

    // use this for initialization
    onLoad: function () {
    

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
