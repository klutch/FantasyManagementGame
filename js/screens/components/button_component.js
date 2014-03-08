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
  this.z = options.z;
  this.normalTexture = options.normalTexture;
  this.hoverTexture = options.hoverTexture;
  this.interactive = true;
  this.buttonMode = true;
  this.onMouseOver = options.onMouseOver;
  this.onMouseOut = options.onMouseOut;
  this.onClick = options.onClick;
  this.tooltipText = options.tooltipText;
  
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

ButtonComponent.prototype.click = function(interactionData)
{
  if (this.onClick != null)
  {
    this.onClick(interactionData);
  }
};

ButtonComponent.prototype.mouseover = function(interactionData)
{
  // Hover effects
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
  
  // Tooltips
  if (this.tooltipText != null)
  {
    screenManager.screens[ScreenType.Tooltip].enableTooltip(this.tooltipText);
  }
  
  // Callback
  if (this.onMouseOver != null)
  {
    this.onMouseOver(interactionData);
  }
};

ButtonComponent.prototype.mouseout = function(interactionData)
{
  // Hover effects
  if (this.bitmapText != null)
  {
    this.bitmapText.tint = 0xCCCCCC;
    this.bitmapText.dirty = true;
  }
  if (this.textureSprite != null)
  {
    this.textureSprite.setTexture(this.normalTexture);
  }
  
  // Tooltips
  if (this.tooltipText != null)
  {
    screenManager.screens[ScreenType.Tooltip].disableTooltip();
  }
  
  // Callback
  if (this.onMouseOut != null)
  {
    this.onMouseOut(interactionData);
  }
};