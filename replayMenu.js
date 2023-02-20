class RetryMenu{
    constructor(game,score) {
        Object.assign(this, { game,score});
        this.game = game;
        this.score = score;


    };

    update(){
        
        if(this.game.click && this.game.click.y > 450 && this.game.click.y < 500){
            this.game.click.y = 0;
            this.game.camera.clearEntities();
            this.game.background.halt = false;
            this.game.addEntity(new SceneManager(this.game)); 
        }
    
    };
    
    draw(ctx){ 

        ctx.font =  '60px "a"'
        ctx.fillStyle = "RED";
        ctx.fillText("FATALITY", 600 ,350);
        ctx.fillText("SCORE:"+this.score+" ", 600 ,400);

        ctx.fillText("RETRY?",600,500)

    


    };
}