

cc.Class({
    extends: cc.Component,

    properties: {
        hexagonGroup: {
            default: null,
            type: cc.Node
        },
        scoreDisplay: {
            default: null,
            type: cc.Label
        },
        atlas: {
            default:null,
            type: cc.SpriteAtlas
        },

        gameOverMenu: {
            default:null,
            type: cc.Node
        },
        
        scoreAudio:{
            default:null,
            url: cc.AudioClip
        },

        playerPrefab: {
            default:null,
            type: cc.Prefab
        },
         
        screamMAudio:{
            default:null,
            url: cc.AudioClip,
        },
        screamWAudio:{
            default:null,
            url: cc.AudioClip,
        },
        screamAAudio:{
            default:null,
            url:cc.AudioClip,
        },
       
    },



    // use this for initialization
    onLoad: function () {
        
        this.GameState = cc.Enum({
            Menu: -1,
            Run : -1,
            Over: -1
        });

//instantiate player
        //cc.log("player script:" + this.player.getComponent('Player'));
        //this.Node.addChild(this.playerPrefab);

        this.gameState = this.GameState.Ready;
        this.hexagonGroup.getComponent('HexagonGroup').game = this;
//this.hexagonGroup.getComponent('HexagonGroup').player = this.player;
        this.reset();
    
    },
    

    startGame:function(){
        this.gameState = this.GameState.Run;

    },

    reset:function(){
        this.score = 0;
        this.sticky = false;
        this.flipped = false; 
        this.gameOverMenu.active = false;
        this.startGame();
    },
    

    gainScore: function () {
        this.score += 1;
        // update the words of the scoreDisplay Label
        this.scoreDisplay.string = this.score.toString();
        cc.audioEngine.playEffect(this.scoreAudio, false);
      
    },
    
    checkPoint:function(){
        return this.score;
    },
    
    
    gainScoreBabsi:function(){

        this.score += 5;
        this.scoreDisplay.string = this.score.toString();
        cc.audioEngine.playEffect(this.scoreAudio, false);
     

    },
    gainScoreAlien:function(){

        this.score += 10;
        this.scoreDisplay.string =this.score.toString();
        cc.audioEngine.playEffect(this.scoreAudio, false);
    

    },
    gainScoreTrump:function(){

        this.score += 20;
        this.scoreDisplay.string =this.score.toString();
        cc.audioEngine.playEffect(this.scoreAudio, false);


    },
    

    stick: function(duration){
        this.toggleStickiness();
        setTimeout(this.toggleStickiness.bind(this), duration);
    },
    
        delay: function(duration){

        this.toggleStickiness();
        setTimeout(this.toggleStickiness.bind(this), duration);

    },

    
    flipDirection: function(duration){
        this.toggleFlip();
        setTimeout(this.toggleFlip.bind(this), duration);
    },

    toggleFlip: function(){
        this.flipped = !this.flipped;
    },
    toggleStickiness: function(){
        this.sticky = !this.sticky;
    },      
    
/*replaceImage:function(){
        this.hexagonGroup.getComponent('HexagonGroup').cageImage();
    },*/


    gameOver:function () {
        this.gameState = this.GameState.Over;
        this.gameOverMenu.active = true;
       // cc.director.loadScene('gameOver');
        
        this.gameOverMenu.getComponent('GameOver').showScore(this.score);
        
        this.hexagonGroup.getComponent('HexagonGroup').stop();  
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
