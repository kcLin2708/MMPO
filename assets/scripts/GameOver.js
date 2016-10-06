cc.Class({
    extends: cc.Component,

    properties: {
        label:{
            default:null,
            type:cc.Label,
        },
    },

    // use this for initialization
    onLoad: function () {
        setTimeout(3000);
        
    },

    showScore:function(score){
        this.label.string = 'Score: ' + score.toString();

    },
    
 
    
    
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
