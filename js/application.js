/* 
 * Copyright 2014 Graeme Collins
 */

var fps;
var fpsText;
var lastLoop = new Date();
var tileSize = 16;
var chunkSize = 128;
var isLoaded = false;
var game;
var screenManager;
var inputManager;
var assetPathManager = new AssetPathManager();
var resourceManager;

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
  fpsText.y = 28;
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