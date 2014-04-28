var TreasuryPanelComponent = function(screen, options)
{
  options = options || {};
  
  this.base = PIXI.DisplayObjectContainer;
  this.base();
  this.screen = screen;
  this.equipmentSystem = game.systemManager.getSystem(SystemType.Equipment);
  this.itemIcons = [];
  
  this.panel = new PanelComponent({
    x: options.x,
    y: options.y,
    width: options.width,
    height: options.height,
    type: PanelType.Dark
  });
  this.addChild(this.panel);
  
  this.container = new PIXI.DisplayObjectContainer();
  this.container.position.x = 16;
  this.container.position.y = 16;
  this.container.width = this.panel.width - 32;
  this.container.height = this.panel.height - 32;
  this.container.targetScrollY = 16;
  this.container.minScrollY = 16;
  this.container.maxScrollY = 16;
  this.panel.addChild(this.container);
  
  this.scrollbar = new ScrollbarComponent(
    this.screen,
    {
      x: this.panel.width - 16,
      y: 16,
      height: this.panel.height - 32,
      scrollAmount: 50
    });
  this.panel.addChild(this.scrollbar);
  this.scrollbar.attachComponent(this.container, 16, 16, this.panel.width - 32, this.panel.height - 32);
  
  this.build();
};

TreasuryPanelComponent.prototype = new PIXI.DisplayObjectContainer;

TreasuryPanelComponent.prototype.rebuild = function()
{
  this.clear();
  this.build();
};

TreasuryPanelComponent.prototype.clear = function()
{
  for (var i = 0; i < this.itemIcons.length; i++)
  {
    this.container.removeChild(this.itemIcons[i]);
  }
  this.itemIcons.length = 0;
};

TreasuryPanelComponent.prototype.build = function()
{
  var root = this;
  var itemSpacingX = 142;
  var itemSpacingY = 50;
  var numCols = Math.floor((this.panel.width - 32) / itemSpacingX);
  
  for (var i = 0; i < this.equipmentSystem.treasuryItemIds.length; i++)
  {
    var itemIcon = new ItemComponent(
      this.screen,
      this.equipmentSystem.treasuryItemIds[i],
      {
        x: Math.floor(i % numCols) * itemSpacingX,
        y: Math.floor(i / numCols) * itemSpacingY,
        onMouseDown: function()
        {
          root.itemIdToDrag = this.itemId;
        }
      });
    
    this.itemIcons.push(itemIcon);
    this.container.addChild(itemIcon);
  }
};

TreasuryPanelComponent.prototype.update = function()
{
  this.scrollbar.update();
  
  for (var i = 0; i < this.itemIcons.length; i++)
  {
    this.itemIcons[i].update();
  }
  
  if (game.inputManager.isDragging && !game.inputManager.isDraggingLastFrame)
  {
    console.log("Should start dragging: " + this.itemIdToDrag);
  }
};