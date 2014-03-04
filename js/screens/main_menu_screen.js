var MainMenuScreen = function()
{
  this.type = ScreenType.MainMenu;
  
  // Background
  this.backgroundSprite = new PIXI.Sprite(PIXI.Texture.fromImage(assetPathManager.assetPaths.ui.black));
  this.backgroundSprite.width = game.containerWidth;
  this.backgroundSprite.height = game.containerHeight;
  
  // Container
  this.container = new PIXI.DisplayObjectContainer();
  this.container.position.y = game.containerHeight * 0.5;
  this.container.position.x = game.containerWidth * 0.5;
  
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
    onClick: function (e)
      {
        game.closeMainMenu();
        game.startNewGame();
      }
  });
  
  this.container.addChild(this.logoSprite);
  this.container.addChild(this.newGameButton);
};

MainMenuScreen.prototype.onAddScreen = function()
{
  game.stage.addChild(this.backgroundSprite);
  game.stage.addChild(this.container);
};

MainMenuScreen.prototype.onRemoveScreen = function()
{
  game.stage.removeChild(this.backgroundSprite);
  game.stage.removeChild(this.container);
};

MainMenuScreen.prototype.update = function()
{
};