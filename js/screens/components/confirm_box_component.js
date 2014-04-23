var ConfirmBoxComponent = function(screen, text, onOkay, onCancel, options)
{
  var root = this;
  var panelHeight = 0;
  
  options = options || {};
  options.x = options.x || 0;
  options.y = options.y || 0;
  
  this.base = PIXI.DisplayObjectContainer;
  this.base();
  this.screen = screen;
  this.z = options.z;
  
  // Text
  this.bitmapText = new PIXI.BitmapText(text, {font: "14px big_pixelmix", tint: 0xFFFF00});
  this.bitmapText.position.x = 16;
  this.bitmapText.position.y = 16;
  
  panelHeight += this.bitmapText.position.y + this.bitmapText.textHeight + 32;
  panelHeight += options.showTextfield ? 32 : 0;
  panelHeight += 58;
  
  // Panel
  this.panel = new PanelComponent({
    x: options.x,
    y: options.y,
    z: 1,
    width: 368,
    height: panelHeight,
    centerX: true,
    centerY: true
  });
  this.addChild(this.panel);
  this.panel.addChild(this.bitmapText);
  
  // Textfield
  if (options.showTextfield)
  {
    this.textfield = new TextfieldComponent(
      root.screen,
      {
        x: this.panel.x + 16,
        y: this.panel.y + root.bitmapText.textHeight + 32,
        width: this.panel.width - 40,
        height: 32,
        defaultValue: options.defaultTextfieldValue
      });
    this.textfield.show();
  }
  
  // Okay button
  this.okayButton = new ButtonComponent(
    this.screen,
    {
      x: 16,
      y: this.panel.height - 54,
      normalTexture: PIXI.Texture.fromImage(game.assetManager.paths.ui.standardButtons[0]),
      hoverTexture: PIXI.Texture.fromImage(game.assetManager.paths.ui.standardButtons[1]),
      disabledTexture: PIXI.Texture.fromImage(game.assetManager.paths.ui.standardButtons[2]),
      text: "Okay",
      onClick: function()
      {
        if (this.enabled)
        {
          if (root.textfield != null)
          {
            root.textfield.hide();
            onOkay(root.textfield.getText());
          }
          else
          {
            onOkay();
          }
        }
      }
    });
  this.panel.addChild(this.okayButton);
  
  // Cancel button
  this.cancelButton = new ButtonComponent(
    this.screen,
    {
      x: 190,
      y: this.panel.height - 54,
      normalTexture: PIXI.Texture.fromImage(game.assetManager.paths.ui.standardButtons[0]),
      hoverTexture: PIXI.Texture.fromImage(game.assetManager.paths.ui.standardButtons[1]),
      text: "Cancel",
      onClick: function()
      {
        if (root.textfield != null)
        {
          root.textfield.hide();
        }
        
        onCancel();
      }
    });
  this.panel.addChild(this.cancelButton);
};

ConfirmBoxComponent.prototype = new PIXI.DisplayObjectContainer;

ConfirmBoxComponent.prototype.update = function()
{
  if (this.textfield != null)
  {
    if (this.okayButton.enabled && this.textfield.getText().length == 0)
    {
      this.okayButton.setEnabled(false);
    }
    else if (!this.okayButton.enabled && this.textfield.getText().length > 0)
    {
      this.okayButton.setEnabled(true);
    }
    
    if (this.okayButton.enabled && this.textfield.submitted)
    {
      this.okayButton.onClick(this.textfield.getText());
    }
  }
};