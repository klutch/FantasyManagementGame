var ViewOrdersScreen = function(groupId)
{
  var root = this;
  
  this.type = ScreenType.ViewOrders;
  this.inputEnabled = true;
  this.z = 90;
  this.groupId = groupId;
  this.orders = orderManager.groupOrders[this.groupId];
  this.orderLabels = [];
  this.removeButtons = [];
  this.rebuildPathsOnClose = false;
  
  // Background
  this.background = PIXI.Sprite.fromImage(assetPathManager.assetPaths.ui.black);
  this.background.position.x = -16;
  this.background.position.y = -16;
  this.background.z = this.z;
  this.background.width = game.containerWidth + 32;
  this.background.height = game.containerHeight + 32;
  this.background.alpha = 0.5;
  
  // Panel
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
  
  // Done button
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
        if (root.rebuildPathsOnClose)
        {
          orderManager.rebuildPaths(root.groupId);
        }
        screenManager.removeScreen(ScreenType.ViewOrders);
        screenManager.screens[ScreenType.WorldMap].inputEnabled = true;
      }
    });
  this.panel.addChild(this.doneButton);
  
  // Orders
  this.buildOrders();
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

ViewOrdersScreen.prototype.buildOrders = function()
{
  var root = this;
  
  for (var i = 0; i < this.orders.length; i++)
  {
    var y = 68 + i * 48;
    var order = this.orders[i];
    var text = (i + 1) + ". " + order.name;
    var label = new PIXI.BitmapText(text, {font: "14px big_pixelmix", tint: 0xCCCCCC});
    var removeButton = new ButtonComponent(
      this,
      {
        x: 16,
        y: y - 12,
        normalTexture: PIXI.Texture.fromImage(assetPathManager.assetPaths.ui.closeButtons[0]),
        hoverTexture: PIXI.Texture.fromImage(assetPathManager.assetPaths.ui.closeButtons[1]),
        onClick: function(e)
        {
          orderManager.cancelOrder(this.orderId); // I hate javascript's scoping
          root.orders = orderManager.groupOrders[root.groupId] || [];
          root.clearOrders();
          root.buildOrders();
          root.rebuildPathsOnClose = true;
        }
      });
    
    label.position.x = 64;
    label.position.y = y;
    removeButton.orderId = order.id;
    this.orderLabels.push(label);
    this.removeButtons.push(removeButton);
    this.panel.addChild(label);
    this.panel.addChild(removeButton);
  }
};

ViewOrdersScreen.prototype.clearOrders = function()
{
  for (var i = 0; i < this.orderLabels.length; i++)
  {
    this.panel.removeChild(this.orderLabels[i]);
    this.panel.removeChild(this.removeButtons[i]);
  }
  this.orderLabels.length = 0;
  this.removeButtons.length = 0;
};

ViewOrdersScreen.prototype.update = function()
{
};