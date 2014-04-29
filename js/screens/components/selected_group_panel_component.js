var SelectedGroupPanelComponent = function(screen, groupId, options)
{
  var root = this;
  
  options = options || {};
  
  this.base = PIXI.DisplayObjectContainer;
  this.base();
  this.screen = screen;
  this.groupId = groupId;
  this.groupSystem = game.systemManager.getSystem(SystemType.Group);
  this.orderSystem = game.systemManager.getSystem(SystemType.Order);
  this.characterSystem = game.systemManager.getSystem(SystemType.Character);
  this.group = this.groupSystem.getGroup(groupId);
  this.position.x = game.containerWidth - 416;
  this.position.y = 50;
  this.z = options.z;
  this.orderButtons = [];
  this.tooltipScreen = game.screenManager.screens[ScreenType.Tooltip];
  
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
    this.groupSystem.getGroupOffense(this.groupId).toString() + " / " +
    this.groupSystem.getGroupDefense(this.groupId).toString() + " / " +
    this.groupSystem.getGroupSupport(this.groupId).toString(),
    {font: "14px big_pixelmix", tint: 0xCCCCCC});
  this.groupStats.position.x = 16;
  this.groupStats.position.y = 40;
  this.panel.addChild(this.groupStats);
  
  // Portraits
  for (var i = 0; i < this.group.characterIds.length; i++)
  {
    var portrait = new PortraitComponent(this.screen, this.group.characterIds[i], {x: 16 + 48 * i, y: 64});
    
    this.panel.addChild(portrait);
  }
  
  // Move button
  this.moveButton = new ButtonComponent(
    this.screen,
    {
      x: 0,
      y: this.panel.height + 8,
      normalTexture: PIXI.Texture.fromImage(game.assetManager.paths.ui.travelOrderButtons[0]),
      disabledTexture: PIXI.Texture.fromImage(game.assetManager.paths.ui.travelOrderButtons[2]),
      tooltipCategory: "selectedGroupPanel",
      tooltipTag: "moveGroupButton",
      tooltipText: "Move group",
      onClick: function(e)
        {
          if (this.enabled)
          {
            game.inputManager.leftButtonHandled = true;
            root.orderSystem.startOrderSetup();
          }
          else
          {
            game.inputManager.leftButtonHandled = true;
            root.orderSystem.endOrderSetup();
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
      normalTexture: PIXI.Texture.fromImage(game.assetManager.paths.ui.ordersMenuButtons[0]),
      disabledTexture: PIXI.Texture.fromImage(game.assetManager.paths.ui.ordersMenuButtons[2]),
      tooltipCategory: "selectedGroupPanel",
      tooltipTag: "viewOrdersButton",
      tooltipText: "View orders",
      onClick: function(e)
        {
          if (this.enabled)
          {
            game.inputManager.leftButtonHandled = true;
            root.tooltipScreen.removeCategory("selectedGroupPanel");
            root.tooltipScreen.removeCategory("worldMapScreen");
            game.screenManager.addScreen(new ViewOrdersScreen(root.groupId));
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
  var groupHasOrders = this.orderSystem.doesGroupHaveOrders(this.groupId);
  
  // Escape key -- Deselect group
  if (this.screen.inputEnabled && game.inputManager.simpleKey(KeyCode.Escape))
  {
    this.groupSystem.deselectGroup();
  }
  
  // Modify move button
  if (this.orderSystem.settingUpOrder && this.moveButton.enabled)
  {
    this.disableMoveButton();
  }
  else if (!this.orderSystem.settingUpOrder && !this.moveButton.enabled)
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
  
  _.each(this.orderButtons, function(button)
    {
      button.update();
    });
};