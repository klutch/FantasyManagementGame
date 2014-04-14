var TooltipScreen = function()
{
  this.type = ScreenType.Tooltip;
  this.inputEnabled = true;
  this.container = new PIXI.DisplayObjectContainer();
  this.container.z = 100;
  this.tooltip = new TooltipComponent();
  this.boundaryMargin = 16;
  this.tooltipOffsetX = 16;
  this.upperLeftBounds = new PIXI.Point(this.boundaryMargin, this.boundaryMargin);
  this.lowerRightBounds = new PIXI.Point(game.containerWidth - this.boundaryMargin, game.containerHeight - this.boundaryMargin);
  this.tips = {};
};

TooltipScreen.prototype.onAddScreen = function()
{
  game.stage.addChild(this.container);
};

TooltipScreen.prototype.onRemoveScreen = function()
{
  game.stage.removeChild(this.container);
};

TooltipScreen.prototype.getNextTooltip = function()
{
  for (var categoryKey in this.tips)
  {
    if (this.tips.hasOwnProperty(categoryKey))
    {
      for (var tagKey in this.tips[categoryKey])
      {
        if (this.tips[categoryKey].hasOwnProperty(tagKey))
        {
          return this.tips[categoryKey][tagKey];
        }
      }
    }
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

TooltipScreen.prototype.setText = function(text)
{
  this.tooltip.setText(text);
  this.tooltip.text.updateTransform();
};

TooltipScreen.prototype.addTooltip = function(category, tag, text)
{
  var wasEmpty = _.size(this.tips) == 0;
  
  if (this.tips[category] == null)
  {
    this.tips[category] = {};
  }
  this.tips[category][tag] = text;
  
  if (wasEmpty)
  {
    this.setText(text);
    this.container.addChild(this.tooltip);
  }
};

TooltipScreen.prototype.removeTooltip = function(category, tag)
{
  delete this.tips[category][tag];
  
  if (_.size(this.tips[category]) == 0)
  {
    delete this.tips[category];
  }
  
  if (_.size(this.tips) == 0)
  {
    this.container.removeChild(this.tooltip);
  }
  else
  {
    this.setText(this.getNextTooltip());
  }
};

TooltipScreen.prototype.removeCategory = function(category)
{
  // Early exit
  if (this.tips[category] == null)
  {
    return;
  }
  
  delete this.tips[category];
  
  if (_.size(this.tips) == 0)
  {
    this.container.removeChild(this.tooltip);
  }
  else
  {
    this.setText(this.getNextTooltip());
  }
};

TooltipScreen.prototype.update = function()
{
  this.setTooltipPosition(game.inputManager.mousePosition);
};
