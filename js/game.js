var GameState = Object.freeze({
  MainMenu: 0,
  WorldMap: 1
});

var Game = function()
{
  this.state = GameState.MainMenu;
  
  // Initialize Pixi
  this.containerWidth = $('#container').width();
  this.containerHeight = $('#container').height();
  this.stage = new PIXI.Stage(0x000000);
  this.renderer = PIXI.autoDetectRenderer(this.containerWidth, this.containerHeight);
  $('#container').append(this.renderer.view);
  
  // Initialize input manager
  inputManager = new InputManager();
  document.onkeydown = function(e)
  {
    e = e || window.event;
    inputManager.onKeyDown(e.keyCode);
  };
  document.onkeyup = function(e)
  {
    e = e || window.event;
    inputManager.onKeyUp(e.keyCode);
  };
  $('canvas').mousewheel(function(e)
  {
    inputManager.mouseWheelDelta = e.deltaY;
  });
  $('canvas').click(function(e)
  {
    inputManager.leftButton = true;
  });
  
  // Initialize screen manager
  screenManager = new ScreenManager();
  
  // Initialize resource manager
  resourceManager = new ResourceManager();
};

Game.prototype.closeMainMenu = function()
{
  screenManager.removeScreen(ScreenType.MainMenu);
};

Game.prototype.startNewGame = function()
{
  this.world = new World();
  this.state = GameState.WorldMap;
  screenManager.addScreen(new WorldMapScreen(this.world));
};

Game.prototype.update = function()
{
  screenManager.update();
  inputManager.update();
};

Game.prototype.draw = function()
{
  this.renderer.render(this.stage);
};