/* 
 * Copyright 2014 Graeme Collins
 */

// Core game variables
var game;

/*
var fps;
var fpsText;
var lastLoop = new Date();*/

// Initialize
function initialize()
{
  game = new GameEngine();
  
  // Start main loop
  requestAnimFrame(loop);
}

// Finish initializing (after preloading has finished)
/*
function finishInitializing()
{
  fps = [60, 60, 60, 60, 60, 60, 60, 60, 60, 60];
  fpsText = new PIXI.Text("...", { font: "bold 20pt Trebuchet MS", fill: "white" });
  fpsText.y = game.containerHeight - 32;
  fpsText.z = 110;
  game.stage.addChild(fpsText);
  game.stage.children.sort(depthCompare);
  
  isLoaded = true;
}*/

// Get random integer between values
function getRandomInt(a, b)
{
  var lowest = Math.min(a, b);
  var highest = Math.max(a, b);
  var range = highest - lowest;
  
  return Math.floor(Math.random() * range + lowest);
}

// Update fps
/*
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
}*/

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
  if (game.isLoaded)
  {
    //updateFps();
    game.update();
    game.draw();
  }
  requestAnimFrame(loop);
}

window.onload = initialize;