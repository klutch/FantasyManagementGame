var ResourceIndicatorComponent = function(resourceType, x, y)
{
  this.base = PIXI.DisplayObjectContainer;
  this.base();
  this.resourceType = resourceType;
  this.position.x = x;
  this.position.y = y;
  this.bgSprite = PIXI.Sprite.fromImage(assetPathManager.assetPaths.ui.resourceIndicatorBg);
  this.text = new PIXI.BitmapText("", {font: "8px small_pixelmix"});
  this.text.position.y = 5;
  
  this.addChild(this.bgSprite);
  this.addChild(this.text);
};

ResourceIndicatorComponent.prototype = new PIXI.DisplayObjectContainer;

ResourceIndicatorComponent.prototype.update = function()
{
  this.text.setText(resourceManager.resourceQuantities[this.resourceType].toString());
  this.text.position.x = this.bgSprite.width - (this.text.textWidth + 6);
};