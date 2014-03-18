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
  
  this.state = GameState.WorldMap;
  worldManager = new WorldManager();
  worldMapScreen = new WorldMapScreen(this.world);
  screenManager.addScreen(worldMapScreen);
  screenManager.addScreen(new TooltipScreen());
  
  worldManager.featureGenerator.generatePlayerCastle();
  worldManager.discoverRadius(worldManager.world.playerCastleI + 4, worldManager.world.playerCastleJ + 4, 32);
  worldMapScreen.worldMap.setCamera((worldManager.world.playerCastleI + 2) * TILE_SIZE, (worldManager.world.playerCastleJ + 2) * TILE_SIZE);
  
  adventurerManager = new AdventurerManager();
  startingGroup = adventurerManager.createGroup({name: "Starting Group", featureId: 0});
  adventurerManager.addAdventurer(startingGroup.id, AdventurerFactory.createArcher(10));
  adventurerManager.addAdventurer(startingGroup.id, AdventurerFactory.createArcher(10));
  adventurerManager.addAdventurer(startingGroup.id, AdventurerFactory.createKnight(10));
  adventurerManager.addAdventurer(startingGroup.id, AdventurerFactory.createKnight(10));
  adventurerManager.addAdventurer(startingGroup.id, AdventurerFactory.createHealer(10));
  worldMapScreen.groupPanel.addGroup(startingGroup.id);
};

Game.prototype.update = function()
{
  inputManager.update();
  screenManager.update();
  inputManager.postUpdate();
};

Game.prototype.draw = function()
{
  this.renderer.render(this.stage);
};