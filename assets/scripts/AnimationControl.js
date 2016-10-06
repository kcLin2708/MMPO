cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // use this for initialization
    onLoad: function () {

    },
    spikeEventHandler:function(){

        var hexagon = this.getComponent(cc.Animation).parent;
        hexagon.spikeOut = !hexagon.spikeOut;
        hexagon.checkAction();

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
