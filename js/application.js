/* 
 * Copyright 2014 Graeme Collins
 */

var stage;
var renderer;
var world;
var worldRenderer;

// Initialize
function initialize()
{
  // Initialize Pixi
  stage = new PIXI.Stage(0x66FF99);
  renderer = PIXI.autoDetectRenderer(1024, 640);
  
  // Initialize world
  world = new World();
  worldRenderer = new WorldRenderer(world);
  stage.addChild(worldRenderer.container);
  
  document.body.appendChild(renderer.view);
  requestAnimFrame(loop);
}

// Game loop
function loop()
{
  requestAnimFrame(loop);
  worldRenderer.render(0, 0, 32, 20);
  renderer.render(stage);
}

window.onload = initialize;