var PanelComponent = function(options)
{
  this.base = PIXI.DisplayObjectContainer;
  this.base();
  
  options = options || {};
  options.x = options.x || 0;
  options.y = options.y || 0;
  options.width = options.width || 640;
  options.height = options.height || 320;
  options.centerX = options.centerX || false;
  options.centerY = options.centerY || false;
  
  this.width = options.width;
  this.height = options.height;
  this.position.x = options.centerX ? options.x - Math.floor(this.width * 0.5) : options.x;
  this.position.y = options.centerY ? options.y - Math.floor(this.height * 0.5) : options.y;
  this.z = options.z;
  
  this.buildPanel();
};

PanelComponent.prototype = new PIXI.DisplayObjectContainer;

PanelComponent.prototype.buildPanel = function()
{
  var topLeft = new PIXI.Sprite(PIXI.Texture.fromImage(game.assetManager.paths.ui.panelCorners[0]));
  var topRight = new PIXI.Sprite(PIXI.Texture.fromImage(game.assetManager.paths.ui.panelCorners[1]));
  var bottomRight = new PIXI.Sprite(PIXI.Texture.fromImage(game.assetManager.paths.ui.panelCorners[2]));
  var bottomLeft = new PIXI.Sprite(PIXI.Texture.fromImage(game.assetManager.paths.ui.panelCorners[3]));
  var top = new PIXI.Sprite(PIXI.Texture.fromImage(game.assetManager.paths.ui.panelSides[0]));
  var right = new PIXI.Sprite(PIXI.Texture.fromImage(game.assetManager.paths.ui.panelSides[1]));
  var bottom = new PIXI.Sprite(PIXI.Texture.fromImage(game.assetManager.paths.ui.panelSides[2]));
  var left = new PIXI.Sprite(PIXI.Texture.fromImage(game.assetManager.paths.ui.panelSides[3]));
  var bg = new PIXI.TilingSprite(PIXI.Texture.fromImage(game.assetManager.paths.ui.panelBg));
  
  // Background
  bg.position.x = left.width;
  bg.position.y = top.height;
  bg.width = this.width - (left.width + right.width);
  bg.height = this.height - (top.height + bottom.height);
  this.addChild(bg);
  
  // Corners
  topLeft.position.x = 0;
  topLeft.position.y = 0;
  this.addChild(topLeft);
  
  topRight.position.x = this.width - topRight.width;
  topRight.position.y = 0;
  this.addChild(topRight);
  
  bottomRight.position.x = this.width - bottomRight.width;
  bottomRight.position.y = this.height - bottomRight.height;
  this.addChild(bottomRight);
  
  bottomLeft.position.x = 0;
  bottomLeft.position.y = this.height - bottomLeft.height;
  this.addChild(bottomLeft);
  
  // Sides
  top.position.x = topLeft.width;
  top.position.y = 0;
  top.width = this.width - (topLeft.width + topRight.width);
  this.addChild(top);
  
  right.position.x = this.width - right.width;
  right.position.y = topRight.height;
  right.height = this.height - (topRight.height + bottomRight.height);
  this.addChild(right);
  
  bottom.position.x = bottomLeft.width;
  bottom.position.y = this.height - bottom.height;
  bottom.width = this.width - (bottomLeft.width + bottomRight.width);
  this.addChild(bottom);
  
  left.position.x = 0;
  left.position.y = topLeft.height;
  left.height = this.height - (topLeft.height + bottomLeft.height);
  this.addChild(left);
};