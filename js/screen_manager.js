var ScreenType = Object.freeze({
  MainMenu: 0,
  WorldMap: 1
});

var Screen = function(screenType)
{
  this.type = screenType;
  this.update = function(){};
};

var ScreenManager = function()
{
  this.screens = {};
};

ScreenManager.prototype.addScreen = function(screen)
{
  this.screens[screen.type] = screen;
};

ScreenManager.prototype.removeScreen = function(screenType)
{
  delete this.screens[screenType];
};

ScreenManager.prototype.update = function()
{
  for (var screenType in this.screens)
  {
    if (this.screens.hasOwnProperty(screenType))
    {
      this.screens.update();
    }
  }
};