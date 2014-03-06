var ResourceIndicatorComponent = function(resourceType, x, y)
{
  this.base = PIXI.DisplayObjectContainer;
  this.base();
  this.resourceType = resourceType;
  this.position.x = x;
  this.position.y = y;
  this.bgSprite = PIXI.Sprite.fromImage(assetPathManager.assetPaths.ui.resourceIndicatorBg);
  this.iconSprite = PIXI.Sprite.fromImage(assetPathManager.assetPaths.ui.resources[resourceType][0]);
  this.iconSprite.anchor.x = 0.5;
  this.iconSprite.anchor.y = 0.5;
  this.iconSprite.position.x = 12;
  this.iconSprite.position.y = 10;
  this.text = new PIXI.BitmapText("", {font: "8px small_pixelmix"});
  this.text.position.y = 5;
  this.interactive = true;
  this.mouseover = this.onMouseOver;
  this.mouseout = this.onMouseOut;
  
  this.addChild(this.bgSprite);
  this.addChild(this.iconSprite);
  this.addChild(this.text);
};

ResourceIndicatorComponent.prototype = new PIXI.DisplayObjectContainer;

ResourceIndicatorComponent.prototype.update = function()
{
  this.text.setText(resourceManager.resourceQuantities[this.resourceType].toString());
  this.text.position.x = this.bgSprite.width - (this.text.textWidth + 6);
};

ResourceIndicatorComponent.prototype.onMouseOver = function(e)
{
  screenManager.screens[ScreenType.Tooltip].enableTooltip(this.resourceType);
};

ResourceIndicatorComponent.prototype.onMouseOut = function(e)
{
  screenManager.screens[ScreenType.Tooltip].disableTooltip();
};