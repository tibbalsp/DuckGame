class RetryMenu{
    constructor(game,score) {
        Object.assign(this, { game,score});
        this.game = game;
        this.score = score;
        this.duckSheet = ASSET_MANAGER.getAsset("./assets/Duck Sprite Sheet.png");
        this.duckAnimation = new Animator(this.duckSheet,0,0,32,32,5,0.1,1,0,0,0,2);
    };
  
    update(){
        
        if(this.game.click && this.game.click.y > 450 && this.game.click.y < 500){
            this.game.click.y = 0;
            this.game.camera.clearEntities();
            this.game.background.halt = false;
            this.game.addEntity(new SceneManager(this.game, this.game.difficulty)); 
        }

        if(!this.game.mute){
        }else{
        }
    };
    
    draw(ctx){ 
        this.img = ASSET_MANAGER.getAsset("./assets/hellgate.png");
        ctx.drawImage(this.img, 0,0, 1920, 768,);

        ctx.font =  '60px "A"'
        ctx.fillStyle = "BLACK";
        ctx.fillText("FATALITY", 600 ,200);
        ctx.fillText("DISTANCE:"+this.score+" ", 550 ,300);

        ctx.fillText("RETRY?",600,500)

        if ((this.game.mouse && this.game.mouse.y > 450 && this.game.mouse.y < 500 )) {
            this.duckAnimation.drawFrame(this.game.clockTick, ctx, 525, 450);
        }


    };
}