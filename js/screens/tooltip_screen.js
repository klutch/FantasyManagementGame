var TooltipScreen = function()
{
  this.type = ScreenType.Tooltip;
  this.container = new PIXI.DisplayObjectContainer();
  this.container.z = 100;
  this.tooltip = new TooltipComponent();
  this.tooltipUses = 0; // Number of elements trying to use the tooltip
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
  this.tooltip.setPosition(inputManager.mousePosition);
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

TooltipScreen.prototype.update = function()
{
  if (this.tooltipUses > 0)
  {
    this.tooltip.setPosition(inputManager.mousePosition);
  }
};

