class Background{
    constructor(game){
        this.game = game;
        this.x = 0;
        this.y = 0;
        this.halt;
        
    }

    update(){
        //to move as auto scrolling
        if(!this.halt){
            this.x -= 5;
            if (this.x < 0 - 1919) {
                this.x = 0
            };
        }
    }
    updateSpeed(stop){
        this.halt = stop;
        console.log(stop);
    }
    draw(ctx){
        ctx.drawImage(ASSET_MANAGER.getAsset("./assets/Spooky Cemetery Collapsed.png"), this.x ,this.y, 1920, 768);
        ctx.drawImage(ASSET_MANAGER.getAsset("./assets/Spooky Cemetery Collapsed.png"), this.x+1919, this.y, 1920, 768);

        /*For following the character 
            ctx.drawImage(ASSET_MANAGER.getAsset("./Forest.png"), this.x-this.game.camera.x ,this.y, 1920, 768,);
            ctx.drawImage(ASSET_MANAGER.getAsset("./Forest.png"), this.x+1918-this.game.camera.x, this.y, 1920, 768,);
        */
    }
}