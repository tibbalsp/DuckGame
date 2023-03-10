class SceneManager{
    

    constructor(game,difficulty){
        this.game = game;
        this.game.camera = this;
        this.game.difficulty = difficulty;
        this.x = 0;
        this.score = 0;

        this.player = new CharacterController(this.game,50,550);
       
        this.elapsedGraveTime = 0;
        this.elapsedDogTime = 0;
        this.scoreTime = 0;

        this.graveSpawns = [0.5,1,3,5];
        this.dogSpawns =[5,7,11];
        this.randomGraveSpawn = 0;
        this.randomDogSpawn = 0;
        this.bossSwitchTime =0;
        this.GraveSpawn();
        this.DogSpawn();
        this.loadLevel(50,550);
        this.dogCount = 0;
        this.grimCount = 0;
        this.spriteSheet = ASSET_MANAGER.getAsset("./assets/Duck Sprite Sheet.png");
        this.bossScore = 0;
        this.game.grimSpawnMusic = ASSET_MANAGER.getAsset("./assets/bossSpawn.mp3");
        ASSET_MANAGER.autoRepeat("./assets/bossSpawn.mp3")
        this.gameOver = false;
        
        if(difficulty == "EASY"){
            this.bossScore = 200;
        }else if(difficulty == "NORMAL"){
            this.bossScore = 500;
        }else if(difficulty == "HARD"){
            this.bossScore = 750;
        }else if(difficulty == "HARDCORE"){
            this.bossScore = 1000;
        }else if(difficulty == "ENDLESS"){
            this.bossScore = Number.MAX_SAFE_INTEGER;
        }
    };


    loadLevel(x,y){
        this.game.entities = [];
        this.x =0;
        this.player.x = x;
        this.player.y = y;
        this.player.velocity = { x: 0, y: 0 };
      
       //this.player = (new CharacterController(gameEngine),50,550)

       this.game.addEntity(this.player);
       //this.game.addEntity(new Tombstone(this.game,1920,700))
       
       
 



    };
    addPoints(p) {
        this.scoreTime += p;
        this.draw(this.game.ctx)
    };

    GraveSpawn(){
        this.prevGraveSpawn = this.randomGraveSpawn;
        
        while(this.prevGraveSpawn === this.randomGraveSpawn){
            this.randomGraveSpawn = Math.floor(Math.random() * this.graveSpawns.length);
        }
    };

    DogSpawn(){
        this.prevDogSpawn = this.randomDogSpawn;
        
        while(this.prevDogSpawn === this.randomDogSpawn){
            this.randomDogSpawn = Math.floor(Math.random() * this.dogSpawns.length);
        }
    };
    clearEntities() {
       
        this.game.entities.forEach(function (entity) {
            entity.removeFromWorld = true;
        });
        this.removeFromWorld = true;
    };
    GrimSpawn(){
        if(this.grimCount < 1){
            if(!this.game.mute){
                this.game.grimSpawnMusic.play();
            }else{
                this.game.grimSpawnMusic.pause();
            }
            this.game.addEntity(new Grim(this.game, 1400,-100));
            this.grimCount++;
        }
    }
    update() {
        if(this.gameOver){
            this.clearEntities();
            this.game.addEntity(new Win(this.game));
            
        }
        if(this.score >= this.bossScore){
            this.bossSwitchTime += this.game.clockTick;
            this.GrimSpawn();
            if(this.bossSwitchTime > 5){
                this.game.background.updateSpeed(true);

            }
        }else{

            this.elapsedGraveTime += this.game.clockTick;
            this.elapsedDogTime += this.game.clockTick;

            
            //this.game.addEntity(new Tombstone(this.game,1920,700))
            if(this.elapsedGraveTime > this.graveSpawns[this.randomGraveSpawn]&& this.player.dead==false){
                this.elapsedGraveTime=0;
                this.GraveSpawn();
                console.log("make tombstone")
                this.game.addEntity(new Tombstone(this.game,1920,610))
            }
             
            if(this.score > 10 && this.elapsedDogTime > this.dogSpawns[this.randomDogSpawn]&& this.player.dead==false){
                this.elapsedDogTime=0;
                this.DogSpawn();
                console.log("make dog")
                this.game.addEntity(new Dog(this.game,-50,620))
            }
        }
    };

    draw(ctx){


        if(this.player.dead==true){

        }else{

            for(let i = 0 ; i < this.player.lives;i++){
                ctx.drawImage(this.spriteSheet,0,0,32,32,0+32*i,0,48,48)
            }
            
            this.scoreTime += this.game.clockTick;
            if(this.score <= this.bossScore){
                ctx.font =  '60px "a"'
                ctx.fillStyle = "RED";
                this.score = Math.floor(this.scoreTime);
                ctx.fillText("SCORE:"+this.score+" ", 1000 ,100);
            }

        }

    };

};