var MessageBoxComponent = function(screen, options)
{
  var root = this;
  
  options = options || {};
  options.x = options.x || Math.floor(game.containerWidth * 0.5);
  options.y = options.y || Math.floor(game.containerHeight * 0.5);
  options.width = options.width || 400;
  options.height = options.height || 300;
  options.message = options.message || "No text.";
  options.buttonText = options.buttonText || "Okay";
  options.tint = options.tint || 0xFFFF00;
  
  this.base = PIXI.DisplayObjectContainer;
  this.base();
  this.screen = screen;
  this.isOpen = true;
  
  this.position.x = options.x;
  this.position.y = options.y;
  
  this.panel = new PanelComponent({
    x: 0,
    y: 0,
    width: options.width,
    height: options.height,
    centerX: true,
    centerY: true
  });
  this.addChild(this.panel);
  
  this.bitmapText = new PIXI.BitmapText(options.message, {font: "14px big_pixelmix", tint: options.tint});
  this.bitmapText.position.x = 16;
  this.bitmapText.position.y = 16;
  this.panel.addChild(this.bitmapText);
  
  this.doneButton = new ButtonComponent(
    this.screen,
    {
      x: 120,
      y: this.panel.height - 48,
      normalTexture: PIXI.Texture.fromImage(game.assetManager.paths.ui.standardButtons[0]),
      hoverTexture: PIXI.Texture.fromImage(game.assetManager.paths.ui.standardButtons[1]),
      centerX: true,
      centerY: true,
      text: options.buttonText,
      onClick: function(e)
      {
        root.isOpen = false;
      }
    });
  this.panel.addChild(this.doneButton);
};

MessageBoxComponent.prototype = new PIXI.DisplayObjectContainer;

MessageBoxComponent.prototype.update = function()
{
  this.doneButton.update();
};