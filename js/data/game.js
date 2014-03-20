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
  
  // Initialize input manager
  inputManager = new InputManager();
  
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
  var worldMapScreen;
  var startingGroup;
  
  // Change state
  this.state = GameState.WorldMap;
  
  // Setup world
  worldManager = new WorldManager();
  worldMapScreen = new WorldMapScreen(this.world);
  screenManager.addScreen(worldMapScreen);
  screenManager.addScreen(new TooltipScreen());
  worldManager.featureGenerator.generatePlayerCastle();
  worldManager.discoverRadius(worldManager.world.playerCastleI + 2, worldManager.world.playerCastleJ + 2, 32);
  worldMapScreen.worldMap.setCamera((worldManager.world.playerCastleI + 2) * TILE_SIZE, (worldManager.world.playerCastleJ + 2) * TILE_SIZE);
  
  // Setup adventurer manager and initial groups
  adventurerManager = new AdventurerManager();
  startingGroup = adventurerManager.createGroup({name: "Starting Group", featureId: 0});
  adventurerManager.addAdventurer(startingGroup.id, AdventurerFactory.createArcher(10));
  adventurerManager.addAdventurer(startingGroup.id, AdventurerFactory.createArcher(10));
  adventurerManager.addAdventurer(startingGroup.id, AdventurerFactory.createKnight(10));
  adventurerManager.addAdventurer(startingGroup.id, AdventurerFactory.createKnight(10));
  adventurerManager.addAdventurer(startingGroup.id, AdventurerFactory.createHealer(10));
  worldMapScreen.groupPanel.addGroup(startingGroup.id);
  
  for (var i = 0; i < 7; i++)
  {
    var group = adventurerManager.createGroup();
    
    adventurerManager.addAdventurer(group.id, AdventurerFactory.createArcher(50));
    adventurerManager.addAdventurer(group.id, AdventurerFactory.createArcher(50));
    adventurerManager.addAdventurer(group.id, AdventurerFactory.createArcher(50));
    worldMapScreen.groupPanel.addGroup(group.id);
  }
  
  // Setup order manager
  orderManager = new OrderManager();
};

Game.prototype.update = function()
{
  inputManager.update();
  screenManager.update();
  if (orderManager != null)
  {
    orderManager.update();
  }
  inputManager.postUpdate();
};

Game.prototype.draw = function()
{
  this.renderer.render(this.stage);
};