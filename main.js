var gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./duckies.png")
ASSET_MANAGER.queueDownload("./duckroll.png")

ASSET_MANAGER.queueDownload("./Forest.png")
ASSET_MANAGER.queueDownload("./tombstone.png")
ASSET_MANAGER.queueDownload("./dog.png")

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
