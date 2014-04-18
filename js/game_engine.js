var TILE_SIZE = 32;
var CHUNK_SIZE = 32;
var NUM_TERRAIN_TYPES = 9;
var OFFENSE_COLOR = 0xed2129;
var DEFENSE_COLOR = 0x0072bc;
var SUPPORT_COLOR = 0x8fd82c;
var SUCCESS_COLOR = 0x62c813;
var FAILURE_COLOR = 0xc83113;
var DEFAULT_TILE_SELECTOR_COLOR = 0xCCCCCC;
var MAX_GROUP_CAPACITY = 8;
var MAX_BARRACKS_CAPACITY = 100;
var DEFAULT_EQUIPMENT_SLOT_TYPES = [
  EquipmentSlotType.Head,
  EquipmentSlotType.Arm,
  EquipmentSlotType.Arm,
  EquipmentSlotType.Forearm,
  EquipmentSlotType.Forearm,
  EquipmentSlotType.Hand,
  EquipmentSlotType.Hand,
  EquipmentSlotType.Finger,
  EquipmentSlotType.Finger,
  EquipmentSlotType.Finger,
  EquipmentSlotType.Finger,
  EquipmentSlotType.Legs,
  EquipmentSlotType.Feet,
  EquipmentSlotType.Torso,
  EquipmentSlotType.Waist,
  EquipmentSlotType.Neck,
  EquipmentSlotType.Primary,
  EquipmentSlotType.Secondary
];
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
  this.systemManager.addSystem(new ShopSystem());
  this.systemManager.addSystem(new GameEventSystem());
  this.systemManager.addSystem(new LoyaltySystem());
  this.systemManager.addSystem(new CombatSystem());
  this.systemManager.addSystem(new EquipmentSystem());
  
  // Create screens
  this.screenManager.addScreen(new WorldMapScreen());
  this.screenManager.addScreen(new ShopScreen());
  this.screenManager.addScreen(new TooltipScreen());
  
  // Initialize systems
  this.systemManager.getSystem(SystemType.Equipment).initialize();
  this.systemManager.getSystem(SystemType.World).initialize();
  this.systemManager.getSystem(SystemType.Group).initialize();
  this.systemManager.getSystem(SystemType.Shop).initialize();
  this.systemManager.getSystem(SystemType.Order).initialize();
  this.systemManager.getSystem(SystemType.Resource).initialize();
  this.systemManager.getSystem(SystemType.Loyalty).initialize();
  this.systemManager.getSystem(SystemType.Combat).initialize();
  this.systemManager.getSystem(SystemType.Raid).initialize();
  
  this.startWaitingOnPlayer();
};

GameEngine.prototype.startWaitingOnPlayer = function()
{
  this.state = GameState.WaitingOnPlayer;
};

GameEngine.prototype.endWaitingOnPlayer = function()
{
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
};

GameEngine.prototype.startRaidProcessing = function()
{
  this.state = GameState.RaidProcessing;
};

GameEngine.prototype.endRaidProcessing = function()
{
};

GameEngine.prototype.startEventProcessing = function()
{
  this.state = GameState.EventProcessing;
  this.screenManager.addScreen(new NotificationScreen());
};

GameEngine.prototype.endEventProcessing = function()
{
  this.screenManager.removeScreen(ScreenType.Notification);
};

GameEngine.prototype.switchToNextState = function()
{
  if (this.state == GameState.WaitingOnPlayer)
  {
    this.endWaitingOnPlayer();
    this.startOrderProcessing();
  }
  else if (this.state == GameState.OrderProcessing)
  {
    this.endOrderProcessing();
    this.startEventProcessing();
  }
  else if (this.state == GameState.EventProcessing)
  {
    this.endEventProcessing();
    this.startRaidProcessing();
  }
  else if (this.state == GameState.RaidProcessing)
  {
    this.endRaidProcessing();
    this.startWaitingOnPlayer();
  }
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