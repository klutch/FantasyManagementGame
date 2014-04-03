var SelectedGroupPanelComponent = function(screen, groupId, options)
{
  var root = this;
  
  options = options || {};
  
  this.base = PIXI.DisplayObjectContainer;
  this.base();
  this.screen = screen;
  this.groupId = groupId;
  this.group = adventurerManager.groups[groupId];
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
  this.moveButton = new ButtonComponent(
    this.screen,
    {
      x: 0,
      y: this.panel.height + 8,
      normalTexture: PIXI.Texture.fromImage(assetPathManager.assetPaths.ui.travelOrderButtons[0]),
      disabledTexture: PIXI.Texture.fromImage(assetPathManager.assetPaths.ui.travelOrderButtons[2]),
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
  
  this.ordersMenuButton = new ButtonComponent(
    this.screen,
    {
      x: 32,
      y: this.panel.height + 8,
      normalTexture: PIXI.Texture.fromImage(assetPathManager.assetPaths.ui.ordersMenuButtons[0]),
      disabledTexture: PIXI.Texture.fromImage(assetPathManager.assetPaths.ui.ordersMenuButtons[2]),
      tooltipText: "View orders",
      onClick: function(e)
        {
          if (this.enabled)
          {
            inputManager.leftButtonHandled = true;
            screenManager.addScreen(new ViewOrdersScreen());
            root.tooltipScreen.disableTooltip();
            root.screen.inputEnabled = false;
          }
          else
          {
            inputManager.leftButtonHandled = true;
            screenManager.removeScreen(ScreenType.ViewOrders);
            root.screen.inputEnabled = true;
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
  if (inputManager.simpleKey(KeyCode.Escape))
  {
    adventurerManager.deselectGroup();
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