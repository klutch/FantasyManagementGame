/* 
 * Copyright 2014 Graeme Collins
 */

var containerWidth;
var containerHeight;
var stage;
var renderer;
var world;
var inputManager;
var screenManager;
var fps;
var fpsText;
var lastLoop = new Date();
var tileSize = 16;
var chunkSize = 16;
var isLoaded = false;
var assetPathManager = new AssetPathManager();

// Initialize
function initialize()
{
  // Initialize Pixi
  containerWidth = $('#container').width();
  containerHeight = $('#container').height();
  stage = new PIXI.Stage(0x66FF99);
  renderer = PIXI.autoDetectRenderer(containerWidth, containerHeight);
  $('#container').append(renderer.view);
  
  // Start preloading
  assetPathManager.preload(finishInitializing);
  
  // Start main loop
  requestAnimFrame(loop);
}

// Finish initializing (after preloading has finished)
function finishInitializing()
{
  // Initialize world
  world = new World();
  
  // Initialize screen manager
  screenManager = new ScreenManager();
  
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
  /*
  $('canvas').mousewheel(function(e)
  {
    worldRenderer.zoomCamera(e.deltaY * 0.1);
  });
  $('canvas').mousemove(function(e)
  {
    worldRenderer.debugGridI = world.getGridI(e.pageX + worldRenderer.camera.position.x - worldRenderer.halfScreen.x);
    worldRenderer.debugGridJ = world.getGridJ(e.pageY + worldRenderer.camera.position.y - worldRenderer.halfScreen.y);
  });*/
  $('canvas').click(function(e)
  {
    inputManager.leftButton = true;
  });
  
  // FPS
  fps = [60, 60, 60, 60, 60, 60, 60, 60, 60, 60];
  fpsText = new PIXI.Text("...", { font: "bold 20pt Trebuchet MS", fill: "black" });
  stage.addChild(fpsText);
  
  // Add world map screen
  screenManager.addScreen(new WorldMapScreen());
  
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

// Game loop
function loop()
{
  if (isLoaded)
  {
    // Update
    updateFps();
    inputManager.update();
    screenManager.update();

    // Draw
    renderer.render(stage);
  }
  requestAnimFrame(loop);
}

window.onload = initialize;