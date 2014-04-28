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
  this.panel.addChild(this.container);
  
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
  var spacing = 34;
  var numCols = Math.floor((this.panel.width - 32) / spacing);
  
  for (var i = 0; i < this.equipmentSystem.treasuryItemIds.length; i++)
  {
    var itemIcon = new ItemComponent(
      this.screen,
      this.equipmentSystem.treasuryItemIds[i],
      {
        x: Math.floor(i % numCols) * spacing,
        y: Math.floor(i / numCols) * spacing
      });
    
    this.itemIcons.push(itemIcon);
    this.container.addChild(itemIcon);
  }
};