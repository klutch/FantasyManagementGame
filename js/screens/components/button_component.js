var ButtonComponent = function(options)
{
  options.x = options.x || 0;
  options.y = options.y || 0;
  options.centerText = options.centerText || false;
  
  this.base = PIXI.DisplayObjectContainer;
  this.base();
  this.position.x = options.x;
  this.position.y = options.y;
  
  if (options.text != null)
  {
    this.bitmapText = new PIXI.BitmapText(options.text, {font: "18px SegoeMarker"});
    this.addChild(this.bitmapText);
  }
  if (options.centerText)
  {
    this.position.x -= Math.floor(this.bitmapText.textWidth * 0.5);
  }
};

ButtonComponent.prototype = new PIXI.DisplayObjectContainer;