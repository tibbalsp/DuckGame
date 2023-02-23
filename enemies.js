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
        if(this.x < -200){
            this.removeFromWorld = true;
        }
        this.x += this.speed;
    
        this.updateBB();


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
    updateSpeed(){
        this.speed = -7.5;
    }
    update(){
        if(this.x >2000){

            this.removeFromWorld = true;
        }
        
        this.x += this.speed;
        //console.log(this.x);

        this.updateBB();

        var that = this;
        this.game.entities.forEach(function (entity) {
            if (that.BB != null && entity.BB && that.BB.collide(entity.BB)) {
                if (entity instanceof CharacterController ) {
                    if(entity.state == "ROLL"){
                        that.facingDirection = 0;
                        that.key = false;
                        that.BB =null;
                        that.updateSpeed();
                        that.game.camera.addPoints(50);

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

class Grim{
    constructor(game, x, y){
        Object.assign(this,{game, x, y});
        this.game = game;
        this.x=x;
        this.y=y;

        this.grimSheet = ASSET_MANAGER.getAsset("./assets/reaper.png");
        this.grimAnimation = new Animator(this.grimSheet,0,0,32,31,3,0.2,1,0,0,0,3);
        this.damaged = 0;
        this.grimSheetDamaged = ASSET_MANAGER.getAsset("./assets/reaperDamaged.png");
        this.grimDamageAnimation = new Animator(this.grimSheetDamaged,0,0,32,31,6,0.2,1,0,0,0,3);
        this.animation = this.grimAnimation;


        this.horizontalSpeed =150;
        this.verticalSpeed = 50;
        this.dir=1;
        this.updateBB();
        this.facingDirection = 0;
        this.attack = false;
        this.attackTime = 1;
        this.elapsedFireball = 0;
        this.switchSides = 0;
        this.switchStart=true;
        this.health = 0;
        if(this.game.difficulty=="EASY"){
            this.health = 30;

        }else if(this.game.difficulty=="NORMAL"){
            this.health = 40;

        }else if(this.game.difficulty=="HARD"){
            this.health = 60;

        }else if(this.game.difficulty=="HARDCORE"){
            this.health = 80;
        }

    }

    spawnFireBall(x,y,dir){
        this.game.addEntity(new FireBall(this.game,x,y,dir));
    }
    switchSide(){
        if(this.attack){
            this.switchSides += this.game.clockTick;
            this.elapsedFireball += this.game.clockTick;

        }
    }
    switchAnimaion(){
        console.log("switched")
        if(this.animation == this.grimDamageAnimation){
            this.animation = this.grimAnimation;
        }else{
            this.animation = this.grimDamageAnimation;
        }
    }
    update(){

        

        this.switchSide();
        if(this.switchSides>10){
            if(this.damaged == 0 && this.switchStart){
                this.switchAnimaion();
                this.switchStart= false;
            }
            if(this.facingDirection == 0){
                this.x -= this.horizontalSpeed*this.game.clockTick;
                if(this.x < 50){
                    this.x+10;
                    this.facingDirection = 1;
                    this.switchSides = 0;
                        
                    this.damaged = 0;
                    this.switchAnimaion();
                    this.switchStart=true;
                }
            }else{
                this.x += this.horizontalSpeed*this.game.clockTick;
                if(this.x > 1300){
                    this.x-10;
                    this.facingDirection = 0;
                    this.switchSides = 0;
                    this.damaged = 0;
                    this.switchAnimaion();
                    this.switchStart=true;

                }
            }
        }else{
            if(this.attack && this.attackTime < this.elapsedFireball){
                if(Math.floor(this.y) == 515){
                    if(this.facingDirection == 0){
                        this.spawnFireBall(this.x-510,this.y,0);
                    }else{
                        this.spawnFireBall(this.x,this.y,1);
                    }
                    this.elapsedFireball = 0;

                }else if(Math.floor(this.y) == 565){
                    if(this.facingDirection == 0){
                        this.spawnFireBall(this.x-510,this.y,0);
                    }else{
                        this.spawnFireBall(this.x,this.y,1);
                    }
                    this.elapsedFireball = 0;

                }else if(Math.floor(this.y) == 600){
                    if(this.facingDirection == 0){
                        this.spawnFireBall(this.x-510,this.y,0);
                    }else{
                        this.spawnFireBall(this.x,this.y,1);
                    }
                    this.elapsedFireball = 0;

                }

            }
        }
        if(this.y < 500){
            this.dir = 1;

        }else if(this.y > 630){
            this.attack = true;

            this.dir = -1;

        }

        var that = this;
        this.game.entities.forEach(function (entity) {
            if (that != entity && entity.BB && that.BB.collide(entity.BB)) {
                if (entity instanceof CharacterController ) {
                    if(entity.lastBB.bottom < that.BB.top && that.damaged == 0 && entity.damaged == 0){
                        that.y += 20;
                        that.damaged = 1;
                        that.switchSides += 10;
                        that.health -= 10;
                        if(that.health<=0){
                            that.removeFromWorld = true;
                        }
                        that.switchAnimaion();

                    }
                }
            }
        });


        this.y += this.verticalSpeed*this.dir*this.game.clockTick;

        this.updateBB();

    }

    updateBB(){
        this.lastBB = this.BB;
        if(this.facingDirection == 0){
            this.BB = new BoundingBox(this.x-34, this.y+8 , 44, 85);
        }else{
            this.BB = new BoundingBox(this.x+24, this.y+8 , 44, 85);
        }
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
class FireBall{
    constructor(game, x, y,direction){
        Object.assign(this,{game, x, y});
        this.game = game;
        this.x=x;
        this.y=y;

        //spritesheet, xStart, yStart, width, height, frameCount, frameDuration, loop, spriteBorderWidth=0, xoffset=0, yoffset=0, scale=1, rowCount=1, lineEnd, rowOffset=0
        this.fireSheet = ASSET_MANAGER.getAsset("./assets/fireball.png");
        this.fireAnimation = new Animator(this.fireSheet,0,0,510,512,6,0.2,1,0,0,0,0.25);
        this.side = 0;
        this.speed = 5;
        this.facingDirection = direction;

    }
    update(){

        if(this.x < -800|| this.x > 2000){
            this.removeFromWorld = true;
        }
        if(this.facingDirection == 0){

            this.x -= this.speed;
        }else{
            this.x += this.speed;

        }
      
        this.updateBB();

    }

    updateBB(){
        this.lastBB = this.BB;
        if(this.facingDirection == 0){
            this.BB = new BoundingBox(this.x+415, this.y+44 , 45, 40);
        }else{
            this.BB = new BoundingBox(this.x+48, this.y+42 , 45, 40);
        }
    }

    draw(ctx){
        ctx.save();
        let destx = this.x;
        let desty = this.y;

        if (!this.facingDirection) {// if facing right
            ctx.scale(-1, 1);
            destx*= -1;
            destx -= this.fireAnimation.width;
        }
    
        this.fireAnimation.drawFrame(this.game.clockTick, ctx, destx, desty);
        ctx.restore();

        if(this.BB != null){
            ctx.strokeStyle = 'Red';
            ctx.strokeRect(this.BB.x, this.BB.y, this.BB.width, this.BB.height);
        }
    }
}