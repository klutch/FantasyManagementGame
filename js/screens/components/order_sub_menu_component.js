var OrderSubMenuComponent = function(contexts, groupId, tileI, tileJ, options)
{
  this.base = PIXI.DisplayObjectContainer;
  this.base();
  this.position.x = options.x;
  this.position.y = options.y;
  this.z = options.z;
  this.tileI = tileI;
  this.tileJ = tileJ;
  this.groupId = groupId;
  this.worldMapScreen = screenManager.screens[ScreenType.WorldMap];
  
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
  var diffX = inputManager.mousePosition.x - this.position.x;
  var diffY = inputManager.mousePosition.y - this.position.y;
  
  if (diffX * diffX + diffY * diffY > 4000)
  {
    this.worldMapScreen.closeOrderSubmenu();
  }
};