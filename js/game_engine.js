var TILE_SIZE = 32;
var CHUNK_SIZE = 32;
var NUM_TERRAIN_TYPES = 9;
var OFFENSE_COLOR = 0xed2129;
var DEFENSE_COLOR = 0x0072bc;
var SUPPORT_COLOR = 0x8fd82c;
var DEFAULT_TILE_SELECTOR_COLOR = 0xCCCCCC;
var DEBUG_PATHFINDER = false;

var GameState = Object.freeze({
  MainMenu: 0,
  WaitingOnPlayer: 1,
  OrderProcessing: 2,
  RaidProcessing: 3,
  EventProcessing: 4
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
  this.systemManager.addSystem(new NotificationSystem());
  this.systemManager.addSystem(new DwellingSystem());
  
  // Create screens
  this.screenManager.addScreen(new WorldMapScreen());
  this.screenManager.addScreen(new ShopScreen());
  this.screenManager.addScreen(new TooltipScreen());
  
  // Initialize systems
  this.systemManager.initializeSystems();
  
  // Change state
  this.state = GameState.WaitingOnPlayer;
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