class Win{
    constructor(game) {
        Object.assign(this, { game});
        this.game = game;
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
        if(this.game.click && this.game.click.y > 350 && this.game.click.y < 400){
            this.game.click.y = 0;
            this.game.camera.clearEntities();
            this.game.addEntity(new Menu(this.game)); 
        }
    };
    
    draw(ctx){ 
        ctx.drawImage(ASSET_MANAGER.getAsset("./assets/Spooky Cemetery Collapsed.png"), 0,0, 1920, 768,);

        ctx.font =  '60px "A"'
        ctx.fillStyle = "BLACK";
        ctx.fillText("YOU ESCAPED THE HAUNTED CEMETERY!", 150 ,300);
        ctx.fillStyle = "RED";
        ctx.fillText("BACK TO MAIN MENU?",400,400)
        ctx.fillText("PLAY AGAIN?",400,500)

        if ((this.game.mouse && this.game.mouse.y > 450 && this.game.mouse.y < 500 )) {
            this.duckAnimation.drawFrame(this.game.clockTick, ctx, 325, 450);
        }        
        if ((this.game.mouse && this.game.mouse.y > 350 && this.game.mouse.y < 400 )) {
            this.duckAnimation.drawFrame(this.game.clockTick, ctx, 325, 350);
        }

    };
}