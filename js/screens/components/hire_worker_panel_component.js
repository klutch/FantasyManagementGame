var HireWorkerPanelComponent = function(screen, notification, featureId)
{
  this.base = PIXI.DisplayObjectContainer;
  this.base();
  this.screen = screen;
  this.featureId = featureId;
  this.feature = worldManager.getFeature(featureId);
  
  this.buildAvailableWorkersPanel();
  this.buildBuyerPanel();
};

HireWorkerPanelComponent.prototype = new PIXI.DisplayObjectContainer;

HireWorkerPanelComponent.prototype.buildAvailableWorkersPanel = function()
{
  // Panel
  this.availablePanel = new PanelComponent({
    x: Math.floor(game.containerWidth * 0.5) - 100,
    y: Math.floor(game.containerHeight * 0.5),
    width: 180,
    height: 300,
    centerX: true,
    centerY: true
  });
  this.addChild(this.availablePanel);
  
  // Title
  this.availableTitle = new PIXI.BitmapText("Available", {font: "14px big_pixelmix", tint: 0xFFFF00});
  this.availableTitle.position.x = 16;
  this.availablePanel.position.y = -32;
  this.availablePanel.addChild(this.availableTitle);
};

HireWorkerPanelComponent.prototype.buildBuyerPanel = function()
{
  // Panel
  this.buyerPanel = new PanelComponent({
    x: Math.floor(game.containerWidth * 0.5) + 100,
    y: Math.floor(game.containerHeight * 0.5),
    width: 180,
    height: 300,
    centerX: true,
    centerY: true
  });
  this.addChild(this.buyerPanel);
  
  // Title
  this.buyerTitle = new PIXI.BitmapText("Buying", {font: "14px big_pixelmix", tint: 0xFFFF00});
  this.buyerTitle.position.x = 16;
  this.buyerTitle.position.y = -32;
  this.buyerPanel.addChild(this.buyerTitle);
};

HireWorkerPanelComponent.prototype.update = function()
{
};