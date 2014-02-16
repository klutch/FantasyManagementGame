/* 
 * Copyright 2014 Graeme Collins
 */

var stage;
var renderer;
var world;
var worldRenderer;
var inputManager;
var focus;

// Initialize
function initialize()
{
  // Initialize Pixi
  stage = new PIXI.Stage(0x66FF99);
  renderer = PIXI.autoDetectRenderer(1024, 640);
  document.body.appendChild(renderer.view);
  focus = new PIXI.Point(0, 0);
  
  // Initialize world
  world = new World();
  worldRenderer = new WorldRenderer(world);
  stage.addChild(worldRenderer.container);
  
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
  
  // Start main loop
  requestAnimFrame(loop);
}

// Handle input
function handleInput()
{
  if (inputManager.keysPressed[65] && !inputManager.keysPressedLastFrame[65])
  {
    focus.x--;
  }
  if (inputManager.keysPressed[68] && !inputManager.keysPressedLastFrame[68])
  {
    focus.x++;
  }
  if (inputManager.keysPressed[83] && !inputManager.keysPressedLastFrame[83])
  {
    focus.y++;
  }
  if (inputManager.keysPressed[87] && !inputManager.keysPressedLastFrame[87])
  {
    focus.y--;
  }
  
  inputManager.update();
}

// Game loop
function loop()
{ 
  // Update
  handleInput();
  
  // Draw
  requestAnimFrame(loop);
  worldRenderer.render(focus.x, focus.y, 8, 8);
  renderer.render(stage);
}

window.onload = initialize;