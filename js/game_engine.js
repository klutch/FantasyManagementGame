var TILE_SIZE = 32;
var CHUNK_SIZE = 32;
var NUM_TERRAIN_TYPES = 9;
var OFFENSE_COLOR = 0xed2129;
var DEFENSE_COLOR = 0x0072bc;
var SUPPORT_COLOR = 0x8fd82c;
var DEFAULT_TILE_SELECTOR_COLOR = 0xCCCCCC;
var DEBUG_PATHFINDER = false;

var GameState = Object.freeze({
  Idle: 0,
  MainMenu: 1,
  WaitingOnPlayer: 2,
  OrderProcessing: 3,
  RaidProcessing: 4,
  EventProcessing: 5
});

var GameEngine = function()
{
  this.assetManager = new AssetManager();
  this.assetManager.preload(this.onPreloadComplete);
};

GameEngine.prototype.onPreloadComplete = function()
{
  game.containerWidth = $('#container').width();
  game.containerHeight = $('#container').height();
  game.stage = new PIXI.Stage(0x000000);
  game.renderer = new PIXI.CanvasRenderer(game.containerWidth, game.containerHeight);
  $('#container').append(game.renderer.view);
  
  game.inputManager = new InputManager();
  game.screenManager = new ScreenManager();
  game.systemManager = new SystemManager();
  game.pathfinderManager = new PathfinderManager();
  
  game.isLoaded = true;
  game.openMainMenu();
};

GameEngine.prototype.openMainMenu = function()
{
  this.state = GameState.MainMenu;
  this.screenManager.addScreen(new MainMenuScreen());
};

GameEngine.prototype.closeMainMenu = function()
{
  this.screenManager.removeScreen(ScreenType.MainMenu);
};

GameEngine.prototype.startNewGame = function()
{
  // Setup systems
  this.systemManager.addSystem(new WorldSystem());
  this.systemManager.addSystem(new ResourceSystem());
  this.systemManager.addSystem(new CharacterSystem());
  this.systemManager.addSystem(new GroupSystem());
  this.systemManager.addSystem(new OrderSystem());
  this.systemManager.addSystem(new RaidSystem());
  this.systemManager.addSystem(new DwellingSystem());
  this.systemManager.addSystem(new GameEventSystem());
  
  // Create screens
  this.screenManager.addScreen(new WorldMapScreen());
  this.screenManager.addScreen(new ShopScreen());
  this.screenManager.addScreen(new TooltipScreen());
  
  // Initialize systems
  this.systemManager.getSystem(SystemType.World).initialize();
  this.systemManager.getSystem(SystemType.Group).initialize();
  this.systemManager.getSystem(SystemType.Dwelling).initialize();
  this.systemManager.getSystem(SystemType.Order).initialize();
  this.systemManager.getSystem(SystemType.Resource).initialize();
  
  this.startWaitingOnPlayer();
};

GameEngine.prototype.startWaitingOnPlayer = function()
{
  this.state = GameState.WaitingOnPlayer;
};

GameEngine.prototype.endWaitingOnPlayer = function()
{
  this.state = GameState.Idle;
};

GameEngine.prototype.startOrderProcessing = function()
{
  var orderSystem = this.systemManager.getSystem(SystemType.Order);
  
  if (orderSystem.settingUpOrder)
  {
    orderSystem.endOrderSetup();
  }
  
  this.state = GameState.OrderProcessing;
};

GameEngine.prototype.endOrderProcessing = function()
{
  this.state = GameState.Idle;
};

GameEngine.prototype.startRaidProcessing = function()
{
  this.state = GameState.RaidProcessing;
};

GameEngine.prototype.endRaidProcessing = function()
{
  this.state = GameState.Idle;
};

GameEngine.prototype.startEventProcessing = function()
{
  this.state = GameState.EventProcessing;
  this.screenManager.addScreen(new NotificationScreen());
};

GameEngine.prototype.endEventProcessing = function()
{
  this.state = GameState.Idle;
  this.screenManager.removeScreen(ScreenType.Notification);
};

GameEngine.prototype.update = function()
{
  this.inputManager.update();
  this.systemManager.update();
  this.screenManager.update();
  this.inputManager.postUpdate();
};

GameEngine.prototype.draw = function()
{
  this.renderer.render(this.stage);
};