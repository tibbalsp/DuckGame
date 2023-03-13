var gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./assets/Spooky Cemetery Collapsed.png")
ASSET_MANAGER.queueDownload("./assets/hellgate.png")
ASSET_MANAGER.queueDownload("./assets/Duck Sprite Sheet.png")

ASSET_MANAGER.queueDownload("./assets/fireball.png")
ASSET_MANAGER.queueDownload("./assets/reaper.png")
ASSET_MANAGER.queueDownload("./assets/Cross.png")
ASSET_MANAGER.queueDownload("./assets/Headstone.png")
ASSET_MANAGER.queueDownload("./assets/dog.png")

ASSET_MANAGER.queueDownload("./assets/Duck Sprite Sheet Damaged.png")
ASSET_MANAGER.queueDownload("./assets/duckAttack.png")
ASSET_MANAGER.queueDownload("./assets/reaperDamaged.png")

//Music Assests 
ASSET_MANAGER.queueDownload("./assets/running.mp3")
ASSET_MANAGER.queueDownload("./assets/roll.mp3")
ASSET_MANAGER.queueDownload("./assets/level1.mp3")
ASSET_MANAGER.queueDownload("./assets/boss.mp3")
ASSET_MANAGER.queueDownload("./assets/bossSpawn.mp3")
ASSET_MANAGER.queueDownload("./assets/fireball.mp3")
ASSET_MANAGER.queueDownload("./assets/quack.mp3")
ASSET_MANAGER.queueDownload("./assets/wingflap.mp3")



ASSET_MANAGER.downloadAll(() => {
	var canvas = document.getElementById("gameWorld");
	var ctx = canvas.getContext("2d");
	
	params.canvasWidth = 1444
	params.canvasHeight = 768;

	ctx.imageSmoothingEnabled = false;

	gameEngine.init(ctx);
	gameEngine.addEntity(new Menu(gameEngine));
	gameEngine.start();
});
