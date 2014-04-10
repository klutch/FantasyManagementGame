var ScreenType = Object.freeze({
  MainMenu: 0,
  WorldMap: 1,
  Loading: 2,
  Tooltip: 3,
  ViewOrders: 4,
  Notification: 5,
  Shop: 6
});

var ScreenManager = function()
{
  this.screens = {};
};

ScreenManager.prototype.addScreen = function(screen)
{
  this.screens[screen.type] = screen;
  
  if (screen.onAddScreen != null)
  {
    screen.onAddScreen();
  }
  
  // Resort depths
  game.stage.children.sort(depthCompare);
};

ScreenManager.prototype.removeScreen = function(screenType)
{
  var screen = this.screens[screenType];
  
  delete this.screens[screenType];
  
  if (screen.onRemoveScreen != null)
  {
    screen.onRemoveScreen();
  }
};

ScreenManager.prototype.isScreenOpen = function(screenType)
{
  return this.screens[screenType] != null;
};

ScreenManager.prototype.update = function()
{
  for (var screenType in this.screens)
  {
    if (this.screens.hasOwnProperty(screenType))
    {
      this.screens[screenType].update();
    }
  }
};