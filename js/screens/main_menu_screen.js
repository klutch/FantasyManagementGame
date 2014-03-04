var MainMenuScreen = function()
{
  // Background
  this.backgroundSprite = new PIXI.Sprite(PIXI.Texture.fromImage(assetPathManager.assetPaths.ui.black));
  this.backgroundSprite.width = containerWidth;
  this.backgroundSprite.height = containerHeight;
  
  // Container
  this.container = new PIXI.DisplayObjectContainer();
  this.container.position.y = containerHeight * 0.5;
  this.container.position.x = containerWidth * 0.5;
  
  // Logo
  this.logoSprite = new PIXI.Sprite(PIXI.Texture.fromImage(assetPathManager.assetPaths.ui.logo));
  this.logoSprite.anchor = new PIXI.Point(0.5, 0.5);
  this.logoSprite.position.y = -100;
  
  // Buttons
  this.newGameButton = new ButtonComponent({
    x: 0,
    y: 0,
    text: "Start new game",
    centerX: true,
    centerY: true,
    normalTexture: PIXI.Texture.fromImage(assetPathManager.assetPaths.ui.mainMenuButtons[0]),
    hoverTexture: PIXI.Texture.fromImage(assetPathManager.assetPaths.ui.mainMenuButtons[1]),
    onClick: function (e) { alert('start new game'); }
  });
  
  this.container.addChild(this.logoSprite);
  this.container.addChild(this.newGameButton);
};

MainMenuScreen.prototype.onAddScreen = function()
{
  stage.addChild(this.backgroundSprite);
  stage.addChild(this.container);
};

MainMenuScreen.prototype.onRemoveScreen = function()
{
  stage.removeChild(this.backgroundSprite);
  stage.removeChild(this.container);
};

MainMenuScreen.prototype.update = function()
{
};