var GroupManagementScreen = function()
{
  var root = this;
  
  this.type = ScreenType.GroupManagement;
  this.inputEnabled = true;
  this.z = 50;
  this.groupSystem = game.systemManager.getSystem(SystemType.Group);
  this.worldSystem = game.systemManager.getSystem(SystemType.World);
  this.confirmationScreen = game.screenManager.screens[ScreenType.Confirmation];
  this.selectedGroupRow = null;
  
  this.container = new PIXI.DisplayObjectContainer();
  this.container.z = this.z;
  
  this.background = PIXI.Sprite.fromImage(game.assetManager.paths.ui.black);
  this.background.position.x = -16;
  this.background.position.y = -16;
  this.background.z = 0;
  this.background.width = game.containerWidth + 32;
  this.background.height = game.containerHeight + 32;
  this.background.alpha = 0.8;
  this.container.addChild(this.background);
  
  this.panel = new PanelComponent({
    x: 16,
    y: 40,
    z: 1,
    width: game.containerWidth - 32,
    height: game.containerHeight - (40 + 16)
  });
  this.container.addChild(this.panel);
  
  this.title = new PIXI.BitmapText("Group Management", {font: "20px big_pixelmix", tint: 0xFFFF00});
  this.title.position.x = 32;
  this.title.position.y = 12;
  this.title.z = 1;
  this.container.addChild(this.title);
  
  this.doneButton = new ButtonComponent(
    this,
    {
      x: this.panel.width - 178,
      y: this.panel.height - 54,
      text: "Done",
      normalTexture: PIXI.Texture.fromImage(game.assetManager.paths.ui.standardButtons[0]),
      hoverTexture: PIXI.Texture.fromImage(game.assetManager.paths.ui.standardButtons[1]),
      onClick: function(e)
      {
        game.screenManager.removeScreen(ScreenType.GroupManagement);
        game.screenManager.screens[ScreenType.WorldMap].inputEnabled = true;
      }
    });
  this.panel.addChild(this.doneButton);
  
  this.createButton = new ButtonComponent(
    this,
    {
      x: 16,
      y: this.panel.height - 54,
      text: "Create Group",
      normalTexture: PIXI.Texture.fromImage(game.assetManager.paths.ui.standardButtons[0]),
      hoverTexture: PIXI.Texture.fromImage(game.assetManager.paths.ui.standardButtons[1]),
      onClick: function(e)
      {
        root.inputEnabled = false;
        root.confirmationScreen.openConfirmation(new ConfirmBoxComponent(
          root.confirmationScreen,
          "Name of new group",
          function(text)
          {
            root.createGroup(text);
            root.inputEnabled = true;
            root.confirmationScreen.closeConfirmation();
          },
          function()
          {
            root.inputEnabled = true;
            root.confirmationScreen.closeConfirmation();
          },
          {
            x: Math.floor(game.containerWidth * 0.5),
            y: Math.floor(game.containerHeight * 0.5),
            z: 10,
            showTextfield: true
          }));
      }
    });
  this.panel.addChild(this.createButton);
  
  this.groupRows = [];
  this.groupRowHeight = 92;
  this.groupRowsContainer = new PIXI.DisplayObjectContainer();
  this.groupRowsContainer.width = 500;
  this.groupRowsContainer.height = (Math.floor(this.panel.height / this.groupRowHeight) - 1) * this.groupRowHeight;
  this.groupRowsContainer.position.x = 16;
  this.groupRowsContainer.position.y = 16;
  
  this.groupRowsScrollbar = new ScrollbarComponent(
    this,
    {
      x: this.groupRowsContainer.width,
      y: 32,
      height: this.groupRowsContainer.height,
      scrollAmount: this.groupRowHeight
    });
  
  this.groupRowsScrollbar.attachComponent(this.groupRowsContainer, 16, 16, this.groupRowsContainer.width, this.groupRowsContainer.height);
  this.panel.addChild(this.groupRowsContainer);
  this.panel.addChild(this.groupRowsScrollbar);
  
  this.buildGroupRows();
  this.groupRowsScrollbar.setTargetScrollY(this.groupRowsContainer.maxScrollY);
  
  this.buildBarracksPanel();
  
  this.container.children.sort(depthCompare);
};

GroupManagementScreen.prototype.getGroupRowComponent = function(groupId)
{
  for (var i = 0; i < this.groupRows.length; i++)
  {
    if (this.groupRows[i].groupId == groupId)
    {
      return this.groupRows[i];
    }
  }
  return null;
};

GroupManagementScreen.prototype.onAddScreen = function()
{
  game.stage.addChild(this.container);
  game.stage.children.sort(depthCompare);
};

GroupManagementScreen.prototype.onRemoveScreen = function()
{
  game.stage.removeChild(this.container);
};

GroupManagementScreen.prototype.rebuildGroupRows = function()
{
  var currentTargetScrollY = this.groupRowsContainer.targetScrollY;
  
  this.clearGroupRows();
  this.buildGroupRows();
  
  this.groupRowsScrollbar.setTargetScrollY(currentTargetScrollY);
};

GroupManagementScreen.prototype.clearGroupRows = function()
{
  for (var i = 0; i < this.groupRows.length; i++)
  {
    this.groupRowsContainer.removeChild(this.groupRows[i]);
  }
  
  this.groupRows.length = 0;
};

GroupManagementScreen.prototype.buildGroupRows = function()
{
  var totalContentHeight = 0;
  
  _.each(this.groupSystem.getPlayerControlledGroups(), function(group)
    {
      var groupRow = new GroupRowComponent(
        this,
        group.id,
        {
          x: 0,
          y: this.groupRows.length * this.groupRowHeight,
          width: this.groupRowsContainer.width,
          height: this.groupRowHeight,
          scrollbar: this.groupRowsScrollbar
        });
      this.groupRows.push(groupRow);
      this.groupRowsContainer.addChild(groupRow);
    },
    this);
  
  totalContentHeight = this.groupRows.length * this.groupRowHeight;
  
  this.groupRowsContainer.minScrollY = totalContentHeight < this.groupRowsContainer.height ? 16 : -totalContentHeight + this.groupRowsContainer.height + 16;
  this.groupRowsContainer.maxScrollY = 16;
};

GroupManagementScreen.prototype.buildBarracksPanel = function()
{
  var x = this.groupRowsContainer.width + 16;
  
  this.barracksTitle = new PIXI.BitmapText("Barracks", {font: "20px big_pixelmix", tint: 0xFFFF00});
  this.barracksTitle.position.x = x + 2;
  this.barracksTitle.position.y = 16;
  this.panel.addChild(this.barracksTitle);
  
  this.barracksPanel = new BarracksPanelComponent(
    this,
    {
      x: x,
      y: 48,
      width: this.panel.width - (x + 16),
      height: 206
    });
  this.panel.addChild(this.barracksPanel);
};

GroupManagementScreen.prototype.deselectGroupRow = function()
{
  if (this.selectedGroupRow != null)
  {
    this.selectedGroupRow.setSelect(false);
  }
};

GroupManagementScreen.prototype.selectGroupRow = function(groupRow)
{
  this.selectedGroupRow = groupRow;
  this.selectedGroupRow.setSelect(true);
};

GroupManagementScreen.prototype.createGroup = function(text)
{
  var worldScreen = game.screenManager.screens[ScreenType.WorldMap];
  var group = this.groupSystem.createGroup({
    name: text.length == 0 ? "New Group" : text,
    playerControlled: true,
    featureId: this.worldSystem.world.playerCastleFeatureId
  });
  
  worldScreen.groupMenu.addGroup(group.id);
  this.rebuildGroupRows();
};

GroupManagementScreen.prototype.disbandGroup = function(groupId)
{
  this.groupSystem.disbandGroup(groupId);
  this.barracksPanel.rebuildPortraits();
  this.rebuildGroupRows();
};

GroupManagementScreen.prototype.moveCharacterToBarracks = function(groupId, characterId)
{
  var groupRow = this.getGroupRowComponent(groupId);
  
  this.groupSystem.removeCharacterFromGroup(groupId, characterId);
  this.groupSystem.addCharacterToGroup(this.groupSystem.barracksGroup.id, characterId);
  this.barracksPanel.rebuildPortraits();
  groupRow.rebuildPortraits();
  groupRow.rebuildStatText();
};

GroupManagementScreen.prototype.moveCharacterToGroup = function(groupId, characterId)
{
  var groupRow = this.getGroupRowComponent(groupId);
  
  this.groupSystem.removeCharacterFromGroup(this.groupSystem.barracksGroup.id, characterId);
  this.groupSystem.addCharacterToGroup(groupId, characterId);
  this.barracksPanel.rebuildPortraits();
  groupRow.rebuildPortraits();
  groupRow.rebuildStatText();
};

GroupManagementScreen.prototype.update = function()
{
  this.groupRowsScrollbar.update();
  this.barracksPanel.update();
  
  _.each(this.groupRows, function(groupRow)
    {
      groupRow.update();
    });
};