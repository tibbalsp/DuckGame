class Tombstone {
    constructor(game , x, y){
        Object.assign(this,{game, x, y});
        this.x=x;
        this.y=y;
        this.velocity = { x: 0, y:0};
        this.spritesheet = ASSET_MANAGER.getAsset("./assets/Headstone.png");
        this.speed = -5*60;
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
        this.x += this.speed*this.game.clockTick;
    
        this.updateBB();


    }

    draw(ctx){
        ctx.drawImage(this.spritesheet, this.x ,this.y, 75, 75); 
        if(this.BB != null && this.game.debug == true){
            this.BB.draw(ctx)
        }
        
    }

}

class Dog{
    constructor(game , x, y){
        Object.assign(this,{game, x, y});
        this.game = game;
        this.x=x;
        this.y=y;
        this.spritesheet = ASSET_MANAGER.getAsset("./assets/dog.png");
        this.speed = 0.5*60;
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
        this.speed = -7.5*60;
    }
    update(){
        if(this.x >2000){

            this.removeFromWorld = true;
        }
        
        this.x += this.speed*this.game.clockTick;
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
        if(this.BB != null && this.game.debug == true){
            this.BB.draw(ctx)
        }
    }


}

class Grim{
    constructor(game, x, y){
        Object.assign(this,{game, x, y});
        this.game = game;
        this.x=x;
        this.y=y;
  
//        spritesheet, xStart, yStart, width, height, frameCount, frameDuration, loop , spriteBorderWidth, xoffset, yoffset, scale, rowCount, lineEnd, rowOffset

        this.grimSheet = ASSET_MANAGER.getAsset("./assets/reaper.png");
        this.grimAnimation = new Animator(this.grimSheet,0,0,32,31,3,0.2,1,0,0,0,4);
        this.damaged = 1;
        this.grimSheetDamaged = ASSET_MANAGER.getAsset("./assets/reaperDamaged.png");
        this.grimDamageAnimation = new Animator(this.grimSheetDamaged,0,0,32,31,6,0.2,1,0,0,0,4);
        this.animation = this.grimDamageAnimation;

        this.startingFlag = true;

        this.horizontalSpeed =250;
        this.verticalSpeed = 150;
        this.dir=1;
        this.updateBB();
        this.facingDirection = 0;
        this.attack = false;
        this.attackTime = 0.75;
        this.elapsedFireball = 0;
        this.switchSides = 0;
        this.switchStart=true;
        this.health = 0;
        this.maxHealth = 0;
        if(this.game.difficulty=="EASY"){
            this.health = 50;
            this.maxHealth = 50;


        }else if(this.game.difficulty=="NORMAL"){
            this.health = 50;
            this.maxHealth = 50;


        }else if(this.game.difficulty=="HARD"){
            this.health = 100;
            this.maxHealth = 100;


        }else if(this.game.difficulty=="HARDCORE"){
            this.health = 100;
            this.maxHealth = 100;

        }
        this.fireSound = ASSET_MANAGER.getAsset("./assets/fireball.mp3");

    }

    spawnFireBall(x,y,dir){
        this.game.addEntity(new FireBall(this.game,x,y,dir));
        this.fireSound.volume = 0.002;
        if(!this.game.mute){
            this.fireSound.cloneNode(true).play();
        }
        this.fireSound.volume = 0.002;


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
            this.damaged = 0;
            this.animation = this.grimAnimation;
        }else{
            this.damaged = 1;
            this.animation = this.grimDamageAnimation;
            
        }
    }
    update(){

        

        this.switchSide();
        if(this.switchSides>10){
            this.verticalSpeed = 200;

            if(this.damaged == 0 && this.switchStart){
                this.switchAnimaion();
                this.switchStart= false;
            }
            if(this.facingDirection == 0){
                this.x -= this.horizontalSpeed*this.game.clockTick;
                if(this.x < 50){
                    this.x = 50;
                    this.facingDirection = 1;
                    this.switchSides = 0;
                        
                    this.switchAnimaion();
                    this.switchStart=true;
                    this.verticalSpeed = 50;

                }
            }else{
                this.x += this.horizontalSpeed*this.game.clockTick;
                if(this.x > 1400){
                    this.x = 1400;
                    this.facingDirection = 0;
                    this.switchSides = 0;
                    this.switchAnimaion();
                    this.switchStart=true;
                    this.verticalSpeed = 50;
                }
            }
            if(this.y < 450){
                this.dir = 1;
            }
        }else{
            if(this.attack && this.attackTime < this.elapsedFireball){
                if(Math.floor(this.y) == 515){
                    if(this.facingDirection == 0){
                        this.spawnFireBall(this.x-510 , this.y , 0);
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
            if(this.y < 500){
                this.dir = 1;
            }
        }
    
        if(this.y > 630){
            if(this.startingFlag== true){
                this.game.backrough
                this.game.grimSpawnMusic.pause();
                this.verticalSpeed = 50;
                this.startingFlag=false;
                this.attack = true;
                this.switchAnimaion();
            }
            this.dir = -1;

        }

        var that = this;
        this.game.entities.forEach(function (entity) {
            if (that != entity && entity.BB && that.BB.collide(entity.BB)) {
                if (entity instanceof CharacterController ) {
                    if(((entity.lastBB.bottom < that.BB.top) ) && that.damaged == 0 && !entity.damaged ){
                        console.log("jump hit")
                        that.y += 20;
                        that.switchSides += 10;
                        that.health -= 10;
                       
                        that.switchAnimaion();

                    }else if(entity.state == "ROLL" && that.damaged == 0 && !entity.damaged ){
                        console.log("roll hit")

                        that.switchSides += 10;
                        that.health -= 10;
                      
                        entity.damaged = true;
                        entity.damageTimeout = 0;
                        entity.switchAnimation();
                        that.switchAnimaion();
                
                    }
                    if(that.health <= 0){
                        that.game.camera.gameOver = true;
                        that.removeFromWorld = true;
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
            this.BB = new BoundingBox(this.x-46, this.y+12 , 48, 105);
        }else{
            this.BB = new BoundingBox(this.x+34, this.y+12 , 48, 105);
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
        ctx.save();
        let width = this.BB.width | 1*this.maxHealth; // provide a default/standardized bar size.
        let ratio = this.health / this.maxHealth;

        if (!this.facingDirection) {// if facing right
            ctx.fillStyle="black"; // black background for empty health.
            ctx.fillRect(this.x-55, this.y, width, 8);
            ctx.fillStyle="#66161c"; // dark red for full health.
            ctx.fillRect(this.x-55, this.y, Math.ceil(ratio*width), 8);
        }else{
            ctx.fillStyle="black"; // black background for empty health.
            ctx.fillRect(this.x+25, this.y, width, 8);
            ctx.fillStyle="#66161c"; // dark red for full health.
            ctx.fillRect(this.x+25, this.y, Math.ceil(ratio*width), 8);
        }

        ctx.restore();
        if(this.BB != null && this.game.debug == true){
            this.BB.draw(ctx)
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
        this.speed = 5*60;
        this.facingDirection = direction;

        this.justFired = false;


    }
    update(){
        if(!this.justFired){
            this.justFired = true;
            console.log(this.justFired+" fire sound started")
        }
        if(this.x < -800 || this.x > 2000){
            
            this.removeFromWorld = true;
        }
        if(this.facingDirection == 0){

            this.x -= this.speed*this.game.clockTick;
        }else{
            this.x += this.speed*this.game.clockTick;

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
        if(this.BB != null && this.game.debug == true){
            this.BB.draw(ctx)
        }
    }
}