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
  this.customOnMouseOver = options.onMouseOver;
  this.customOnMouseOut = options.onMouseOut;
  this.customOnClick = options.onClick;
  this.enabled = true;
  this.isMouseOver = false;
  
  // Textures
  if (this.normalTexture != null)
  {
    this.textureSprite = new PIXI.Sprite(this.normalTexture);
    this.rectangle = new PIXI.Rectangle(0, 0, this.textureSprite.width, this.textureSprite.height);
    this.addChild(this.textureSprite);
  }
  
  // Text
  if (options.text != null)
  {
    this.bitmapText = new PIXI.BitmapText(options.text, {font: "12px big_pixelmix", tint: 0xCCCCCC});
    this.bitmapText.position.x -= Math.floor(this.bitmapText.textWidth * 0.5);
    this.bitmapText.position.y -= Math.floor(this.bitmapText.textHeight * 0.5);
    this.rectangle = this.rectangle || new PIXI.Rectangle(0, 0, this.bitmapText.textWidth, this.bitmapText.textHeight);
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

ButtonComponent.prototype.onClick = function()
{
  game.inputManager.leftButtonHandled = true;
  
  if (this.customOnClick != null)
  {
    this.customOnClick();
  }
};

ButtonComponent.prototype.touchstart = ButtonComponent.prototype.mousedown;

ButtonComponent.prototype.onMouseOver = function()
{
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
  if (this.customOnMouseOver != null)
  {
    this.customOnMouseOver();
  }
  
  this.isMouseOver = true;
};

ButtonComponent.prototype.onMouseOut = function()
{
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
  if (this.customOnMouseOut != null)
  {
    this.customOnMouseOut();
  }
  
  this.isMouseOver = false;
};

ButtonComponent.prototype.setEnabled = function(value)
{
  this.enabled = value;
  this.textureSprite.setTexture(this.enabled ? this.normalTexture : this.disabledTexture);
};

ButtonComponent.prototype.update = function()
{
  if (this.screen.inputEnabled)
  {
    var isMouseInRect;
    
    this.rectangle.x = this.textureSprite.worldTransform.tx;
    this.rectangle.y = this.textureSprite.worldTransform.ty;
    
    isMouseInRect = this.rectangle.contains(game.inputManager.mousePosition.x, game.inputManager.mousePosition.y);
    
    if (!this.isMouseOver && isMouseInRect)
    {
      this.onMouseOver();
    }
    else if (this.isMouseOver && !isMouseInRect)
    {
      this.onMouseOut();
    }
    
    if (isMouseInRect && game.inputManager.singleLeftButton())
    {
      this.onClick();
    }
  }
};