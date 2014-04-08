// TODO: Move logic out of this file and into a GameManager class.

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
  this.renderer = new PIXI.CanvasRenderer(this.containerWidth, this.containerHeight);
  $('#container').append(this.renderer.view);
  
  inputManager = new InputManager();
  screenManager = new ScreenManager();
};

Game.prototype.closeMainMenu = function()
{
  screenManager.removeScreen(ScreenType.MainMenu);
};

Game.prototype.startNewGame = function()
{
  var worldMapScreen;
  var startingGroup;
  
  // Setup managers
  worldManager = new WorldManager();
  resourceManager = new ResourceManager();
  adventurerManager = new AdventurerManager();
  orderManager = new OrderManager();
  turnManager = new TurnManager();
  raidManager = new RaidManager();
  pathfinderManager = new PathfinderManager();
  notificationManager = new NotificationManager();
  dwellingManager = new DwellingManager();
  
  // Create screens
  worldMapScreen = new WorldMapScreen();
  screenManager.addScreen(worldMapScreen);
  screenManager.addScreen(new TooltipScreen());
  
  // Initialize managers
  worldManager.initialize();
  resourceManager.initialize();
  adventurerManager.initialize();
  orderManager.initialize();
  notificationManager.initialize();
  
  // Change state
  this.state = GameState.WorldMap;
};

Game.prototype.update = function()
{
  inputManager.update();
  if (orderManager != null) { orderManager.update(); }
  if (turnManager != null) { turnManager.update(); }
  if (raidManager != null) { raidManager.update(); }
  if (pathfinderManager != null) { pathfinderManager.update(); }
  if (notificationManager != null) { notificationManager.update(); }
  if (dwellingManager != null) { dwellingManager.update(); }
  screenManager.update();
  inputManager.postUpdate();
};

Game.prototype.draw = function()
{
  this.renderer.render(this.stage);
};