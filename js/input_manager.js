// Input manager class
var InputManager = function()
{
  var root = this;
  var canvas = $('canvas');
  
  this.keysPressed = [];
  this.keysPressedLastFrame = [];
  this.leftButton = false;
  this.leftButtonLastFrame = false;
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

InputManager.prototype.update = function()
{
  this.mousePosition = game.stage.getMousePosition();
  this.keysPressedLastFrame = this.keysPressed.slice(0);
  this.leftButtonLastFrame = this.leftButton;
  this.leftButton = false;
  this.mouseWheelDelta = 0;
};