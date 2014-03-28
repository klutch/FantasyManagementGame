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
  for (var key in contexts)
  {
    
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