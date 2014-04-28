// Input manager class
var InputManager = function()
{
  var root = this;
  var canvas = $('canvas');
  
  this.keysPressed = [];
  this.keysPressedLastFrame = [];
  this.keysHandled = [];
  this.leftButton = false;
  this.leftButtonLastFrame = false;
  this.leftButtonHandled = false;
  this.mouseWheelDelta = 0;
  this.mousePosition;
  this.dragOrigin = new PIXI.Point(0, 0);
  this.isDragging = false;
  this.isDraggingLastFrame = false;
  
  document.onkeydown = function(e) { e = e || window.event; root.onKeyDown(e.keyCode); };
  document.onkeyup = function(e) { e = e || window.event; root.onKeyUp(e.keyCode); };
  canvas.mousewheel(function(e) { root.mouseWheelDelta = e.deltaY; });
  //canvas.click(function(e) { root.leftButton = true; });
  canvas.mousedown(function(e) { root.leftButton = true; });
  canvas.mouseup(function(e) { root.leftButton = false; });
  canvas.touchstart = canvas.click;
}

InputManager.prototype.onKeyDown = function(keyCode)
{
  this.keysPressed[keyCode] = true;
};

InputManager.prototype.onKeyUp = function(keyCode)
{
  this.keysPressed[keyCode] = false;
};

// This is a helper method to check for a single key stroke, and mark it as being handled.
InputManager.prototype.simpleKey = function(keyCode)
{
  if (this.keysPressed[keyCode] && !this.keysPressedLastFrame[keyCode] && !this.keysHandled[keyCode])
  {
    this.keysHandled[keyCode] = true;
    return true;
  }
  return false;
};

InputManager.prototype.singleLeftButton = function()
{
  //return !this.leftButtonHandled && this.leftButton && !this.leftButtonLastFrame;
  return !this.leftButtonHandled && !this.leftButton && this.leftButtonLastFrame;
};

InputManager.prototype.update = function()
{
  this.mousePosition = game.stage.getMousePosition();
  
  if (this.leftButton && !this.leftButtonLastFrame)
  {
    this.dragOrigin.x = this.mousePosition.x;
    this.dragOrigin.y = this.mousePosition.y;
  }
  
  if (this.leftButton)
  {
    var deltaX = this.mousePosition.x - this.dragOrigin.x;
    var deltaY = this.mousePosition.y - this.dragOrigin.y;
    var distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    if (distance > 8)
    {
      this.isDragging = true;
    }
  }
  else
  {
    this.isDragging = false;
  }
};

InputManager.prototype.postUpdate = function()
{
  this.keysPressedLastFrame = this.keysPressed.slice(0);
  this.keysHandled.length = 0;
  this.leftButtonLastFrame = this.leftButton;
  this.leftButtonHandled = false;
  this.isDraggingLastFrame = this.isDragging;
  this.mouseWheelDelta = 0;
};