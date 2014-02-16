// Input manager class
var InputManager = function()
{
  this.keysPressed = [];
  this.keysPressedLastFrame = [];
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
  // Clone array
  this.keysPressedLastFrame = this.keysPressed.slice(0);
};