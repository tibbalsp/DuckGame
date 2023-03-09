class CharacterController {
    constructor(game,x,y){
        Object.assign(this,{game,x,y});
        
        this.game.player = this;
        
        this.viewWidth = 1424;
        this.viewHeight = 768;


        this.x=0;
        this.y=500;

        this.speed = 800;
        this.jumpSpeed = 1000;
        this.velocity = { x: 0, y: 0 };
        this.gravity =  600;
        this.fallAcc = this.gravity;
        this.hover = false;

        this.facingDirection = 0;
        this.state = "IDLE";
        this.lives =0;
        if(this.game.difficulty=="EASY"){
            this.lives = 10;

        }else if(this.game.difficulty=="NORMAL"){
            this.lives = 5;

        }else if(this.game.difficulty=="HARD"){
            this.lives = 3;

        }else if(this.game.difficulty=="HARDCORE"){
            this.lives = 0;

        }
        this.damaged = false;
        this.dead = false;
        this.damageTimeout = 0;
        

        this.stoppedBackground = false;

        this.updateBB();
        this.facingDirection = 1;
        this.animationList = [];

        this.elapsedTime = 0;
        //this.totalTime = 5 * 0.2;

        
        this.regularList = [];
        this.spriteSheet = ASSET_MANAGER.getAsset("./assets/Duck Sprite Sheet.png");
        //(Idle)
        this.regularList["IDLE"] = new Animator(this.spriteSheet,0,0,32,32,1,1,1,0,0,0,4);  
        //Walk
        this.regularList["WALK"] = new Animator(this.spriteSheet,0,0,32,32,5,0.1,1,0,0,0,4);
        //Jump
        this.regularList["JUMP"] = new Animator(this.spriteSheet,0,32,32,32,5,0.05,1,0,0,0,4);
        //Roll
        this.regularList["ROLL"] = new Animator(this.spriteSheet,0,64,32,32,3,0.1,1,0,0,0,4);
        
        this.damagedList = [];
        this.damagedSheet = ASSET_MANAGER.getAsset("./assets/Duck Sprite Sheet Damaged.png");
        //(Idle)
        this.damagedList["IDLE"] = new Animator(this.damagedSheet,0,0,32,32,1,1,1,0,0,0,4);  
        //Walk
        this.damagedList["WALK"] = new Animator(this.damagedSheet,0,0,32,32,5,0.1,1,0,0,0,4);
        //Jump
        this.damagedList["JUMP"] = new Animator(this.damagedSheet,0,32,32,32,5,0.05,1,0,0,0,4);
        //Roll
        this.damagedList["ROLL"] = new Animator(this.damagedSheet,0,64,32,32,3,0.1,1,0,0,0,4);

        this.runSound = ASSET_MANAGER.getAsset("./assets/running.mp3")
        ASSET_MANAGER.autoRepeat("./assets/running.mp3")
        this.rollSound = ASSET_MANAGER.getAsset("./assets/roll.mp3")
        ASSET_MANAGER.autoRepeat("./assets/roll.mp3")

        this.animationList = this.regularList;

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

    switchAnimation(){
        if(this.animationList == this.damagedList){
            console.log("switched to reg")

            this.animationList = this.regularList;
        }else{
            console.log("switched to flash")

            this.animationList = this.damagedList;
        }
    }
    update(){
        this.runSound.volume = 0.07;
        this.rollSound.volume = 0.07;
        this.preVeloY = this.velocity.y;   
        const FALL = 1575;
        const MAXRUN = 400;
        
        this.hover = false;

        if(this.game.keys["Escape"]){
            this.game.camera.clearEntities();
            this.removeFromWorld = true;
            if( this.game.bgm != null){
                this.game.bgm.pause();
            }
            this.game.addEntity(new Menu(this.game));        
        }        

        if(this.damaged){
            this.damageTimeout += this.game.clockTick;
            if(this.damageTimeout > 3){
                this.damaged = false;
                this.switchAnimation();
            }
        }
       
        if(this.lives < 0){
            this.dead = true;
        }else{

            if(this.game.camera.bossSwitchTime >= 10){
                this.stoppedBackground = true;
            }
    

            if(this.y > 560) {
                this.fallAcc = this.gravity;
                if(this.state=="JUMP"){
                    if(this.stoppedBackground && !this.game.keys["d"] && !this.game.keys["a"]){
                        this.state = "IDLE";
                        this.velocity.x = 0;
                    }else{
                        this.state="WALK";
                        if(!this.game.mute){
                            this.runSound.play();
                        }
                    }
                }
                this.y=560;
                this.velocity.y = 0;
                //this.animationList["JUMP"] = new Animator(ASSET_MANAGER.getAsset("./duckies.png"),0,290,72,70,5,0.2,0);
                
                if(this.stoppedBackground && this.state=="WALK" && !this.game.keys["d"] && !this.game.keys["a"]){
                    this.state ="IDLE";
                    this.velocity.x = 0;
                }


                if(!this.game.keys["s"]){
                    if(!this.game.mute){
                        this.rollSound.pause();
                    }
                    
                    this.elapsedTime = 0
                    if(this.stoppedBackground && this.state !="WALK"){
                        this.state = "IDLE";

                    }else{
                        this.state="WALK";
                        if(!this.game.mute){
                            this.runSound.play();
                        }                    }
                }

            };

            if(this.game.keys["w"] && this.state != "ROLL"){
                if(this.state != "JUMP" ){
                    if(!this.game.mute){
                        this.runSound.pause();
                    }
                    this.state = "JUMP";
                    this.fallAcc = this.gravity;
                    this.velocity.y -= this.jumpSpeed*20*this.game.clockTick;
                }else{
                    this.hover = true;
                }
            };


            if(this.game.keys["s"]  && this.state != "ROLL"){
                if(this.state == "JUMP"){
                    this.velocity.y +=15;
                }else{
                    this.state = "ROLL";
                    if(!this.game.mute){
                        this.runSound.pause();
                        this.rollSound.play();
                    }
                    
                }


            };
            

            if(this.game.keys["d"]){
                if(this.stoppedBackground){
                    this.facingDirection = 1;
                    if(this.state == "IDLE"){
                        this.state = "WALK"
                        if(!this.game.mute){
                            this.runSound.play();
                        }
                    }
                }
                
                
                if(this.velocity.x < 0){
                    this.velocity.x = 0
                }
                if(this.velocity.x > MAXRUN){
                    this.velocity.x = MAXRUN;
                }else{
                    this.velocity.x += this.speed*this.game.clockTick;
                }
                
            }else if(this.game.keys["a"]){
                if(this.stoppedBackground){
                    this.facingDirection = 0;
                    if(this.state == "IDLE"){
                        this.state = "WALK"
                        if(!this.game.mute){
                            this.runSound.play();
                        }

                    }
                }
                if(this.velocity.x > 0){
                    this.velocity.x = 0
                }
                if(this.velocity.x < -MAXRUN){
                    this.velocity.x = -MAXRUN;
                }else{
                    this.velocity.x -= this.speed*this.game.clockTick;
                }
            }  

            
            
            if(this.x<10){
                this.x = 10
                this.velocity.x = 0;
            }else if(this.x > 1325){
                this.x = 1325;
                this.velocity.x = 0;
            }else{
        
            }
            this.updateBB();

            this.x += this.velocity.x*this.game.clockTick;

            if (this.velocity.y < 0 && this.preVeloY <= 0) { // jump
                this.hover = true;
            }

            if(this.hover){
                this.fallAcc = this.gravity;
            }else{
                this.fallAcc = FALL;
            }

            this.velocity.y += this.fallAcc * this.game.clockTick;
           // console.log(this.velocity.y+"   "+this.preVeloY)
            this.y += this.velocity.y*this.game.clockTick;

            this.updateBB();
         //   console.log(this.state);

            //Collisions
            var that = this;
            this.game.entities.forEach(function (entity) {    
                if(that != entity && that.damaged==false && entity.BB && that.BB.collide(entity.BB)){
                        
                        if(entity instanceof Tombstone){
                            console.log("tombstone")
                            that.switchAnimation();
                            that.damaged = true;
                            that.lives -= 1;
                            that.damageTimeout = 0;
                        }
                        if(entity instanceof Dog && that.state != "ROLL"){
                            console.log("dog")
                            that.switchAnimation();
                            that.damaged = true;
                            that.lives -= 1;
                            that.damageTimeout = 0;
                            
                        }
                        if(entity instanceof Grim ){
                            console.log("grim")
                            if(entity.damaged==1 && !that.damaged){
                                that.switchAnimation();
                                that.damaged = true;
                                that.lives -= 1;
                                that.damageTimeout = 0;
                            }else if(that.lastBB.bottom < entity.BB.top && entity.damaged==0){
                                that.velocity.y -= 250;
                                that.y -=150;

                            }else if(that.state == "ROLL" && entity.damaged == 0){
                                if(that.lastBB.right < entity.lastBB.left){
                                    that.x -=20;
                                }else  if(that.lastBB.left > entity.lastBB.right){
                                    that.x +=20;
                                    
                                }

                            }else{
                                that.switchAnimation();
                                that.damaged = true;
                                that.lives -= 1;
                                that.damageTimeout = 0;
                            }
                    
                        }
                        if(entity instanceof FireBall){
                           that.switchAnimation();
                           that.damaged = true;
                           that.lives -= 1;
                           that.damageTimeout = 0;
                        }
                    
                
                }
            })
        }

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
            if(this.BB != null && this.game.debug == true){
                this.BB.draw(ctx)
            }
            //ctx.strokeStyle = "Red";
            //ctx.lineWidth = 5;
            //ctx.strokeRect(this.x+40 , this.y+8 , 56, 68*2);
    
          //  ctx.strokeStyle = 'Red';
         //   ctx.strokeRect(this.BB.x, this.BB.y, this.BB.width, this.BB.height);
        }else{
            //For new game eventually
            //this.game.enemies.speed = 0;
            this.game.background.halt = true;
            this.game.camera.clearEntities();
            this.game.addEntity(new RetryMenu(this.game, this.game.camera.score));
            
        }

    };
}