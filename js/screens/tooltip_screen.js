var TooltipScreen = function()
{
  this.type = ScreenType.Tooltip;
  this.container = new PIXI.DisplayObjectContainer();
  this.container.z = 100;
  this.tooltip = new TooltipComponent();
  this.tooltipUses = 0; // Number of elements trying to use the tooltip
  this.boundaryMargin = 16;
  this.tooltipOffsetX = 16;
  this.upperLeftBounds = new PIXI.Point(this.boundaryMargin, this.boundaryMargin);
  this.lowerRightBounds = new PIXI.Point(game.containerWidth - this.boundaryMargin, game.containerHeight - this.boundaryMargin);
};

TooltipScreen.prototype.onAddScreen = function()
{
  game.stage.addChild(this.container);
};

TooltipScreen.prototype.onRemoveScreen = function()
{
  game.stage.removeChild(this.container);
};

TooltipScreen.prototype.enableTooltip = function(text)
{
  this.tooltip.setText(text);
  this.tooltip.position.x = -1000;
  this.tooltip.position.y = -1000;
  this.tooltip.text.updateText();
  if (this.tooltipUses == 0)
  {
    this.container.addChild(this.tooltip);
  }
  this.tooltip.updateTransform();
  this.tooltipUses++;
};

TooltipScreen.prototype.disableTooltip = function()
{
  this.tooltipUses--;
  if (this.tooltipUses == 0)
  {
    this.container.removeChild(this.tooltip);
  }
};

TooltipScreen.prototype.setTooltipPosition = function(mouse)
{
  this.tooltip.position.x = mouse.x + this.tooltipOffsetX;
  this.tooltip.position.y = mouse.y;
  
  // Enforce upper left boundary
  this.tooltip.position.x = Math.max(this.upperLeftBounds.x, this.tooltip.position.x);
  this.tooltip.position.y = Math.max(this.upperLeftBounds.y, this.tooltip.position.y);
  
  // Enforce lower right boundary
  this.tooltip.position.x = Math.min(this.lowerRightBounds.x - this.tooltip.text.textWidth, this.tooltip.position.x);
  this.tooltip.position.y = Math.min(this.lowerRightBounds.y - this.tooltip.text.textHeight, this.tooltip.position.y);
};

TooltipScreen.prototype.update = function()
{
  if (this.tooltipUses > 0)
  {
    this.setTooltipPosition(inputManager.mousePosition);
  }
};

