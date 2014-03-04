var ButtonComponent = function(options)
{
  options.x = options.x || 0;
  options.y = options.y || 0;
  options.centerX = options.centerX || false;
  options.centerY = options.centerY || false;
  
  this.base = PIXI.DisplayObjectContainer;
  this.base();
  this.position.x = options.x;
  this.position.y = options.y;
  this.normalTexture = options.normalTexture;
  this.hoverTexture = options.hoverTexture;
  this.interactive = true;
  this.buttonMode = true;
  
  // Textures
  if (this.normalTexture != null)
  {
    this.textureSprite = new PIXI.Sprite(this.normalTexture);
    this.addChild(this.textureSprite);
  }
  
  // Text
  if (options.text != null)
  {
    this.bitmapText = new PIXI.BitmapText(options.text, {font: "12px pixelmix", tint: 0xCCCCCC});
    this.addChild(this.bitmapText);
  }
  
  // Centering
  if (this.bitmapText != null)
  {
    if (options.centerX)
    {
      this.bitmapText.position.x -= Math.floor(this.bitmapText.textWidth * 0.5);
    }
    if (options.centerY)
    {
      this.bitmapText.position.y -= Math.floor(this.bitmapText.textHeight * 0.5);
    }
  }
  if (this.textureSprite != null)
  {
    if (options.centerX)
    {
      this.textureSprite.position.x -= Math.floor(this.textureSprite.width * 0.5);
    }
    if (options.centerY)
    {
      this.textureSprite.position.y -= Math.floor(this.textureSprite.height * 0.5);
    }
  }
};

ButtonComponent.prototype = new PIXI.DisplayObjectContainer;

ButtonComponent.prototype.mouseover = function(interactionData)
{
  if (this.bitmapText != null)
  {
    this.bitmapText.tint = 0xFFF568;
    this.bitmapText.dirty = true;
  }
  if (this.textureSprite != null)
  {
    if (this.hoverTexture != null)
    {
      this.textureSprite.setTexture(this.hoverTexture);
    }
  }
};

ButtonComponent.prototype.mouseout = function(interactionData)
{
  if (this.bitmapText != null)
  {
    this.bitmapText.tint = 0xCCCCCC;
    this.bitmapText.dirty = true;
  }
  if (this.textureSprite != null)
  {
    this.textureSprite.setTexture(this.normalTexture);
  }
};