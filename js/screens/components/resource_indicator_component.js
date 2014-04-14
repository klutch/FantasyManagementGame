var ResourceIndicatorComponent = function(screen, resourceType, x, y)
{
  this.base = PIXI.DisplayObjectContainer;
  this.base();
  this.screen = screen;
  this.resourceType = resourceType;
  this.position.x = x;
  this.position.y = y;
  this.bgSprite = PIXI.Sprite.fromImage(game.assetManager.paths.ui.resourceIndicatorBg);
  this.iconSprite = PIXI.Sprite.fromImage(game.assetManager.paths.ui.resources[resourceType][0]);
  this.iconSprite.anchor.x = 0.5;
  this.iconSprite.anchor.y = 0.5;
  this.iconSprite.position.x = 12;
  this.iconSprite.position.y = 10;
  this.text = new PIXI.BitmapText("", {font: "8px small_pixelmix"});
  this.text.position.y = 5;
  this.interactive = true;
  this.mouseover = this.onMouseOver;
  this.mouseout = this.onMouseOut;
  this.resourceSystem = game.systemManager.getSystem(SystemType.Resource);
  
  this.addChild(this.bgSprite);
  this.addChild(this.iconSprite);
  this.addChild(this.text);
};

ResourceIndicatorComponent.prototype = new PIXI.DisplayObjectContainer;

ResourceIndicatorComponent.prototype.update = function()
{
  this.text.setText(this.resourceSystem.resourceQuantities[this.resourceType].toString());
  this.text.position.x = this.bgSprite.width - (this.text.textWidth + 6);
};

ResourceIndicatorComponent.prototype.onMouseOver = function(e)
{
  if (this.screen.inputEnabled)
  {
    game.screenManager.screens[ScreenType.Tooltip].addTooltip("resourceBar", this.resourceType, this.resourceType);
  }
};

ResourceIndicatorComponent.prototype.onMouseOut = function(e)
{
  if (this.screen.inputEnabled)
  {
    game.screenManager.screens[ScreenType.Tooltip].removeTooltip("resourceBar", this.resourceType);
  }
};