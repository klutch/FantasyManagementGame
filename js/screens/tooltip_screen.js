var TooltipScreen = function()
{
  this.type = ScreenType.Tooltip;
  this.container = new PIXI.DisplayObjectContainer();
  this.container.z = 100;
  this.tooltip = new TooltipComponent();
  this.tooltipUses = 0; // Number of elements trying to use the tooltip
  this.boundaryMargin = 16;
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
  this.setTooltipPosition(inputManager.mousePosition);
  if (this.tooltipUses == 0)
  {
    this.container.addChild(this.tooltip);
  }
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
  // Enforce upper left boundary
  this.tooltip.position.x = Math.max(this.upperLeftBounds.x, mouse.x);
  this.tooltip.position.y = Math.max(this.upperLeftBounds.y, mouse.y);
  
  // Enforce lower right boundary
  this.tooltip.position.x = Math.min(this.lowerRightBounds.x - this.tooltip.text.textWidth, mouse.x);
  this.tooltip.position.y = Math.min(this.lowerRightBounds.y - this.tooltip.text.textHeight, mouse.y);
};

TooltipScreen.prototype.update = function()
{
  if (this.tooltipUses > 0)
  {
    this.setTooltipPosition(inputManager.mousePosition);
  }
};

