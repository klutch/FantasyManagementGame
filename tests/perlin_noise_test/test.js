var containerWidth;
var containerHeight;
var stage;
var renderer;
var inputManager;
var perlinNoise = new PerlinNoise();
var pixelTexture;
var isLoaded;

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
  
  assets.push("pixel.png");
  
  loader = new PIXI.AssetLoader(assets);
  loader.onComplete = finishInitializing;
  loader.load();
}

// Finish initializing (after preloading has finished)
function finishInitializing()
{
  pixelTexture = PIXI.Texture.fromImage("pixel.png");
  
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
    perlinNoise = new PerlinNoise();
    generateNoiseSprite();
  }
}

// Generate noise sprite
function generateNoiseSprite()
{
  var textureSize = 256;
  var renderTexture = new PIXI.RenderTexture(textureSize, textureSize);
  var noiseSprite;
  
  // Clear stage
  while (stage.children.length > 0)
  {
    stage.removeChild(stage.getChildAt(0));
  }
  
  // Render tinted sprites to a texture
  for (var i = 0; i < textureSize; i++)
  {
    for (var j = 0; j < textureSize; j++)
    {
      var n = (perlinNoise.fbm(i, j, 8, 0.8, 0.6, 2) + 1) * 0.5;  // convert from [-1, 1] to [0, 1];
      var sprite = new PIXI.Sprite(pixelTexture);
      
      sprite.tint = n * 255;
      renderTexture.render(sprite, new PIXI.Point(i, j));
    }
  }
  
  // Create sprite and add to stage
  noiseSprite = new PIXI.Sprite(renderTexture);
  stage.addChild(noiseSprite);
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