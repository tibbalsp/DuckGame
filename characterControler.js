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


        this.updateBB();
        
        this.animationList = [];
        this.getAnimations;
        this.game.addEntity(new Background(this.game));
        this.elapsedTime =0;
        this.totalTime = 5 * 0.2;


   
        //(Idle)
        this.animationList["IDLE"] = new Animator(ASSET_MANAGER.getAsset("./duckies.png"),0,0,72,72,6.2,0.2,0);  
        //Walk
        this.animationList["WALK"] = new Animator(ASSET_MANAGER.getAsset("./duckies.png"),0,145,72,72,8,0.4,1);
        //Jump
        this.animationList["JUMP"] = new Animator(ASSET_MANAGER.getAsset("./duckies.png"),0,290,72,70,5,0.2,0);
        //Roll
        this.animationList["ROLL"] = new Animator(ASSET_MANAGER.getAsset("./duckroll.png"),0,0,72,72,8,.1,1);


    };

    updateBB(frame){
        this.lastBB = this.BB;
        

        if(this.state =="WALK" || this.state == "IDLE"){
           
            this.BB = new BoundingBox(this.x+42 , this.y+8 , 52, 66*2);
        
        }else if(this.state == "JUMP"){            
            this.elapsedTime += this.game.clockTick;

            const frame = this.currentFrame( this.elapsedTime , 0.22);
            //console.log(frame);

            if(frame==1){
                this.BB = new BoundingBox(this.x+42 , this.y+8 , 10, 66*2);
            }else if(frame==2){
                this.BB = new BoundingBox(this.x+42 , this.y+8 , 10, 66*2);
            }else if(frame==3){
                this.BB = new BoundingBox(this.x+42 , this.y+8 , 10, 66*2);
            }else if(frame==4){
                this.BB = new BoundingBox(this.x+42 , this.y+8 , 10, 66*2);
            }else if(frame >= 5){
                this.BB = new BoundingBox(this.x+42 , this.y+8 , 52, 66*2);
            }

        }else if(this.state == "ROLL"){
           // console.log("roll")
            this.elapsedTime += this.game.clockTick;
            const frame = this.currentFrame( this.elapsedTime , 0.1);

            if(frame==1){
                this.BB = new BoundingBox(this.x+42 , this.y+28 , 52, 51*2);
            }else if(frame==2){
                this.BB = new BoundingBox(this.x+42 , this.y+28 , 52, 51*2);
            }else if(frame==3){
                this.BB = new BoundingBox(this.x+42 , this.y+28 , 52, 51*2);
            }else if(frame==4){
                this.BB = new BoundingBox(this.x+42 , this.y+28 , 52, 51*2);
            }else if(frame==5){
                this.BB = new BoundingBox(this.x+42 , this.y+28 , 52, 51*2);
            }else if(frame==6){
                this.BB = new BoundingBox(this.x+42 , this.y+28 , 52, 51*2);
            }else if(frame==7){
                this.BB = new BoundingBox(this.x+42 , this.y+28 , 52, 51*2);
            }else if(frame==8){
                this.BB = new BoundingBox(this.x+42 , this.y+28 , 52, 51*2);
            }else if(frame==9){
                this.BB = new BoundingBox(this.x+42 , this.y+28 , 52, 51*2);
            }else if(frame > 9){
                this.elapsedTime = 0;
            }
            
        }
     
    };
    currentFrame(elapsedTime, frameDuration){
        return Math.floor(elapsedTime / frameDuration);
    };

    update(){   
        const MAXRUN = 100;
        
        if(this.y > 600) {
            if(this.state=="JUMP"){
                this.state="WALK";
            }
            this.y=600;
            this.velocity.y = 0;
            this.animationList["JUMP"] = new Animator(ASSET_MANAGER.getAsset("./duckies.png"),0,290,72,70,5,0.2,0);
            if(!this.game.keys["s"]){
                this.elapsedTime = 0
                this.state = "WALK";
                
            }
        };

        if(this.game.keys["w"] && this.state != "JUMP" && this.state != "ROLL"){
                this.state = "JUMP";
                this.velocity.x += 0;
                this.velocity.y -= 200;
                this.animationList["JUMP"] = new Animator(ASSET_MANAGER.getAsset("./duckies.png"),0,290,72,70,5,0.2,0);
        };

        if(this.game.keys["Space"] && this.state != "JUMP" && this.state != "ROLL"){
            this.state = "JUMP";
            this.velocity.x += 0;
            this.velocity.y -= 250;
            this.animationList["JUMP"] = new Animator(ASSET_MANAGER.getAsset("./duckies.png"),0,290,72,70,5,0.2,0);
   
        };
        if(this.game.keys["s"] && this.state != "JUMP" && this.state != "ROLL"){
            this.state = "ROLL";
            this.animationList["ROLL"] = new Animator(ASSET_MANAGER.getAsset("./duckroll.png"),0,0,72,72,8,.1,1);

        };
        

        if(this.game.keys["d"]){
            if(this.velocity.x < 0){
                this.velocity.x = 0
            }
            if(this.velocity.x > MAXRUN){
                this.velocity.x = MAXRUN;
            }else{
            this.velocity.x += 100*this.game.clockTick};
        };

        if(this.game.keys["a"]){

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
            this.animationList[this.state].drawFrame(this.game.clockTick, ctx, this.x, this.y);
            //ctx.strokeStyle = "Red";
            //ctx.lineWidth = 5;
            //ctx.strokeRect(this.x+40 , this.y+8 , 56, 68*2);
    
            ctx.strokeStyle = 'Red';
            ctx.strokeRect(this.BB.x, this.BB.y, this.BB.width, this.BB.height);
        }else{

//For new game eventually
            //this.game.enemies.speed = 0;
            this.game.background.speed =0;
            this.game.camera.clearEntities();
            this.game.addEntity(new RetryMenu(this.game, this.game.camera.score));
            
        }

    };
}