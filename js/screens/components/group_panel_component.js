var GroupPanelComponent = function(options)
{
  options = options || {};
  
  var middleX = Math.floor(options.width * 0.5) - 8;
  
  this.base = PIXI.DisplayObjectContainer;
  this.base();
  this.width = options.width;
  this.selectors = [];
  this.z = options.z;
  delete options.z;
  
  // Create background panel
  this.panel = new PanelComponent(options);
  this.addChild(this.panel);
  
  // Create manage groups button
  this.manageGroupsButton = new ButtonComponent({
    x: middleX,
    y: 132,
    centerX: true,
    centerY: true,
    normalTexture: PIXI.Texture.fromImage(assetPathManager.assetPaths.ui.standardButtons[0]),
    hoverTexture: PIXI.Texture.fromImage(assetPathManager.assetPaths.ui.standardButtons[1]),
    text: "Manage Groups"
  });
  this.addChild(this.manageGroupsButton);
  
  // Create dividers
  this.dividers = [];
  this.dividers[0] = PIXI.Sprite.fromImage(assetPathManager.assetPaths.ui.divider);
  this.dividers[0].anchor.x = 0.5;
  this.dividers[0].position.x = middleX;
  this.dividers[0].position.y = this.manageGroupsButton.position.y - 32;
  this.addChild(this.dividers[0]);
  
  this.dividers[1] = PIXI.Sprite.fromImage(assetPathManager.assetPaths.ui.divider);
  this.dividers[1].anchor.x = 0.5;
  this.dividers[1].position.x = middleX;
  this.dividers[1].position.y = this.manageGroupsButton.position.y + 28;
  this.addChild(this.dividers[1]);
  
  // Create info text
  this.totalAdventurersLeft = new PIXI.BitmapText("Adventurers:", {font: "12px big_pixelmix", tint: 0xCCCCCC});
  this.totalAdventurersLeft.position.x = 16;
  this.totalAdventurersLeft.position.y = 48;
  this.addChild(this.totalAdventurersLeft);
  this.totalAdventurersRight = new PIXI.BitmapText("...", {font: "12px big_pixelmix", tint: 0xFFF568});
  this.totalAdventurersRight.position.y = this.totalAdventurersLeft.position.y;
  this.addChild(this.totalAdventurersRight);
  
  this.totalWorkersLeft = new PIXI.BitmapText("Workers:", {font: "12px big_pixelmix", tint: 0xCCCCCC});
  this.totalWorkersLeft.position.x = 16;
  this.totalWorkersLeft.position.y = 64;
  this.addChild(this.totalWorkersLeft);
  this.totalWorkersRight = new PIXI.BitmapText("...", {font: "12px big_pixelmix", tint: 0xFFF568});
  this.totalWorkersRight.position.y = this.totalWorkersLeft.position.y;
  this.addChild(this.totalWorkersRight);
};

GroupPanelComponent.prototype = new PIXI.DisplayObjectContainer;

GroupPanelComponent.prototype.addGroup = function(groupId)
{
  var groupSelector = new GroupSelectorComponent(this, groupId);
  
  this.selectors[groupId] = groupSelector;
  this.addChild(groupSelector);
};

GroupPanelComponent.prototype.removeGroup = function(groupId)
{
  this.removeChild(this.selectors[groupId]);
  delete this.selectors[groupId];
};

GroupPanelComponent.prototype.update = function()
{
  // Update text
  this.totalAdventurersRight.setText(adventurerManager.getNumAdventurers().toString());
  this.totalAdventurersRight.position.x = this.width - (28 + this.totalAdventurersRight.textWidth);
  this.totalWorkersRight.setText(adventurerManager.getNumWorkers().toString());
  this.totalWorkersRight.position.x = this.width - (28 + this.totalWorkersRight.textWidth);
  
  // Update selectors
  _.each(this.selectors, function(selector) { selector.update(); });
};