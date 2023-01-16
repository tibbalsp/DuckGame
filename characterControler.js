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

        this.gravity = 150;
        this.facingDirection = 0;
        this.state = 0;
        this.dead = false;


        this.updateBB();
        
        this.animationList = [];
        this.getAnimations;
        this.game.addEntity(new Background(this.game));

   
        //(Idle)
        this.animationList[0] = new Animator(ASSET_MANAGER.getAsset("./duckies.png"),0,0,72,72,6.2,0.2,0);  
        //Walk
        this.animationList[1] = new Animator(ASSET_MANAGER.getAsset("./duckies.png"),0,145,72,72,8,0.4,1);
        //Jump
        this.animationList[2] = new Animator(ASSET_MANAGER.getAsset("./duckies.png"),0,290,72,70,6,0.27,0);
        //Roll
        this.animationList[3] = new Animator(ASSET_MANAGER.getAsset("./duckroll.png"),0,0,72,72,8,.1,1);


    };

    updateBB(){
        this.lastBB = this.BB;
        this.BB = new BoundingBox(this.x+40 , this.y+8 , 56, 68*2);
        



    };

    update(){   
        const MAXRUN = 50;
        
        if(this.y > 600) {
            this.y=600;
            this.velocity.y = 0;
            this.animationList[2] = new Animator(ASSET_MANAGER.getAsset("./duckies.png"),0,290,72,70,6,0.27,0);

            this.state = 1;
        };

        if(this.game.keys["w"] && this.state != 2){
                this.state = 2;
                this.velocity.x += 0;
                this.velocity.y -= 150;
                this.animationList[2] = new Animator(ASSET_MANAGER.getAsset("./duckies.png"),0,290,72,70,6,0.27,0);
        };

        if(this.game.keys["Space"] && this.state != 2){
            this.state = 2;
            this.velocity.x += 0;
            this.velocity.y -= 200;
            this.animationList[2] = new Animator(ASSET_MANAGER.getAsset("./duckies.png"),0,290,72,70,6,0.27,0);

   
        };
        if(this.game.keys["s"]){
            this.state = 3;
        
        };
        

        if(this.game.keys["d"]){
            if(this.velocity.x > MAXRUN){
                this.velocity.x = MAXRUN;
            }else{
            this.velocity.x += 50*this.game.clockTick};
        };

        if(this.game.keys["a"]){

            if(this.velocity.x < -MAXRUN){
                this.velocity.x = -MAXRUN;
            }else{
            this.velocity.x -= 50*this.game.clockTick};
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
        }

    };
}