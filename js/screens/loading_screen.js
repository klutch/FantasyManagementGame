var LoadingScreen = function()
{
  this.type = ScreenType.Loading;
  
  // Background
  this.background = PIXI.Sprite.fromImage(assetPathManager.assetPaths.ui.black);
  this.background.width = game.containerWidth;
  this.background.height = game.containerHeight;
  this.background.alpha = 0.5;
  
  // Progress bar
  this.progressBar = new ProgressBarComponent({
    x: Math.floor(game.containerWidth * 0.5),
    y: Math.floor(game.containerHeight * 0.5),
    centerX: true,
    centerY: false
  });
};

LoadingScreen.prototype.onAddScreen = function()
{
  game.stage.addChild(this.background);
  game.stage.addChild(this.progressBar);
};

LoadingScreen.prototype.onRemoveScreen = function()
{
  game.stage.removeChild(this.background);
  game.stage.removeChild(this.progressBar);
};

LoadingScreen.prototype.setProgress = function(ratio)
{
  this.progressBar.setProgress(ratio);
};

LoadingScreen.prototype.update = function()
{
};