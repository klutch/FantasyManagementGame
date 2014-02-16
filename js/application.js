/* 
 * Copyright 2014 Graeme Collins
 */

var stage;
var renderer;
var world;
var worldRenderer;
var inputManager;

// Initialize
function initialize()
{
  // Initialize Pixi
  stage = new PIXI.Stage(0x66FF99);
  renderer = PIXI.autoDetectRenderer(1024, 640);
  document.body.appendChild(renderer.view);
  
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
  if (inputManager.keysPressed[65])
  {
    worldRenderer.moveCamera(worldRenderer.camera.position.x - 1, worldRenderer.camera.position.y);
  }
  if (inputManager.keysPressed[68])
  {
    worldRenderer.moveCamera(worldRenderer.camera.position.x + 1, worldRenderer.camera.position.y);
  }
  if (inputManager.keysPressed[83])
  {
    worldRenderer.moveCamera(worldRenderer.camera.position.x, worldRenderer.camera.position.y + 1);
  }
  if (inputManager.keysPressed[87])
  {
    worldRenderer.moveCamera(worldRenderer.camera.position.x, worldRenderer.camera.position.y - 1);
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
  worldRenderer.render(8, 8);
  renderer.render(stage);
}

window.onload = initialize;