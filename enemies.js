class Tombstone {
    constructor(game , x, y){
        Object.assign(this,{game, x, y});
        this.x=x;
        this.y=y;
        this.velocity = { x: 0, y:0};
        this.spritesheet = ASSET_MANAGER.getAsset("./assets/Headstone.png");
        this.speed = -5;
        this.updateBB();

    }
    updateBB() {
        this.lastBB = this.BB;
        this.BB = new BoundingBox(this.x+15, this.y+25 , 42, 50);
    };

    update(){
        
        this.x += this.speed;
    
        this.updateBB();

        var that = this;
        this.game.entities.forEach(function (entity) {
            if (entity.BB && that.BB.collide(entity.BB)) {
                if (entity instanceof CharacterController) {
                    entity.dead = true;
                    console.log("I am dead from tombstone")
                }
            }
        });
    }

    draw(ctx){
        ctx.drawImage(this.spritesheet, this.x ,this.y, 75, 75);
        ctx.strokeStyle = 'Red';
        ctx.strokeRect(this.BB.x, this.BB.y, this.BB.width, this.BB.height);
    }

}

class Dog{
    constructor(game , x, y){
        Object.assign(this,{game, x, y});
        this.game = game;
        this.x=x;
        this.y=y;
        this.velocity = { x: 0, y:0};
        this.spritesheet = ASSET_MANAGER.getAsset("./assets/dog.png");
        this.speed = 0.5;
        this.updateBB();
        this.animation = new Animator(this.spritesheet,0,0,52,38,3,0.2,1,0,0,0,2);
        this.updateScore=0;
        this.key = true;
        this.BB = new BoundingBox(this.x+8, this.y+10 , 52, 55);
        this.facingDirection = 1;

    }
    updateBB(){
        this.lastBB = this.BB;

        if(this.lastBB != null){
            this.BB = new BoundingBox(this.x+8, this.y+10 , 52, 55);
        }
    }

    update(){
        this.x += this.speed;
        this.updateBB();

        var that = this;
        this.game.entities.forEach(function (entity) {
            if (that.BB != null && entity.BB && that.BB.collide(entity.BB)) {
                if (entity instanceof CharacterController ) {
                    if(entity.state == "ROLL"){
                        that.facingDirection = 0;
                        console.log("flyaway");
                        that.key = false;
                        that.speed = -5;
                        that.BB =null;
                    }else{
                        entity.dead = true;
                    }
                    
                }
            }
        });

        this.game.camera.score += this.updateScore;
        this.updateScore =0;
    
    }

    draw(ctx){
        ctx.save();
        let destx = this.x;
        let desty = this.y;

        if (!this.facingDirection) {// if facing right
            ctx.scale(-1, 1);
            destx*= -1;
            destx -= this.animation.width;
        }
    
        this.animation.drawFrame(this.game.clockTick, ctx, destx, desty);
        ctx.restore();

        if(this.BB != null){
            ctx.strokeStyle = 'Red';
            ctx.strokeRect(this.BB.x, this.BB.y, this.BB.width, this.BB.height);
        }
    }


}