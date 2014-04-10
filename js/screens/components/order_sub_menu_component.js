var OrderSubMenuComponent = function(screen, contexts, groupId, tileI, tileJ, options)
{
  this.base = PIXI.DisplayObjectContainer;
  this.base();
  this.screen = screen;
  this.z = options.z;
  this.tileI = tileI;
  this.tileJ = tileJ;
  this.groupId = groupId;
  this.group = groupManager.getGroup(groupId);
  this.worldMapScreen = screenManager.screens[ScreenType.WorldMap];
  this.worldMap = this.worldMapScreen.worldMap;
  this.buttons = [];
  
  // Main icon
  this.mainIcon = PIXI.Sprite.fromImage(assetPathManager.assetPaths.ui.submenuIcon);
  this.mainIcon.anchor.x = 0.5;
  this.mainIcon.anchor.y = 0.5;
  this.addChild(this.mainIcon);
  
  var root = this;
  var tile = worldManager.getTile(tileI, tileJ);
  
  // Build buttons
  for (var key in contexts)
  {
    var button;
    
    if (key == OrderType.Explore)
    {
      button = new ButtonComponent(
        this.screen,
        {
          x: 0,
          y: 0,
          normalTexture: PIXI.Texture.fromImage(assetPathManager.assetPaths.ui.exploreOrderButtons[0]),
          tooltipCategory: "orderSubMenu",
          tooltipTag: "exploreButton",
          tooltipText: "Explore",
          onClick: function(e) 
          {
            if (orderManager.createExploreOrder(groupId, tileI, tileJ))
            {
              root.commonOnClick();
            }
          }
        });
    }
    else if (key == OrderType.VisitDwelling)
    {
      button = new ButtonComponent(
        this.screen,
        {
          x: 0,
          y: 0,
          normalTexture: PIXI.Texture.fromImage(assetPathManager.assetPaths.ui.visitOrderButtons[0]),
          tooltipCategory: "orderSubMenu",
          tooltipTag: "visitDwellingButton",
          tooltipText: "Visit Dwelling",
          onClick: function(e) 
          {
            if (orderManager.createVisitDwellingOrder(groupId, tile.featureId))
            {
              root.commonOnClick();
            }
          }
        });
    }
    else if (key == OrderType.VisitGathering)
    {
      button = new ButtonComponent(
        this.screen,
        {
          x: 0,
          y: 0,
          normalTexture: PIXI.Texture.fromImage(assetPathManager.assetPaths.ui.visitOrderButtons[0]),
          tooltipCategory: "orderSubMenu",
          tooltipTag: "visitGatheringButton",
          tooltipText: "Visit Gathering",
          onClick: function(e) 
          {
            if(orderManager.createVisitGatheringOrder(groupId, tile.featureId))
            {
              root.commonOnClick();
            }
          }
        });
    }
    else if (key == OrderType.CutLogs)
    {
      button = new ButtonComponent(
        this.screen,
        {
          x: 0,
          y: 0,
          normalTexture: PIXI.Texture.fromImage(assetPathManager.assetPaths.ui.cutLogsOrderButtons[0]),
          tooltipCategory: "orderSubMenu",
          tooltipTag: "cutLogsButton",
          tooltipText: "Cut Logs",
          onClick: function(e) { alert("cut logs button clicked"); }
        });
    }
    else if (key == OrderType.Mine)
    {
      button = new ButtonComponent(
        this.screen,
        {
          x: 0,
          y: 0,
          normalTexture: PIXI.Texture.fromImage(assetPathManager.assetPaths.ui.mineOrderButtons[0]),
          tooltipCategory: "orderSubMenu",
          tooltipTag: "mineButton",
          tooltipText: "Mine",
          onClick: function(e) { alert("mine button clicked"); }
        });
    }
    else if (key == OrderType.Raid)
    {
      button = new ButtonComponent(
        this.screen,
        {
          x: 0,
          y: 0,
          normalTexture: PIXI.Texture.fromImage(assetPathManager.assetPaths.ui.combatOrderButtons[0]),
          tooltipCategory: "orderSubMenu",
          tooltipTag: "raidButton",
          tooltipText: "Raid",
          onClick: function(e) { alert("raid button clicked"); }
        });
    }
    
    if (button == undefined) { console.error("Button not created"); }
    
    button.position.x = Math.cos(this.buttons.length) * 28;
    button.position.y = Math.sin(this.buttons.length) * 28;
    this.buttons.push(button);
    this.addChild(button);
  }
};

OrderSubMenuComponent.prototype = new PIXI.DisplayObjectContainer;

OrderSubMenuComponent.prototype.commonOnClick = function()
{
  if (!inputManager.keysPressed[KeyCode.Shift])
  {
    orderManager.endOrderSetup();
    this.close();
  }
};

OrderSubMenuComponent.prototype.close = function()
{
  screenManager.screens[ScreenType.Tooltip].removeCategory("orderSubMenu");
  this.worldMapScreen.closeOrderSubmenu();
};

OrderSubMenuComponent.prototype.update = function()
{
  var diffX;
  var diffY;
  
  // Adjust position
  this.position.x = Math.floor(this.worldMap.convertWorldToScreenX(this.tileI + 0.5));
  this.position.y = Math.floor(this.worldMap.convertWorldToScreenY(this.tileJ + 0.5));
  
  diffX = inputManager.mousePosition.x - this.position.x;
  diffY = inputManager.mousePosition.y - this.position.y;
  
  // Close when mouse is out of range
  if (diffX * diffX + diffY * diffY > 4000)
  {
    this.close();
  }
};