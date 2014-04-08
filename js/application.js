/* 
 * Copyright 2014 Graeme Collins
 */

var TILE_SIZE = 32;
var CHUNK_SIZE = 32;
var NUM_TERRAIN_TYPES = 9;
var OFFENSE_COLOR = 0xed2129;
var DEFENSE_COLOR = 0x0072bc;
var SUPPORT_COLOR = 0x8fd82c;
var DEFAULT_TILE_SELECTOR_COLOR = 0xCCCCCC;
var DEBUG_PATHFINDER = false;
var fps;
var fpsText;
var lastLoop = new Date();
var isLoaded = false;
var game;
var screenManager;
var inputManager;
var worldManager;
var adventurerManager;
var assetPathManager = new AssetPathManager();
var resourceManager;
var orderManager;
var turnManager;
var raidManager;
var pathfinderManager;
var notificationManager;
var loyaltyManager;

// Initialize
function initialize()
{
  // Start preloading
  assetPathManager.preload(finishInitializing);
  
  // Start main loop
  requestAnimFrame(loop);
}

// Finish initializing (after preloading has finished)
function finishInitializing()
{
  // Initialize game
  game = new Game();
  
  // Initialize FPS
  fps = [60, 60, 60, 60, 60, 60, 60, 60, 60, 60];
  fpsText = new PIXI.Text("...", { font: "bold 20pt Trebuchet MS", fill: "white" });
  fpsText.y = game.containerHeight - 32;
  fpsText.z = 110;
  game.stage.addChild(fpsText);
  
  // Open main menu
  screenManager.addScreen(new MainMenuScreen());
  
  isLoaded = true;
}

// Get random integer between values
function getRandomInt(a, b)
{
  var lowest = Math.min(a, b);
  var highest = Math.max(a, b);
  var range = highest - lowest;
  
  return Math.floor(Math.random() * range + lowest);
}

// Update fps
function updateFps()
{
  var thisLoop = new Date();
  var averageFps = 0;

  // FPS
  fps.shift();
  fps.push(1000 / (thisLoop.getTime() - lastLoop.getTime()));
  for (var i = 0; i < fps.length; i++)
  {
      averageFps += fps[i] / fps.length;
  }
  lastLoop = thisLoop;
  fpsText.setText("FPS: " + Math.floor(averageFps));
}

// Depth sorting
function depthCompare(a, b)
{
  if (a.z == null || a.z == b.z)
  {
    return 0;
  }
  
  if (a.z < b.z)
  {
    return -1;
  }
  else
  {
    return 1;
  }
}

// Game loop
function loop()
{
  if (isLoaded)
  {
    // Update
    updateFps();
    game.update();

    // Draw
    game.draw();
  }
  requestAnimFrame(loop);
}

window.onload = initialize;