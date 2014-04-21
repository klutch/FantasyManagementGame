var ResizableButtonComponent = function(screen, options)
{
  options = options || {};
  options.x = options.x || 0;
  options.y = options.y || 0;
  options.width = options.width || 200;
  options.height = options.height || 48;
  options.centerX = options.centerX || false;
  options.centerY = options.centerY || false;
  options.enabled = options.enabled == undefined ? true : options.enabled;
  options.onClick = options.onClick || function(e) { };
  options.normalTextStyle = options.normalTextStyle || {font: "12px big_pixelmix", tint: 0xCCCCCC};
  options.overTextStyle = options.overTextStyle || {font: "12px big_pixelmix", tint: 0xFFF568};
  
  this.base = PIXI.DisplayObjectContainer;
  this.base();
  this.screen = screen;
  
  this.width = options.width;
  this.height = options.height;
  this.enabled = options.enabled;
  
  this.position.x = options.centerX ? options.x - Math.floor(this.width * 0.5) : options.x;
  this.position.y = options.centerY ? options.y - Math.floor(this.height * 0.5) : options.y;
  this.onClick = options.onClick;
  this.isMouseOver = false;
  this.z = options.z;
  this.rectangle = new PIXI.Rectangle(0, 0, this.width, this.height);
  
  this.normalSprites = [];
  this.overSprites = [];
  
  this.normalTextStyle = options.normalTextStyle;
  this.overTextStyle = options.overTextStyle;
  
  this.bitmapText = new PIXI.BitmapText(options.text, this.normalTextStyle);
  this.bitmapText.position.x -= Math.floor(this.bitmapText.textWidth * 0.5);
  this.bitmapText.position.y -= Math.floor(this.bitmapText.textHeight * 0.5);
  this.bitmapText.position.x += Math.floor(this.width * 0.5);
  this.bitmapText.position.y += Math.floor(this.height * 0.5);
  this.bitmapText.z = 5;
  this.addChild(this.bitmapText);
  
  this.buildNormalSprites();
  this.buildOverSprites();
  
  for (var i = 0; i < this.normalSprites.length; i++)
  {
    this.addChild(this.normalSprites[i]);
  }
  this.children.sort(depthCompare);
};

ResizableButtonComponent.prototype = new PIXI.DisplayObjectContainer;

ResizableButtonComponent.prototype.buildNormalSprites = function()
{
  var topLeft = new PIXI.Sprite(PIXI.Texture.fromImage(game.assetManager.paths.ui.resizableButtonCorners[0]));
  var topRight = new PIXI.Sprite(PIXI.Texture.fromImage(game.assetManager.paths.ui.resizableButtonCorners[1]));
  var bottomRight = new PIXI.Sprite(PIXI.Texture.fromImage(game.assetManager.paths.ui.resizableButtonCorners[2]));
  var bottomLeft = new PIXI.Sprite(PIXI.Texture.fromImage(game.assetManager.paths.ui.resizableButtonCorners[3]));
  var top = new PIXI.Sprite(PIXI.Texture.fromImage(game.assetManager.paths.ui.resizableButtonSides[0]));
  var right = new PIXI.Sprite(PIXI.Texture.fromImage(game.assetManager.paths.ui.resizableButtonSides[1]));
  var bottom = new PIXI.Sprite(PIXI.Texture.fromImage(game.assetManager.paths.ui.resizableButtonSides[2]));
  var left = new PIXI.Sprite(PIXI.Texture.fromImage(game.assetManager.paths.ui.resizableButtonSides[3]));
  var bg = new PIXI.TilingSprite(PIXI.Texture.fromImage(game.assetManager.paths.ui.resizableButtonBg));
  
  // Background
  bg.position.x = left.width;
  bg.position.y = top.height;
  bg.width = this.width - (left.width + right.width);
  bg.height = this.height - (top.height + bottom.height);
  bg.z = -1;
  this.normalSprites.push(bg);
  
  // Corners
  topLeft.position.x = 0;
  topLeft.position.y = 0;
  this.normalSprites.push(topLeft);
  
  topRight.position.x = this.width - topRight.width;
  topRight.position.y = 0;
  this.normalSprites.push(topRight);
  
  bottomRight.position.x = this.width - bottomRight.width;
  bottomRight.position.y = this.height - bottomRight.height;
  this.normalSprites.push(bottomRight);
  
  bottomLeft.position.x = 0;
  bottomLeft.position.y = this.height - bottomLeft.height;
  this.normalSprites.push(bottomLeft);
  
  // Sides
  top.position.x = topLeft.width;
  top.position.y = 0;
  top.width = this.width - (topLeft.width + topRight.width);
  top.z = 1;
  this.normalSprites.push(top);
  
  right.position.x = this.width - right.width;
  right.position.y = topRight.height;
  right.height = this.height - (topRight.height + bottomRight.height);
  right.z = 1;
  this.normalSprites.push(right);
  
  bottom.position.x = bottomLeft.width;
  bottom.position.y = this.height - bottom.height;
  bottom.width = this.width - (bottomLeft.width + bottomRight.width);
  bottom.z = 1;
  this.normalSprites.push(bottom);
  
  left.position.x = 0;
  left.position.y = topLeft.height;
  left.height = this.height - (topLeft.height + bottomLeft.height);
  left.z = 1;
  this.normalSprites.push(left);
};

ResizableButtonComponent.prototype.buildOverSprites = function()
{
  var topLeft = new PIXI.Sprite(PIXI.Texture.fromImage(game.assetManager.paths.ui.resizableButtonCornersOver[0]));
  var topRight = new PIXI.Sprite(PIXI.Texture.fromImage(game.assetManager.paths.ui.resizableButtonCornersOver[1]));
  var bottomRight = new PIXI.Sprite(PIXI.Texture.fromImage(game.assetManager.paths.ui.resizableButtonCornersOver[2]));
  var bottomLeft = new PIXI.Sprite(PIXI.Texture.fromImage(game.assetManager.paths.ui.resizableButtonCornersOver[3]));
  var top = new PIXI.Sprite(PIXI.Texture.fromImage(game.assetManager.paths.ui.resizableButtonSidesOver[0]));
  var right = new PIXI.Sprite(PIXI.Texture.fromImage(game.assetManager.paths.ui.resizableButtonSidesOver[1]));
  var bottom = new PIXI.Sprite(PIXI.Texture.fromImage(game.assetManager.paths.ui.resizableButtonSidesOver[2]));
  var left = new PIXI.Sprite(PIXI.Texture.fromImage(game.assetManager.paths.ui.resizableButtonSidesOver[3]));
  var bg = new PIXI.TilingSprite(PIXI.Texture.fromImage(game.assetManager.paths.ui.resizableButtonBgOver));
  
  // Background
  bg.position.x = left.width;
  bg.position.y = top.height;
  bg.width = this.width - (left.width + right.width);
  bg.height = this.height - (top.height + bottom.height);
  bg.z = -1;
  this.overSprites.push(bg);
  
  // Corners
  topLeft.position.x = 0;
  topLeft.position.y = 0;
  this.overSprites.push(topLeft);
  
  topRight.position.x = this.width - topRight.width;
  topRight.position.y = 0;
  this.overSprites.push(topRight);
  
  bottomRight.position.x = this.width - bottomRight.width;
  bottomRight.position.y = this.height - bottomRight.height;
  this.overSprites.push(bottomRight);
  
  bottomLeft.position.x = 0;
  bottomLeft.position.y = this.height - bottomLeft.height;
  this.overSprites.push(bottomLeft);
  
  // Sides
  top.position.x = topLeft.width;
  top.position.y = 0;
  top.width = this.width - (topLeft.width + topRight.width);
  top.z = 1;
  this.overSprites.push(top);
  
  right.position.x = this.width - right.width;
  right.position.y = topRight.height;
  right.height = this.height - (topRight.height + bottomRight.height);
  right.z = 1;
  this.overSprites.push(right);
  
  bottom.position.x = bottomLeft.width;
  bottom.position.y = this.height - bottom.height;
  bottom.width = this.width - (bottomLeft.width + bottomRight.width);
  bottom.z = 1;
  this.overSprites.push(bottom);
  
  left.position.x = 0;
  left.position.y = topLeft.height;
  left.height = this.height - (topLeft.height + bottomLeft.height);
  left.z = 1;
  this.overSprites.push(left);
};

ResizableButtonComponent.prototype.setTextures = function(isMouseOver)
{
  if (isMouseOver)
  {
    for (var i = 0; i < this.normalSprites.length; i++)
    {
      this.removeChild(this.normalSprites[i]);
    }
    for (var i = 0; i < this.overSprites.length; i++)
    {
      this.addChild(this.overSprites[i]);
    }
  }
  else
  {
    for (var i = 0; i < this.overSprites.length; i++)
    {
      this.removeChild(this.overSprites[i]);
    }
    for (var i = 0; i < this.normalSprites.length; i++)
    {
      this.addChild(this.normalSprites[i]);
    }
  }
  this.children.sort(depthCompare);
};

ResizableButtonComponent.prototype.onMouseOver = function()
{
  this.isMouseOver = true;
  this.setTextures(true);
  this.bitmapText.setStyle(this.overTextStyle);
  document.body.style.cursor = "pointer";
};

ResizableButtonComponent.prototype.onMouseOut = function()
{
  this.isMouseOver = false;
  this.setTextures(false);
  this.bitmapText.setStyle(this.normalTextStyle);
  document.body.style.cursor = "auto";
};

ResizableButtonComponent.prototype.update = function()
{
  var mousePosition = game.inputManager.mousePosition;
  var rectContainsMouse = false;
  var clicked = game.inputManager.leftButton && !game.inputManager.leftButtonHandled && !game.inputManager.leftButtonHandled;
  
  this.rectangle.x = this.worldTransform.tx;
  this.rectangle.y = this.worldTransform.ty;
  
  rectContainsMouse = this.rectangle.contains(mousePosition.x, mousePosition.y)

  if (!this.isMouseOver && rectContainsMouse)
  {
    this.onMouseOver();
  }
  else if (this.isMouseOver && !rectContainsMouse)
  {
    this.onMouseOut();
  }

  if (this.isMouseOver && clicked)
  {
    document.body.style.cursor = "auto";
    this.onClick();
  }
};