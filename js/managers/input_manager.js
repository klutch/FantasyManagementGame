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
  
  document.onkeydown = function(e) { e = e || window.event; root.onKeyDown(e.keyCode); };
  document.onkeyup = function(e) { e = e || window.event; root.onKeyUp(e.keyCode); };
  canvas.mousewheel(function(e) { root.mouseWheelDelta = e.deltaY; });
  canvas.click(function(e) { root.leftButton = true; });
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

InputManager.prototype.update = function()
{
  this.mousePosition = game.stage.getMousePosition();
};

InputManager.prototype.postUpdate = function()
{
  this.keysPressedLastFrame = this.keysPressed.slice(0);
  this.keysHandled.length = 0;
  this.leftButtonLastFrame = this.leftButton;
  this.leftButton = false;
  this.leftButtonHandled = false;
  this.mouseWheelDelta = 0;
};