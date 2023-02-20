class CharacterController {
    constructor(game,x,y){
        Object.assign(this,{game,x,y});
        
        this.game.player = this;
        
        this.viewWidth = 1424;
        this.viewHeight = 768;


        this.x=0;
        this.y=500;

        this.speed = 100;
        this.velocity = { x: 0, y: 0 };

        this.gravity =  300;
        this.facingDirection = 0;
        this.state = "IDLE";
        this.dead = false;
        this.stoppedBackground = false;

        this.updateBB();
        this.facingDirection = 1;
        this.animationList = [];
        this.getAnimations;
        this.elapsedTime = 0;
        this.totalTime = 5 * 0.2;

        this.spriteSheet = ASSET_MANAGER.getAsset("./assets/Duck Sprite Sheet.png");
   
       // spritesheet, xStart, yStart, width, height, frameCount, frameDuration, loop, spriteBorderWidth=0, xoffset=0, yoffset=0, scale=1, rowCount=1, lineEnd, rowOffset=0
        //(Idle)
        this.animationList["IDLE"] = new Animator(this.spriteSheet,0,0,32,32,1,1,1,0,0,0,4);  
        //Walk
        this.animationList["WALK"] = new Animator(this.spriteSheet,0,0,32,32,5,0.1,1,0,0,0,4);
        //Jump
        this.animationList["JUMP"] = new Animator(this.spriteSheet,0,32,32,32,5,0.05,1,0,0,0,4);
        //Roll
        this.animationList["ROLL"] = new Animator(this.spriteSheet,0,64,32,32,3,0.1,1,0,0,0,4);

        this.runSound = ASSET_MANAGER.getAsset("./assets/running.mp3")
        ASSET_MANAGER.autoRepeat("./assets/running.mp3")
        this.rollSound = ASSET_MANAGER.getAsset("./assets/roll.mp3")
        ASSET_MANAGER.autoRepeat("./assets/roll.mp3")
    };

    updateBB(frame){
        this.lastBB = this.BB;
        

        if(this.state =="WALK" || this.state == "IDLE"|| this.state == "JUMP"){
           
            this.BB = new BoundingBox(this.x+42 , this.y+8 , 52, 66*1.7);
        }else if(this.state == "ROLL"){
           // console.log("roll")
            this.elapsedTime += this.game.clockTick;
            const frame = this.currentFrame( this.elapsedTime , 0.1);
            this.BB = new BoundingBox(this.x+42 , this.y+56 , 52, 51*1.35);
        }
     
    };
    currentFrame(elapsedTime, frameDuration){
        return Math.floor(elapsedTime / frameDuration);
    };

    update(){   
        const MAXRUN = 100;
        if(this.game.camera.score >= 500){
            this.stoppedBackground = true;
        }
        if(this.y > 560) {
            if(this.state=="JUMP"){
                if(this.stoppedBackground){
                    this.state = "IDLE";
                }else{
                    this.state="WALK";
                    this.runSound.play();
                }
            }
            this.y=560;
            this.velocity.y = 0;
            //this.animationList["JUMP"] = new Animator(ASSET_MANAGER.getAsset("./duckies.png"),0,290,72,70,5,0.2,0);
            if(!this.game.keys["s"]){
                this.rollSound.pause();
                this.elapsedTime = 0
                if(this.stoppedBackground){
                    this.state = "IDLE";
                }else{
                    this.state="WALK";
                    this.runSound.play();
                }
            }
        };

        if(this.game.keys["w"] && this.state != "JUMP" && this.state != "ROLL"){
            this.runSound.pause();
            this.state = "JUMP";
            this.velocity.x += 0;
            this.velocity.y -= 200;
            //this.animationList["JUMP"] = new Animator(ASSET_MANAGER.getAsset("./duckies.png"),0,290,72,70,5,0.2,0);
        };

        if(this.game.keys["Space"] && this.state != "JUMP" && this.state != "ROLL"){
            this.runSound.pause();
            this.state = "JUMP";
            this.velocity.x += 0;
            this.velocity.y -= 250;
            //this.animationList["JUMP"] = new Animator(ASSET_MANAGER.getAsset("./duckies.png"),0,290,72,70,5,0.2,0);
   
        };
        if(this.game.keys["s"] && this.state != "JUMP" && this.state != "ROLL"){
            this.state = "ROLL";
            this.runSound.pause();
            this.rollSound.play();
            //this.animationList["ROLL"] = new Animator(ASSET_MANAGER.getAsset("./duckroll.png"),0,0,72,72,8,.1,1);

        };
        

        if(this.game.keys["d"]){
            if(this.stoppedBackground){
                this.facingDirection = 1;
                if(this.state == "IDLE"){
                    this.state = "WALK"
                    this.runSound.play();
                }
            }
            
            
            if(this.velocity.x < 0){
                this.velocity.x = 0
            }
            if(this.velocity.x > MAXRUN){
                this.velocity.x = MAXRUN;
            }else{
            this.velocity.x += 100*this.game.clockTick};
        };

        if(this.game.keys["a"]){
            if(this.stoppedBackground){
                this.facingDirection = 0;
                if(this.state == "IDLE"){
                    this.state = "WALK"
                    this.runSound.play();

                }
            }
            if(this.velocity.x > 0){
                this.velocity.x = 0
            }
            if(this.velocity.x < -MAXRUN){
                this.velocity.x = -MAXRUN;
            }else{
            this.velocity.x -= 100*this.game.clockTick};
        }  

        this.velocity.y += this.gravity*this.game.clockTick;
        
        if(this.x<20){
            this.x = 20
            this.velocity.x = 0;
        }else if(this.x > 1300){
            this.x = 1300;
            this.velocity.x = 0;
        }else{
            this.x += this.velocity.x*this.game.clockTick;
        }
        this.updateBB();

        this.x += this.velocity.x*this.game.clockTick;
        this.y += this.velocity.y*this.game.clockTick;
        
        this.updateBB();

        //Collisions
        var that = this;
        that.game.entities.forEach(function (entity) {    
            if(that != entity && entity.BB && that.BB.collide(entity.BB)){
                
                    if(entity instanceof Tombstone){
                        console.log("I am dead")
                    }
                    if(entity instanceof Dog){
                        
                        that.game.camera.addPoints(50)
                        
                    }
                
            
            }
        })

    };


    draw(ctx) {

        if(this.dead === false){
            ctx.save();
            let destx = this.x;
            let desty = this.y;

            if (!this.facingDirection) {// if facing right
                ctx.scale(-1, 1);
                destx*= -1;
                destx -= this.animationList[this.state].width *4.5;
            }
        
            this.animationList[this.state].drawFrame(this.game.clockTick, ctx, destx, desty);
            ctx.restore();

            //ctx.strokeStyle = "Red";
            //ctx.lineWidth = 5;
            //ctx.strokeRect(this.x+40 , this.y+8 , 56, 68*2);
    
            ctx.strokeStyle = 'Red';
            ctx.strokeRect(this.BB.x, this.BB.y, this.BB.width, this.BB.height);
        }else{
            console.log("we made it")
            //For new game eventually
            //this.game.enemies.speed = 0;
            this.game.background.halt = true;
            this.game.camera.clearEntities();
            this.game.addEntity(new RetryMenu(this.game, this.game.camera.score));
            
        }

    };
}