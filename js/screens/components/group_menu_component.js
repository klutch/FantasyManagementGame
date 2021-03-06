var GroupMenuComponent = function(screen, options)
{
  options = options || {};
  
  var middleX = Math.floor(options.width * 0.5) - 8;
  
  this.base = PIXI.DisplayObjectContainer;
  this.base();
  this.screen = screen;
  this.width = options.width;
  this.selectors = {};
  this.groupSystem = game.systemManager.getSystem(SystemType.Group);
  this.z = options.z;
  delete options.z;
  
  // Create background panel
  this.panel = new PanelComponent(options);
  this.addChild(this.panel);
  
  // Create manage groups button
  this.manageGroupsButton = new ButtonComponent(
    screen,
    {
      x: middleX,
      y: 132,
      centerX: true,
      centerY: true,
      normalTexture: PIXI.Texture.fromImage(game.assetManager.paths.ui.standardButtons[0]),
      hoverTexture: PIXI.Texture.fromImage(game.assetManager.paths.ui.standardButtons[1]),
      text: "Manage Groups",
      onClick: function(e)
      {
        game.screenManager.addScreen(new GroupManagementScreen());
        screen.inputEnabled = false;
      }
    });
  this.addChild(this.manageGroupsButton);
  
  // Create dividers
  this.dividers = [];
  this.dividers[0] = PIXI.Sprite.fromImage(game.assetManager.paths.ui.divider);
  this.dividers[0].anchor.x = 0.5;
  this.dividers[0].position.x = middleX;
  this.dividers[0].position.y = this.manageGroupsButton.position.y - 32;
  this.addChild(this.dividers[0]);
  
  this.dividers[1] = PIXI.Sprite.fromImage(game.assetManager.paths.ui.divider);
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

GroupMenuComponent.prototype = new PIXI.DisplayObjectContainer;

GroupMenuComponent.prototype.addGroup = function(groupId)
{
  var groupSelector = new GroupSelectorComponent(this.screen, this, groupId);
  
  this.selectors[groupId] = groupSelector;
  this.addChild(groupSelector);
};

GroupMenuComponent.prototype.removeGroup = function(groupId)
{
  this.removeChild(this.selectors[groupId]);
  delete this.selectors[groupId];
};

GroupMenuComponent.prototype.update = function()
{
  this.manageGroupsButton.update();
  
  // Update text
  this.totalAdventurersRight.setText(this.groupSystem.getNumPlayerAdventurers().toString());
  this.totalAdventurersRight.position.x = this.width - (28 + this.totalAdventurersRight.textWidth);
  this.totalWorkersRight.setText(this.groupSystem.getNumPlayerWorkers().toString());
  this.totalWorkersRight.position.x = this.width - (28 + this.totalWorkersRight.textWidth);
  
  // Update selectors
  _.each(this.selectors, function(selector) { selector.update(); });
};