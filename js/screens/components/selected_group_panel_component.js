var SelectedGroupPanelComponent = function(groupId, options)
{
  options = options || {};
  
  this.base = PIXI.DisplayObjectContainer;
  this.base();
  this.groupId = groupId;
  this.group = adventurerManager.groups[groupId];
  this.position.x = game.containerWidth - 416;
  this.position.y = 50;
  this.z = options.z;
  this.orderButtons = [];
  
  // Panel
  this.panel = new PanelComponent({
    x: 0,
    y: 0,
    width: 400,
    height: 136
  });
  this.addChild(this.panel);
  
  // Group name
  this.titleText = new PIXI.BitmapText(this.group.name, {font: "16px big_pixelmix", tint: 0xFFFF00});
  this.titleText.position.x = 16;
  this.titleText.position.y = 16;
  this.panel.addChild(this.titleText);
  
  // Group stats
  this.groupStats = new PIXI.BitmapText(
    adventurerManager.getGroupOffense(this.groupId).toString() + " / " +
    adventurerManager.getGroupDefense(this.groupId).toString() + " / " +
    adventurerManager.getGroupSupport(this.groupId).toString(),
    {font: "14px big_pixelmix", tint: 0xCCCCCC});
  this.groupStats.position.x = 16;
  this.groupStats.position.y = 40;
  this.panel.addChild(this.groupStats);
  
  // Portraits
  for (var i = 0; i < this.group.adventurerIds.length; i++)
  {
    var portrait = new PortraitComponent(this.group.adventurerIds[i], {x: 16 + 48 * i, y: 64});
    
    this.panel.addChild(portrait);
  }
  
  // Order buttons
  this.travelButton = new ButtonComponent({
    x: 0,
    y: this.panel.height + 8,
    normalTexture: PIXI.Texture.fromImage(assetPathManager.assetPaths.ui.travelOrderButtons[0]),
    disabledTexture: PIXI.Texture.fromImage(assetPathManager.assetPaths.ui.travelOrderButtons[2]),
    tooltipText: "Travel",
    onClick: function(e)
      {
        if (this.enabled)
        {
          inputManager.leftButtonHandled = true;
          orderManager.startOrderSetup();
          orderManager.settingUpTravelOrder = true;
        }
      }
  });
  this.panel.addChild(this.travelButton);
  this.orderButtons.push(this.travelButton);
  
  // Cancel order button
  this.cancelButton = new ButtonComponent({
    x: this.orderButtons.length * 32,
    y: this.panel.height + 8,
    normalTexture: PIXI.Texture.fromImage(assetPathManager.assetPaths.ui.cancelOrderButtons[0]),
    disabledTexture: PIXI.Texture.fromImage(assetPathManager.assetPaths.ui.cancelOrderButtons[2]),
    tooltipText: "Cancel order",
    onClick: function(e)
      {
        if (this.enabled)
        {
          orderManager.cancelGroupOrder(groupId);
        }
      }
  });
  this.panel.addChild(this.cancelButton);
  this.cancelButton.setEnabled(false);
};

SelectedGroupPanelComponent.prototype = new PIXI.DisplayObjectContainer;

SelectedGroupPanelComponent.prototype.enableButtons = function()
{
  for (var i = 0; i < this.orderButtons.length; i++)
  {
    this.orderButtons[i].setEnabled(true);
  }
};

SelectedGroupPanelComponent.prototype.disableButtons = function()
{
  for (var i = 0; i < this.orderButtons.length; i++)
  {
    this.orderButtons[i].setEnabled(false);
  }
};

SelectedGroupPanelComponent.prototype.update = function()
{
  var groupHasOrders = orderManager.doesGroupHaveOrders(this.groupId);
  
  if (!this.cancelButton.enabled && groupHasOrders)
  {
    this.disableButtons();
    this.cancelButton.setEnabled(true);
  }
  else if (this.cancelButton.enabled && !groupHasOrders)
  {
    this.enableButtons();
    this.cancelButton.setEnabled(false);
  }
  
  // Escape key -- Deselect group
  if (inputManager.simpleKey(KeyCode.Escape))
  {
    adventurerManager.deselectGroup();
  }
};