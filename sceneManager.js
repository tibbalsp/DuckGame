class SceneManager{
    

    constructor(game){
        this.game = game;
        this.game.camera = this;
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
        this.GraveSpawn();
        this.DogSpawn();
        this.loadLevel(50,550);
        this.bgm = null;
    };


    loadLevel(x,y){
        this.game.entities = [];
        this.x =0;
        this.player.x = x;
        this.player.y = y;
        this.player.velocity = { x: 0, y: 0 };
        if(this.bgm == null){
            this.bgm = ASSET_MANAGER.getAsset("./assets/level1.mp3");
            ASSET_MANAGER.autoRepeat("./assets/level1.mp3");
            this.bgm.play();
        }
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
    };

    update() {

        if(this.score >= 500){
            console.log("hello")
            this.game.background.updateSpeed(true);

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
            if(this.scoreTime > 10 && this.elapsedDogTime > this.dogSpawns[this.randomDogSpawn]&& this.player.dead==false){
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
            this.scoreTime += this.game.clockTick;
         //   console.log(this.scoreTime);
            //this.score = this.game.clockTick;
            ctx.font =  '60px "a"'
            ctx.fillStyle = "RED";
            this.score = Math.floor(this.scoreTime);
            ctx.fillText("SCORE:"+this.score+" ", 1000 ,100);


        }

    };

};