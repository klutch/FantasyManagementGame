var TextfieldComponent = function(screen, options)
{
  options = options || {};
  options.x = options.x || Math.floor(game.containerWidth * 0.5);
  options.y = options.y || Math.floor(game.containerHeight * 0.5);
  options.width = options.width || 80;
  options.height = options.height || 32;
  
  this.width = options.width;
  this.height = options.height;
  this.textInput = document.createElement("input");
  this.textInput.type = "text";
  this.textInput.name = "generic_text_input";
  this.textInput.id = "textfield_component";
  this.textInput.style.position = "absolute";
  this.textInput.style.left = (options.centerX ? Math.floor(options.x - options.width * 0.5) : options.x).toString() + "px";
  this.textInput.style.top = (options.centerY ? Math.floor(options.y - options.height * 0.5) : options.y).toString() + "px";
  this.textInput.style.width = options.width.toString() + "px";
  this.textInput.style.height = options.height.toString() + "px";
};

TextfieldComponent.prototype.getText = function()
{
  return this.textInput.value;
};

TextfieldComponent.prototype.show = function()
{
  document.getElementById("container").appendChild(this.textInput);
};

TextfieldComponent.prototype.hide = function()
{
  document.getElementById("container").removeChild(this.textInput);
};