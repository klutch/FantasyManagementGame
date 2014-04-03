var ViewOrdersScreen = function()
{
  this.type = ScreenType.ViewOrders;
  this.inputEnabled = true;
  this.z = 90;
  
  this.background = PIXI.Sprite.fromImage(assetPathManager.assetPaths.ui.black);
  this.background.position.x = -16;
  this.background.position.y = -16;
  this.background.z = this.z;
  this.background.width = game.containerWidth + 32;
  this.background.height = game.containerHeight + 32;
  this.background.alpha = 0.5;
  
  this.panel = new PanelComponent({
    x: Math.floor(game.containerWidth * 0.5),
    y: Math.floor(game.containerHeight * 0.5),
    z: this.z + 1,
    centerX: true,
    centerY: true,
    width: 400,
    height: 400
  });
  
  this.panelTitle = new PIXI.BitmapText("Orders", {font: "24px big_pixelmix", tint: 0xFFFF00});
  this.panelTitle.position.x = 16;
  this.panelTitle.position.y = 16;
  this.panel.addChild(this.panelTitle);
  
  this.doneButton = new ButtonComponent(
    this,
    {
      x: this.panel.width - 96,
      y: this.panel.height - 34,
      normalTexture: PIXI.Texture.fromImage(assetPathManager.assetPaths.ui.standardButtons[0]),
      hoverTexture: PIXI.Texture.fromImage(assetPathManager.assetPaths.ui.standardButtons[1]),
      text: "Done",
      centerX: true,
      centerY: true,
      onClick: function(e)
      {
        screenManager.removeScreen(ScreenType.ViewOrders);
        screenManager.screens[ScreenType.WorldMap].inputEnabled = true;
      }
    });
  this.panel.addChild(this.doneButton);
};

ViewOrdersScreen.prototype.onAddScreen = function()
{
  game.stage.addChild(this.background);
  game.stage.addChild(this.panel);
  game.stage.children.sort(depthCompare);
};

ViewOrdersScreen.prototype.onRemoveScreen = function()
{
  game.stage.removeChild(this.background);
  game.stage.removeChild(this.panel);
};

ViewOrdersScreen.prototype.update = function()
{
};