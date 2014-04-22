var ButtonInputState = Object.freeze({
  Normal: 0,
  Over: 1,
  Disabled: 2
});

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
  options.disabledTextStyle = options.disabledTextStyle || {font: "12px big_pixelmix", tint: 0x999999};
  
  this.base = PIXI.DisplayObjectContainer;
  this.base();
  this.screen = screen;
  
  this.width = options.width;
  this.height = options.height;
  this.enabled = options.enabled;
  
  this.position.x = options.centerX ? options.x - Math.floor(this.width * 0.5) : options.x;
  this.position.y = options.centerY ? options.y - Math.floor(this.height * 0.5) : options.y;
  this.onClick = options.onClick;
  this.z = options.z;
  this.isMouseOver = false;
  this.rectangle = new PIXI.Rectangle(0, 0, this.width, this.height);
  
  this.normalSprites = [];
  this.overSprites = [];
  this.disabledSprites = [];
  
  this.normalTextStyle = options.normalTextStyle;
  this.overTextStyle = options.overTextStyle;
  this.disabledTextStyle = options.disabledTextStyle;
  
  this.bitmapText = new PIXI.BitmapText(options.text, this.normalTextStyle);
  this.bitmapText.position.x -= Math.floor(this.bitmapText.textWidth * 0.5);
  this.bitmapText.position.y -= Math.floor(this.bitmapText.textHeight * 0.5);
  this.bitmapText.position.x += Math.floor(this.width * 0.5);
  this.bitmapText.position.y += Math.floor(this.height * 0.5);
  this.bitmapText.z = 5;
  this.addChild(this.bitmapText);
  
  this.buildSprites(
    this.normalSprites,
    [
      game.assetManager.paths.ui.resizableButtonCorners[0],
      game.assetManager.paths.ui.resizableButtonCorners[1],
      game.assetManager.paths.ui.resizableButtonCorners[2],
      game.assetManager.paths.ui.resizableButtonCorners[3],
      game.assetManager.paths.ui.resizableButtonSides[0],
      game.assetManager.paths.ui.resizableButtonSides[1],
      game.assetManager.paths.ui.resizableButtonSides[2],
      game.assetManager.paths.ui.resizableButtonSides[3],
      game.assetManager.paths.ui.resizableButtonBg
    ]);
  this.buildSprites(
    this.overSprites,
    [
      game.assetManager.paths.ui.resizableButtonCornersOver[0],
      game.assetManager.paths.ui.resizableButtonCornersOver[1],
      game.assetManager.paths.ui.resizableButtonCornersOver[2],
      game.assetManager.paths.ui.resizableButtonCornersOver[3],
      game.assetManager.paths.ui.resizableButtonSidesOver[0],
      game.assetManager.paths.ui.resizableButtonSidesOver[1],
      game.assetManager.paths.ui.resizableButtonSidesOver[2],
      game.assetManager.paths.ui.resizableButtonSidesOver[3],
      game.assetManager.paths.ui.resizableButtonBgOver
    ]);
  this.buildSprites(
    this.disabledSprites,
    [
      game.assetManager.paths.ui.resizableButtonCornersDisabled[0],
      game.assetManager.paths.ui.resizableButtonCornersDisabled[1],
      game.assetManager.paths.ui.resizableButtonCornersDisabled[2],
      game.assetManager.paths.ui.resizableButtonCornersDisabled[3],
      game.assetManager.paths.ui.resizableButtonSidesDisabled[0],
      game.assetManager.paths.ui.resizableButtonSidesDisabled[1],
      game.assetManager.paths.ui.resizableButtonSidesDisabled[2],
      game.assetManager.paths.ui.resizableButtonSidesDisabled[3],
      game.assetManager.paths.ui.resizableButtonBgDisabled
    ]);
  
  this.setInputState(this.enabled ? ButtonInputState.Normal : ButtonInputState.Disabled);
};

ResizableButtonComponent.prototype = new PIXI.DisplayObjectContainer;

ResizableButtonComponent.prototype.buildSprites = function(container, paths)
{
  var topLeft = new PIXI.Sprite(PIXI.Texture.fromImage(paths[0]));
  var topRight = new PIXI.Sprite(PIXI.Texture.fromImage(paths[1]));
  var bottomRight = new PIXI.Sprite(PIXI.Texture.fromImage(paths[2]));
  var bottomLeft = new PIXI.Sprite(PIXI.Texture.fromImage(paths[3]));
  var top = new PIXI.Sprite(PIXI.Texture.fromImage(paths[4]));
  var right = new PIXI.Sprite(PIXI.Texture.fromImage(paths[5]));
  var bottom = new PIXI.Sprite(PIXI.Texture.fromImage(paths[6]));
  var left = new PIXI.Sprite(PIXI.Texture.fromImage(paths[7]));
  var bg = new PIXI.TilingSprite(PIXI.Texture.fromImage(paths[8]));
  
  // Background
  bg.position.x = left.width;
  bg.position.y = top.height;
  bg.width = this.width - (left.width + right.width);
  bg.height = this.height - (top.height + bottom.height);
  bg.z = -1;
  container.push(bg);
  
  // Corners
  topLeft.position.x = 0;
  topLeft.position.y = 0;
  container.push(topLeft);
  
  topRight.position.x = this.width - topRight.width;
  topRight.position.y = 0;
  container.push(topRight);
  
  bottomRight.position.x = this.width - bottomRight.width;
  bottomRight.position.y = this.height - bottomRight.height;
  container.push(bottomRight);
  
  bottomLeft.position.x = 0;
  bottomLeft.position.y = this.height - bottomLeft.height;
  container.push(bottomLeft);
  
  // Sides
  top.position.x = topLeft.width;
  top.position.y = 0;
  top.width = this.width - (topLeft.width + topRight.width);
  top.z = 1;
  container.push(top);
  
  right.position.x = this.width - right.width;
  right.position.y = topRight.height;
  right.height = this.height - (topRight.height + bottomRight.height);
  right.z = 1;
  container.push(right);
  
  bottom.position.x = bottomLeft.width;
  bottom.position.y = this.height - bottom.height;
  bottom.width = this.width - (bottomLeft.width + bottomRight.width);
  bottom.z = 1;
  container.push(bottom);
  
  left.position.x = 0;
  left.position.y = topLeft.height;
  left.height = this.height - (topLeft.height + bottomLeft.height);
  left.z = 1;
  container.push(left);
};

ResizableButtonComponent.prototype.setInputState = function(inputState)
{
  if (this.inputState != undefined)
  {
    if (this.inputState == ButtonInputState.Normal)
    {
      for (var i = 0; i < this.normalSprites.length; i++)
      {
        this.removeChild(this.normalSprites[i]);
      }
    }
    else if (this.inputState == ButtonInputState.Over)
    {
      for (var i = 0; i < this.overSprites.length; i++)
      {
        this.removeChild(this.overSprites[i]);
      }
    }
    else if (this.inputState == ButtonInputState.Disabled)
    {
      for (var i = 0; i < this.disabledSprites.length; i++)
      {
        this.removeChild(this.disabledSprites[i]);
      }
    }
  }
  
  if (inputState == ButtonInputState.Normal)
  {
    for (var i = 0; i < this.normalSprites.length; i++)
    {
      this.addChild(this.normalSprites[i]);
    }
  }
  else if (inputState == ButtonInputState.Over)
  {
    for (var i = 0; i < this.overSprites.length; i++)
    {
      this.addChild(this.overSprites[i]);
    }
  }
  else if (inputState == ButtonInputState.Disabled)
  {
    for (var i = 0; i < this.disabledSprites.length; i++)
    {
      this.addChild(this.disabledSprites[i]);
    }
  }
  
  this.inputState = inputState;
  this.children.sort(depthCompare);
};

ResizableButtonComponent.prototype.onMouseOver = function()
{
  this.isMouseOver = true;
  this.setInputState(ButtonInputState.Over);
  this.bitmapText.setStyle(this.overTextStyle);
  document.body.style.cursor = "pointer";
};

ResizableButtonComponent.prototype.onMouseOut = function()
{
  this.isMouseOver = false;
  this.setInputState(ButtonInputState.Normal);
  this.bitmapText.setStyle(this.normalTextStyle);
  document.body.style.cursor = "auto";
};

ResizableButtonComponent.prototype.setEnabled = function(value)
{
  this.enabled = value;
  this.setInputState(this.enabled ? ButtonInputState.Normal : ButtonInputState.Disabled);
  this.bitmapText.setStyle(this.enabled ? this.normalTextStyle : this.disabledTextStyle);
};

ResizableButtonComponent.prototype.update = function()
{
  if (this.enabled)
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
  }
};