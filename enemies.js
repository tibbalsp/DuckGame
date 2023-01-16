class Tombstone {
    constructor(game , x, y){
        Object.assign(this,{game, x, y});

        this.x=x;
        this.y=y;
        this.velocity = { x: -5.0, y:0};
        this.spritesheet = ASSET_MANAGER.getAsset("./tombstone.png");

        this.updateBB();

    }
    updateBB() {
        this.lastBB = this.BB;
        this.BB = new BoundingBox(this.x+4, this.y , 42, 50);
    };

    update(){
        
        this.x -=5.0;
    
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