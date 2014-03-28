var OrderSubMenuComponent = function(contexts, groupId, tileI, tileJ, options)
{
  this.base = PIXI.DisplayObjectContainer;
  this.base();
  this.z = options.z;
  this.tileI = tileI;
  this.tileJ = tileJ;
  this.groupId = groupId;
  this.worldMapScreen = screenManager.screens[ScreenType.WorldMap];
  this.worldMap = this.worldMapScreen.worldMap;
  
  // Main icon
  this.mainIcon = PIXI.Sprite.fromImage(assetPathManager.assetPaths.ui.submenuIcon);
  this.mainIcon.anchor.x = 0.5;
  this.mainIcon.anchor.y = 0.5;
  this.addChild(this.mainIcon);
  
  // Build buttons
  this.buttons = [];
  for (var key in contexts)
  {
    var button;
    
    if (key == OrderType.Explore)
    {
      button = new ButtonComponent(
        {
          x: 0,
          y: 0,
          normalTexture: PIXI.Texture.fromImage(assetPathManager.assetPaths.ui.exploreOrderButtons[0]),
          tooltipText: "Explore",
          onClick: function(e) { alert("explore button clicked"); }
        });
    }
    else if (key == OrderType.VisitDwelling)
    {
      button = new ButtonComponent(
        {
          x: 0,
          y: 0,
          normalTexture: PIXI.Texture.fromImage(assetPathManager.assetPaths.ui.visitOrderButtons[0]),
          tooltipText: "Visit Dwelling",
          onClick: function(e) { alert("visit dwelling button clicked"); }
        });
    }
    else if (key == OrderType.VisitGathering)
    {
      button = new ButtonComponent(
        {
          x: 0,
          y: 0,
          normalTexture: PIXI.Texture.fromImage(assetPathManager.assetPaths.ui.visitOrderButtons[0]),
          tooltipText: "Visit Gathering",
          onClick: function(e) { alert("visit gathering button clicked"); }
        });
    }
    else if (key == OrderType.CutLogs)
    {
      button = new ButtonComponent(
        {
          x: 0,
          y: 0,
          normalTexture: PIXI.Texture.fromImage(assetPathManager.assetPaths.ui.cutLogsOrderButtons[0]),
          tooltipText: "Cut Logs",
          onClick: function(e) { alert("cut logs button clicked"); }
        });
    }
    else if (key == OrderType.Mine)
    {
      button = new ButtonComponent(
        {
          x: 0,
          y: 0,
          normalTexture: PIXI.Texture.fromImage(assetPathManager.assetPaths.ui.mineOrderButtons[0]),
          tooltipText: "Mine",
          onClick: function(e) { alert("mine button clicked"); }
        });
    }
    else if (key == OrderType.Raid)
    {
      button = new ButtonComponent(
        {
          x: 0,
          y: 0,
          normalTexture: PIXI.Texture.fromImage(assetPathManager.assetPaths.ui.combatOrderButtons[0]),
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
    this.worldMapScreen.closeOrderSubmenu();
  }
};