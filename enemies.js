class Tombstone {
    constructor(game , x, y){
        Object.assign(this,{game, x, y});
        this.x=x;
        this.y=y;
        this.velocity = { x: 0, y:0};
        this.spritesheet = ASSET_MANAGER.getAsset("./tombstone.png");
        this.speed = -5;
        this.updateBB();

    }
    updateBB() {
        this.lastBB = this.BB;
        this.BB = new BoundingBox(this.x+4, this.y , 42, 50);
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
        ctx.drawImage(this.spritesheet, this.x ,this.y, 50, 50);
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
        this.spritesheet = ASSET_MANAGER.getAsset("./dog.png");
        this.speed = 0.5;
        this.updateBB();
        this.animation = new Animator(this.spritesheet,0,0,52,38,3,0.3,1);
        

    }
    updateBB(){
        this.lastBB = this.BB;
        this.BB = new BoundingBox(this.x+8, this.y+5 , 52, 60);
    }

    update(){
        this.x += this.speed;
        this.updateBB();

        var that = this;
        this.game.entities.forEach(function (entity) {
            if (entity.BB && that.BB.collide(entity.BB)) {
                if (entity instanceof CharacterController ) {
                    if(entity.state == "ROLL"){
                        that.removeFromWorld = true;
                        

                    }else{
                        entity.dead = true;
                    }
                    
                }
            }
        });

    
    }

    draw(ctx){
        this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
        ctx.strokeStyle = 'Red';
        ctx.strokeRect(this.BB.x, this.BB.y, this.BB.width, this.BB.height);
    }


}