var ConfirmBoxComponent = function(screen, text, onOkay, onCancel, options)
{
  options = options || {};
  options.x = options.x || 0;
  options.y = options.y || 0;
  
  this.base = PIXI.DisplayObjectContainer;
  this.base();
  this.screen = screen;
  
  // Panel
  this.panel = new PanelComponent({
    x: options.x,
    y: options.y,
    width: 382,
    height: 140,
    centerX: true,
    centerY: true
  });
  this.addChild(this.panel);
  
  // Text
  this.bitmapText = new PIXI.BitmapText(text, {font: "14px big_pixelmix", tint: 0xFFFF00});
  this.bitmapText.position.x = 16;
  this.bitmapText.position.y = 16;
  this.panel.addChild(this.bitmapText);
  
  // Okay button
  this.okayButton = new ButtonComponent(
    this.screen,
    {
      x: 100,
      y: 100,
      normalTexture: PIXI.Texture.fromImage(assetPathManager.assetPaths.ui.standardButtons[0]),
      hoverTexture: PIXI.Texture.fromImage(assetPathManager.assetPaths.ui.standardButtons[1]),
      centerX: true,
      centerY: true,
      text: "Okay",
      onClick: onOkay
    });
  this.panel.addChild(this.okayButton);
  
  // Cancel button
  this.cancelButton = new ButtonComponent(
    this.screen,
    {
      x: 280,
      y: 100,
      normalTexture: PIXI.Texture.fromImage(assetPathManager.assetPaths.ui.standardButtons[0]),
      hoverTexture: PIXI.Texture.fromImage(assetPathManager.assetPaths.ui.standardButtons[1]),
      centerX: true,
      centerY: true,
      text: "Cancel",
      onClick: onCancel
    });
  this.panel.addChild(this.cancelButton);
};

ConfirmBoxComponent.prototype = new PIXI.DisplayObjectContainer;