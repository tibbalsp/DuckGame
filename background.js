class Background{
    constructor(game){
        this.game = game;
        this.x = 0;
        this.y = 0;

        this.speed = 5;
    }

    update(){
        //to move as auto scrolling
        this.x -= this.speed;
        if (this.x < 0 - 1920) {this.x = 0};

    }

    draw(ctx){
        ctx.drawImage(ASSET_MANAGER.getAsset("./Forest.png"), this.x ,this.y, 1920, 768,);
        ctx.drawImage(ASSET_MANAGER.getAsset("./Forest.png"), this.x+1918, this.y, 1920, 768,);

        /*For following the character 
            ctx.drawImage(ASSET_MANAGER.getAsset("./Forest.png"), this.x-this.game.camera.x ,this.y, 1920, 768,);
            ctx.drawImage(ASSET_MANAGER.getAsset("./Forest.png"), this.x+1918-this.game.camera.x, this.y, 1920, 768,);
        */
    }
}