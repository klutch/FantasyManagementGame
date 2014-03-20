var PortraitComponent = function(adventurerId, options)
{
  options = options || {};
  options.x = options.x || 0;
  options.y = options.y || 0;
  
  this.base = PIXI.DisplayObjectContainer;
  this.base();
  this.adventurerId = adventurerId;
  this.adventurer = adventurerManager.adventurers[adventurerId];
  this.position.x = options.x;
  this.position.y = options.y;
  this.portraitSprite = PIXI.Sprite.fromImage(assetPathManager.assetPaths.ui.portraits[this.adventurer.type]);
  this.portraitSprite.interactive = true;
  this.portraitSprite.buttonMode = true;
  this.portraitSprite.mouseup = this.onClick;
  this.addChild(this.portraitSprite);
};

PortraitComponent.prototype = new PIXI.DisplayObjectContainer;

PortraitComponent.prototype.onClick = function()
{
  inputManager.leftButtonHandled = true;
};