var ButtonComponent = function(screen, options)
{
  options.x = options.x || 0;
  options.y = options.y || 0;
  options.centerX = options.centerX || false;
  options.centerY = options.centerY || false;
  
  this.base = PIXI.DisplayObjectContainer;
  this.base();
  this.screen = screen;
  this.position.x = options.x;
  this.position.y = options.y;
  this.z = options.z;
  this.normalTexture = options.normalTexture;
  this.hoverTexture = options.hoverTexture;
  this.disabledTexture = options.disabledTexture;
  this.interactive = true;
  this.buttonMode = true;
  this.onMouseOver = options.onMouseOver;
  this.onMouseOut = options.onMouseOut;
  this.onClick = options.onClick;
  this.enabled = true;
  
  // Textures
  if (this.normalTexture != null)
  {
    this.textureSprite = new PIXI.Sprite(this.normalTexture);
    this.addChild(this.textureSprite);
  }
  
  // Text
  if (options.text != null)
  {
    this.bitmapText = new PIXI.BitmapText(options.text, {font: "12px big_pixelmix", tint: 0xCCCCCC});
    this.bitmapText.position.x -= Math.floor(this.bitmapText.textWidth * 0.5);
    this.bitmapText.position.y -= Math.floor(this.bitmapText.textHeight * 0.5);
    this.addChild(this.bitmapText);
  }
  
  // Centering
  if (options.centerX)
  {
    if (this.textureSprite != null)
    {
      this.textureSprite.position.x -= Math.floor(this.textureSprite.width * 0.5);
    }
  }
  else
  {
    if (this.bitmapText != null)
    {
      this.bitmapText.position.x += Math.floor(this.normalTexture.width * 0.5);
    }
  }
  if (options.centerY)
  {
    if (this.textureSprite != null)
    {
      this.textureSprite.position.y -= Math.floor(this.textureSprite.height * 0.5);
    }
  }
  else
  {
    if (this.bitmapText != null)
    {
      this.bitmapText.position.y += Math.floor(this.normalTexture.height * 0.5);
    }
  }
  
  // Tooltip
  if (options.tooltipText != null)
  {
    this.tooltipText = options.tooltipText;
    
    if (options.tooltipCategory == null)
    {
      console.error("Tooltip category is null");
    }
    if (options.tooltipTag == null)
    {
      console.error("Tooltip tag is null");
    }
    
    this.tooltipCategory = options.tooltipCategory;
    this.tooltipTag = options.tooltipTag;
  }
};

ButtonComponent.prototype = new PIXI.DisplayObjectContainer;

ButtonComponent.prototype.click = function(interactionData)
{
  if (!this.screen.inputEnabled)
  {
    return;
  }
  
  game.inputManager.leftButtonHandled = true;
  
  if (this.onClick != null)
  {
    this.onClick(interactionData);
  }
};

ButtonComponent.prototype.touchstart = ButtonComponent.prototype.click;

ButtonComponent.prototype.mouseover = function(interactionData)
{
  if (!this.screen.inputEnabled)
  {
    return;
  }
  
  // Hover effects
  if (this.bitmapText != null)
  {
    this.bitmapText.tint = 0xFFF568;
    this.bitmapText.dirty = true;
  }
  if (this.textureSprite != null)
  {
    if (this.hoverTexture != null && this.enabled)
    {
      this.textureSprite.setTexture(this.hoverTexture);
    }
  }
  
  // Tooltips
  if (this.tooltipText != null)
  {
    game.screenManager.screens[ScreenType.Tooltip].addTooltip(this.tooltipCategory, this.tooltipTag, this.tooltipText);
  }
  
  // Callback
  if (this.onMouseOver != null)
  {
    this.onMouseOver(interactionData);
  }
};

ButtonComponent.prototype.mouseout = function(interactionData)
{
  if (!this.screen.inputEnabled)
  {
    return;
  }
  
  // Hover effects
  if (this.bitmapText != null)
  {
    this.bitmapText.tint = 0xCCCCCC;
    this.bitmapText.dirty = true;
  }
  if (this.textureSprite != null && this.enabled)
  {
    this.textureSprite.setTexture(this.normalTexture);
  }
  
  // Tooltips
  if (this.tooltipText != null)
  {
    game.screenManager.screens[ScreenType.Tooltip].removeTooltip(this.tooltipCategory, this.tooltipTag);
  }
  
  // Callback
  if (this.onMouseOut != null)
  {
    this.onMouseOut(interactionData);
  }
};

ButtonComponent.prototype.setEnabled = function(value)
{
  this.enabled = value;
  this.textureSprite.setTexture(this.enabled ? this.normalTexture : this.disabledTexture);
};