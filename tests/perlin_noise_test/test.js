var containerWidth;
var containerHeight;
var stage;
var renderer;
var inputManager;

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
  startPreloading();
  
  // Start main loop
  requestAnimFrame(loop);
}

// Start preloading
function startPreloading()
{
  var assets = [];
  var loader;
  
  assets.push("../../img/pixel.png");
  
  loader = new PIXI.AssetLoader(assets);
  loader.onComplete = finishInitializing;
  loader.load();
}

// Finish initializing (after preloading has finished)
function finishInitializing()
{
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
  
  isLoaded = true;
}

// Handle input
function handleInput()
{
  if (inputManager.keysPressed[13] && !inputManager.keysPressedLastFrame[13])
  {
  }
}

// Game loop
function loop()
{
  if (isLoaded)
  {
    // Update
    handleInput();
    
    // Draw
    renderer.render(stage);
  }
  requestAnimFrame(loop);
}

window.onload = initialize;