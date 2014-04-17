var ScrollbarComponent = function(screen, options)
{
  var root = this;
  
  options = options || {};
  options.x = options.x || 0;
  options.y = options.y || 0;
  options.scrollHeight = options.scrollHeight || 100;
  options.maskX = options.maskX || 0;
  options.maskY = options.maskY || 0;
  options.maskWidth = options.maskWidth || 400;
  options.maskHeight = options.maskHeight || 200;
  
  this.base = PIXI.DisplayObjectContainer;
  this.base();
  this.screen = screen;
  
  this.scrollbar = PIXI.Sprite.fromImage(game.assetManager.paths.ui.scrollbar);
  this.scrollbar.position.x = options.x - 2;
  this.scrollbar.position.y = options.y;
  this.scrollbar.height = options.scrollHeight;
  this.addChild(this.scrollbar);
  
  this.scrollUpButton = new ButtonComponent(
    this.screen,
    {
      x: options.x,
      y: options.y,
      normalTexture: PIXI.Texture.fromImage(game.assetManager.paths.ui.scrollUpButtons[0]),
      hoverTexture: PIXI.Texture.fromImage(game.assetManager.paths.ui.scrollUpButtons[1]),
      centerX: true,
      centerY: true,
      onClick: function(e) { root.scrollUp(); }
    });
  this.addChild(this.scrollUpButton);
  
  this.scrollDownButton = new ButtonComponent(
    this.screen,
    {
      x: options.x,
      y: options.y + options.scrollHeight,
      normalTexture: PIXI.Texture.fromImage(game.assetManager.paths.ui.scrollDownButtons[0]),
      hoverTexture: PIXI.Texture.fromImage(game.assetManager.paths.ui.scrollDownButtons[1]),
      centerX: true,
      centerY: true,
      onClick: function(e) { root.scrollDown(); }
    });
  this.addChild(this.scrollDownButton);
  
  if (options.component != null)
  {
    this.attachComponent(options.component, options.maskX, options.maskY, options.maskWidth, options.maskHeight);
  }
};

ScrollbarComponent.prototype = new PIXI.DisplayObjectContainer;

ScrollbarComponent.prototype.attachComponent = function(component, x, y, width, height)
{
  var mask = new PIXI.Graphics();
  
  mask.beginFill();
  mask.drawRect(x, y, width, height);
  mask.endFill();
  
  this.addChild(mask);
  
  this.component = component;
  this.component.mask = mask;
  this.component.minScrollY = this.component.minScrollY == undefined ? 0 : this.component.minScrollY;
  this.component.maxScrollY = this.component.maxScrollY == undefined ? 0 : this.component.maxScrollY;
  this.component.targetScrollY = Math.max(Math.min(this.component.maxScrollY, 0), this.component.minScrollY);
};

ScrollbarComponent.prototype.scrollUp = function()
{
  this.component.targetScrollY = Math.min(this.component.targetScrollY + 20, this.component.maxScrollY);
};

ScrollbarComponent.prototype.scrollDown = function()
{
  this.component.targetScrollY = Math.max(this.component.targetScrollY - 20, this.component.minScrollY);
};

ScrollbarComponent.prototype.update = function()
{
  this.component.position.y += (this.component.targetScrollY - this.component.position.y) / 8;
};