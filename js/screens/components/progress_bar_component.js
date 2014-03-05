var ProgressBarComponent = function(options)
{
  this.base = PIXI.DisplayObjectContainer;
  this.base();
  
  options = options || {};
  options.x = options.x || 0;
  options.y = options.y || 0;
  options.centerX = options.centerX || false;
  options.centerY = options.centerY || false;
  
  // Fill sprite
  this.maxFillWidth = 496;
  this.fillSprite = new PIXI.Sprite(PIXI.Texture.fromImage(assetPathManager.assetPaths.ui.progressBar[0]));
  this.fillSprite.position.x = 8;
  this.fillSprite.position.y = 6;
  this.fillSprite.width = 0;
  this.fillSprite.height = 20;
  this.addChild(this.fillSprite);
  
  // Border sprite
  this.borderSprite = PIXI.Sprite.fromImage(assetPathManager.assetPaths.ui.progressBar[1]);
  this.addChild(this.borderSprite);
  
  // Position
  this.position.x = options.centerX ? (options.x - Math.floor(this.borderSprite.width * 0.5)) : options.x;
  this.position.y = options.centerY ? (options.y - Math.floor(this.borderSprite.height * 0.5)) : options.y;
};

ProgressBarComponent.prototype = new PIXI.DisplayObjectContainer;

ProgressBarComponent.prototype.setProgress = function(ratio)
{
  this.fillSprite.width = Math.floor(ratio * this.maxFillWidth);
  this.fillSprite.dirty = true;
};