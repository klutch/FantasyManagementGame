var SelectedGroupPanelComponent = function(screen, groupId, options)
{
  var root = this;
  
  options = options || {};
  
  this.base = PIXI.DisplayObjectContainer;
  this.base();
  this.screen = screen;
  this.groupId = groupId;
  this.group = characterManager.groups[groupId];
  this.position.x = game.containerWidth - 416;
  this.position.y = 50;
  this.z = options.z;
  this.orderButtons = [];
  this.tooltipScreen = screenManager.screens[ScreenType.Tooltip];
  
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
    characterManager.getGroupOffense(this.groupId).toString() + " / " +
    characterManager.getGroupDefense(this.groupId).toString() + " / " +
    characterManager.getGroupSupport(this.groupId).toString(),
    {font: "14px big_pixelmix", tint: 0xCCCCCC});
  this.groupStats.position.x = 16;
  this.groupStats.position.y = 40;
  this.panel.addChild(this.groupStats);
  
  // Portraits
  for (var i = 0; i < this.group.characterIds.length; i++)
  {
    var portrait = new PortraitComponent(this.group.characterIds[i], {x: 16 + 48 * i, y: 64});
    
    this.panel.addChild(portrait);
  }
  
  // Move button
  this.moveButton = new ButtonComponent(
    this.screen,
    {
      x: 0,
      y: this.panel.height + 8,
      normalTexture: PIXI.Texture.fromImage(assetPathManager.assetPaths.ui.travelOrderButtons[0]),
      disabledTexture: PIXI.Texture.fromImage(assetPathManager.assetPaths.ui.travelOrderButtons[2]),
      tooltipCategory: "selectedGroupPanel",
      tooltipTag: "moveGroupButton",
      tooltipText: "Move group",
      onClick: function(e)
        {
          if (this.enabled)
          {
            inputManager.leftButtonHandled = true;
            orderManager.startOrderSetup();
          }
          else
          {
            inputManager.leftButtonHandled = true;
            orderManager.endOrderSetup();
          }
        }
    });
  this.panel.addChild(this.moveButton);
  this.orderButtons.push(this.moveButton);
  
  // View orders button
  this.ordersMenuButton = new ButtonComponent(
    this.screen,
    {
      x: 32,
      y: this.panel.height + 8,
      normalTexture: PIXI.Texture.fromImage(assetPathManager.assetPaths.ui.ordersMenuButtons[0]),
      disabledTexture: PIXI.Texture.fromImage(assetPathManager.assetPaths.ui.ordersMenuButtons[2]),
      tooltipCategory: "selectedGroupPanel",
      tooltipTag: "viewOrdersButton",
      tooltipText: "View orders",
      onClick: function(e)
        {
          if (this.enabled)
          {
            inputManager.leftButtonHandled = true;
            root.tooltipScreen.removeCategory("selectedGroupPanel");
            root.tooltipScreen.removeCategory("worldMapScreen");
            screenManager.addScreen(new ViewOrdersScreen(root.groupId));
            root.screen.inputEnabled = false;
          }
        }
    });
  this.orderButtons.push(this.ordersMenuButton);
  this.panel.addChild(this.ordersMenuButton);
};

SelectedGroupPanelComponent.prototype = new PIXI.DisplayObjectContainer;

SelectedGroupPanelComponent.prototype.enableMoveButton = function()
{
  this.moveButton.tooltipText = "Move group";
  this.moveButton.setEnabled(true);
};

SelectedGroupPanelComponent.prototype.disableMoveButton = function()
{
  this.moveButton.tooltipText = "Stop giving orders";
  this.moveButton.setEnabled(false);
};

SelectedGroupPanelComponent.prototype.update = function()
{
  var groupHasOrders = orderManager.doesGroupHaveOrders(this.groupId);
  
  // Escape key -- Deselect group
  if (this.screen.inputEnabled && inputManager.simpleKey(KeyCode.Escape))
  {
    characterManager.deselectGroup();
  }
  
  // Modify move button
  if (orderManager.settingUpOrder && this.moveButton.enabled)
  {
    this.disableMoveButton();
  }
  else if (!orderManager.settingUpOrder && !this.moveButton.enabled)
  {
    this.enableMoveButton();
  }
  
  // Modify orders menu button
  if (groupHasOrders && !this.ordersMenuButton.enabled)
  {
    this.ordersMenuButton.setEnabled(true);
  }
  else if (!groupHasOrders && this.ordersMenuButton.enabled)
  {
    this.ordersMenuButton.setEnabled(false);
  }
};