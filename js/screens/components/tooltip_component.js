var TooltipComponent = function()
{
  this.base = PIXI.DisplayObjectContainer;
  this.base();
  this.text = new PIXI.BitmapText("", {font: "20px big_pixelmix", tint: 0xFFF200});
  this.addChild(this.text);
};

TooltipComponent.prototype = new PIXI.DisplayObjectContainer;

TooltipComponent.prototype.setText = function(text)
{
  this.text.setText(text);
};