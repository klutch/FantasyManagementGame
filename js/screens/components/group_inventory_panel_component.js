var GroupInventoryPanelComponent = function(screen, options)
{
  var root = this;
  
  options = options || {};
  options.x = options.x || 0;
  options.y = options.y || 0;
  options.width = options.width || 300;
  options.height = options.height || 200;
  
  this.base = PIXI.DisplayObjectContainer;
  this.base();
  this.screen = screen;
  this.groupSystem = game.systemManager.getSystem(SystemType.Group);
  this.equipmentSystem = game.systemManager.getSystem(SystemType.Equipment);
  this.itemSpacing = 34;
  
  this.panel = new PanelComponent({
    x: options.x,
    y: options.y,
    width: options.width,
    height: options.height,
    type: PanelType.Dark
  });
  this.addChild(this.panel);
  
  this.itemsContainer = new PIXI.DisplayObjectContainer();
  this.itemsContainer.position.x = 16;
  this.itemsContainer.position.y = 16;
  this.itemsContainer.width = this.panel.width - 32;
  this.itemsContainer.height = this.panel.height - 32;
  this.itemsContainer.minScrollY = 16;
  this.itemsContainer.maxScrollY = 16;
  this.itemsContainer.targetScrollY = 16;
  this.panel.addChild(this.itemsContainer);
  
  this.scrollbar = new ScrollbarComponent(
    this.screen,
    {
      x: this.panel.width - 16,
      y: 16,
      height: this.panel.height - 32,
      scrollAmount: this.itemSpacing
    });
  this.panel.addChild(this.scrollbar);
  this.scrollbar.attachComponent(this.itemsContainer, 16, 16, this.itemsContainer.width, this.itemsContainer.height);
  
  this.itemSprites = [];
};

GroupInventoryPanelComponent.prototype = new PIXI.DisplayObjectContainer;

GroupInventoryPanelComponent.prototype.selectGroup = function(groupId)
{
  this.groupId = groupId;
  this.group = this.groupSystem.getGroup(groupId);
  this.rebuildGroupInventory();
};

GroupInventoryPanelComponent.prototype.deselectGroup = function()
{
  this.groupId = null;
  this.group = null;
  this.rebuildGroupInventory();
};

GroupInventoryPanelComponent.prototype.rebuildGroupInventory = function()
{
  this.clearGroupInventory();
  this.buildGroupInventory();
};

GroupInventoryPanelComponent.prototype.clearGroupInventory = function()
{
  for (var i = 0; i < this.itemSprites.length; i++)
  {
    this.itemsContainer.removeChild(this.itemSprites[i]);
  }
  this.itemSprites.length = 0;
};

GroupInventoryPanelComponent.prototype.buildGroupInventory = function()
{
  if (this.group != null)
  {
    var itemIds = this.equipmentSystem.getGroupInventory(this.groupId);
    var numCols = Math.floor(this.itemsContainer.width / this.itemSpacing);
    var totalContentHeight = 0;

    for (var i = 0; i < itemIds.length; i++)
    {
      var x = Math.floor(i % numCols) * this.itemSpacing;
      var y = Math.floor(i / numCols) * this.itemSpacing;

      var itemSprite = new ItemComponent(
        this.screen,
        itemIds[i],
        {
          x: x,
          y: y
        });
      this.itemSprites.push(itemSprite);
      this.itemsContainer.addChild(itemSprite);
    }

    totalContentHeight = Math.ceil(this.itemSprites.length / numCols) * this.itemSpacing;

    this.itemsContainer.minScrollY = totalContentHeight < this.itemsContainer.height ? 16 : -totalContentHeight + this.itemsContainer.height;
    this.itemsContainer.maxScrollY = 16;
    this.scrollbar.setTargetScrollY(16);
  }
};

GroupInventoryPanelComponent.prototype.update = function()
{
  this.scrollbar.update();
};