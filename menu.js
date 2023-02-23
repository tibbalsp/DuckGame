class Menu{
    constructor(game, x, y) {
        Object.assign(this, { game});
        this.game = game;
        this.game.mute = false;
        this.duckSheet = ASSET_MANAGER.getAsset("./assets/Duck Sprite Sheet.png");
        this.duckAnimation = new Animator(this.duckSheet,0,0,32,32,5,0.1,1,0,0,0,1);
        this.dogSheet = ASSET_MANAGER.getAsset("./assets/dog.png");
        this.dogAnimation = new Animator(this.dogSheet,0,0,52,38,3,0.2,1,0,0,0,1);
        this.grimSheet = ASSET_MANAGER.getAsset("./assets/reaper.png");
        this.grimAnimation = new Animator(this.grimSheet,0,0,32,31,3,0.2,1,0,0,0,1);
        this.grimDeath = ASSET_MANAGER.getAsset("./assets/reaperDamaged.png");
        this.grimDeathAnimation = new Animator(this.grimDeath,0,0,32,31,6,0.1,1,0,0,0,1);

        this.difficulty = "NORMAL";

    };

    update(){
        //Play button
        if(this.game.click && this.game.click.y > 160 && this.game.click.y < 200 && this.game.click.x > 625 && this.game.click.x <720){
            this.game.click.y = 0;
            this.removeFromWorld = true;
            this.game.addEntity(new SceneManager(this.game,this.difficulty));
        }
        //Difficulty setting
        //Easy
        if(this.game.click && this.game.click.y > 216 && this.game.click.y < 254){
            if(this.game.click.x > 300 && this.game.click.x < 475){
                this.difficulty = "EASY"
            }else if(this.game.click.x > 475 && this.game.click.x < 680){
                this.difficulty = "NORMAL"

            }else if(this.game.click.x > 680 && this.game.click.x < 870){
                this.difficulty = "HARD"

            }else if(this.game.click.x > 870 && this.game.click.x < 1140){
                this.difficulty = "HARDCORE"

            }

        }
        //Mute Sounds
        if(this.game.click && this.game.click.y > 110 && this.game.click.y < 140 &&this.game.click.x > 330 && this.game.click.x < 360){
            this.game.mute = true;            
        }

        
    }
  
    
    draw(ctx){ 

        ctx.drawImage(ASSET_MANAGER.getAsset("./assets/Spooky Cemetery Collapsed.png"), 0,0, 1920, 768,);

        const offsetX = 250;
        const offsetY = 100
        
          
        ctx.fillStyle = 'Black';

        ctx.strokeStyle = 'GREEN';
        ctx.lineWidth = 3;
        ctx.strokeRect(offsetX,offsetY, params.canvasWidth-500, params.canvasHeight-300);
        ctx.strokeStyle = 'Black'
        ctx.fillRect(offsetX+2,offsetY+2,params.canvasWidth-504,params.canvasHeight-304)


        ctx.strokeStyle = 'RED';
        ctx.fillStyle = 'RED';
        ctx.font =  '24px ""';

        ctx.fillText("MUTE", 255,135);

        ctx.strokeRect(330 ,110, 30,30 );
        if(this.game.mute ||(this.game.mouse && this.game.mouse.y > 110 && this.game.mouse.y < 140 &&this.game.mouse.x > 330 && this.game.mouse.x < 360)){
            ctx.fillRect(334 ,114, 22,22 );
            
        }



        ctx.fillStyle = 'Grey';

        ctx.strokeRect(253 ,310, 400, 255);
        ctx.fillRect(255 ,312, 396, 252);
        ctx.fillStyle = 'RED';
        ctx.font =  '36px ""';
        ctx.fillText("CONTROLS", 300,300);
        ctx.fillStyle = 'Black';
        ctx.font =  '24px ""';
        ctx.fillText(" A  "+'\u2192'+" Move Left", 270,350);
        ctx.fillText(" D  " +'\u2192'+" Move Right", 270,400);
        ctx.fillText(" W " +'\u2192' +" Jump", 270,450);

        ctx.fillText(" S  "+'\u2192'+" Roll", 270,500);
        ctx.fillText(" S  "+'\u2192'+" Hold when airborne to fall faster", 270,550);

        ctx.strokeStyle = 'Blue';
        ctx.fillStyle = 'Blue';
        ctx.font =  '36px ""';
        ctx.fillText("SURVIVAL TIPS", 700,300);

        ctx.font =  '20px ""';
        ctx.fillText(" -ROLL INTO DOGS TO SCARE THEM AWAY", 700,340);
        ctx.fillText(" -SCARING DOGS AWARDS EXTRA POINTS", 700,370);
        ctx.fillText("-EVENTUALLY THE REAPER WILL APPEAR", 700,440);
        ctx.fillText("-DAMAGE THE REAPER BY JUMPING ON ITS HEAD", 700,470);
        ctx.fillText("-WHEN CHANGING COLORS HIS TOUCH WILL KILL", 700,540);

        this.dogAnimation.drawFrame(this.game.clockTick, ctx, 665, 330);

        this.grimAnimation.drawFrame(this.game.clockTick, ctx, 665, 430);
        this.grimDeathAnimation.drawFrame(this.game.clockTick, ctx, 665, 520);


        ctx.strokeRect(655 ,310, 536, 256);

        
        ctx.font =  '60px ""'
        ctx.fillStyle = 'Yellow';
        ctx.fillText("Cemetery Survival", 500,150);

        

        ctx.strokeStyle = 'RED';
        ctx.font =  '36px ""'
        ctx.fillText("Play", 625,200);

        ctx.strokeStyle = 'lime';
        ctx.strokeRect(300 ,215, 840, 40);


        ctx.fillStyle = 'yellow';
        if(this.difficulty == "EASY"){
            ctx.fillRect(300 ,216, 175, 38);

        }else if(this.difficulty == "HARD"){
            ctx.fillRect(680 ,216, 190, 38);

        }else if(this.difficulty == "HARDCORE"){
            ctx.fillRect(870 ,216, 270, 38);

        }else{
            ctx.fillRect(475 ,216, 205, 38);
        }


        if(this.game.mouse && this.game.mouse.y > 216 && this.game.mouse.y < 254){
            if(this.game.mouse.x > 300 && this.game.mouse.x < 475){
                this.difficulty = "EASY";
                ctx.fillRect(300 ,216, 175, 38);

            }else if(this.game.mouse.x > 475 && this.game.mouse.x < 680){
                this.difficulty = "NORMAL";
                ctx.fillRect(475 ,216, 205, 38);


            }else if(this.game.mouse.x > 680 && this.game.mouse.x < 870){
                this.difficulty = "HARD";
                ctx.fillRect(680 ,216, 190, 38);


            }else if(this.game.mouse.x > 870 && this.game.mouse.x < 1140){
                this.difficulty = "HARDCORE";
                ctx.fillRect(870 ,216, 270, 38);


            }

        }
        ctx.fillStyle = 'RED';
        ctx.fillText("EASY", 350,247);
        ctx.fillText("NORMAL", 500,247);
        ctx.fillText("HARD", 725,247);
        ctx.fillText("HARDCORE", 908,247);


        if ((this.game.mouse && this.game.mouse.y > 160 && this.game.mouse.y < 200 && this.game.mouse.x > 625 && this.game.mouse.x <720)) {
            ctx.fillStyle = 'Yellow';
            ctx.font =  '64px ""';
            this.duckAnimation.drawFrame(this.game.clockTick, ctx, 585, 170);
        }





    };
}
