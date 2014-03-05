var ScreenType = Object.freeze({
  MainMenu: 0,
  WorldMap: 1
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