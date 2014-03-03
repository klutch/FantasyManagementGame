// Input manager class
var InputManager = function()
{
  this.keysPressed = [];
  this.keysPressedLastFrame = [];
  this.leftButton = false;
  this.leftButtonLastFrame = false;
  this.mouseWheelDelta = 0;
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
  this.keysPressedLastFrame = this.keysPressed.slice(0);
  this.leftButtonLastFrame = this.leftButton;
  this.leftButton = false;
  this.mouseWheelDelta = 0;
};