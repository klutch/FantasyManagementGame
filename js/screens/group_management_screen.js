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
    y: 16,
    z: 1,
    width: game.containerWidth - 32,
    height: game.containerHeight - 64
  });
  this.container.addChild(this.panel);
  
  this.buildBottomButtons();
  this.buildBarracksPanel();
  this.buildGroupRowsContainer();
  this.buildGroupOverview();
  
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

GroupManagementScreen.prototype.buildBottomButtons = function()
{
  var root = this;
  var totalWidth = 0;
  
  this.buttonsContainer = new PIXI.DisplayObjectContainer();
  this.buttonsContainer.position.y = this.panel.height + 4;
  this.panel.addChild(this.buttonsContainer);
  
  this.createButton = new ResizableButtonComponent(
    this,
    {
      x: 0,
      y: 0,
      text: "Create Group",
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
  this.buttonsContainer.addChild(this.createButton);
  totalWidth += this.createButton.width + 16;
  
  this.doneButton = new ResizableButtonComponent(
    this,
    {
      x: totalWidth,
      y: 0,
      text: "Done",
      onClick: function(e)
      {
        game.screenManager.removeScreen(ScreenType.GroupManagement);
        game.screenManager.screens[ScreenType.WorldMap].inputEnabled = true;
      }
    });
  this.buttonsContainer.addChild(this.doneButton);
  totalWidth += this.doneButton.width;
  
  this.buttonsContainer.position.x = this.panel.width - totalWidth;
};

GroupManagementScreen.prototype.buildBarracksPanel = function()
{
  this.barracksPanel = new BarracksPanelComponent(
    this,
    {
      x: 16,
      y: 16,
      width: 360,
      height: this.panel.height - 32
    });
  this.panel.addChild(this.barracksPanel);
};

GroupManagementScreen.prototype.buildGroupRowsContainer = function()
{
  this.groupRows = [];
  this.groupRowHeight = 92;
  this.groupRowsContainer = new PIXI.DisplayObjectContainer();
  this.groupRowsContainer.width = 360;
  this.groupRowsContainer.height = this.panel.height - 32;
  this.groupRowsContainer.position.x = this.barracksPanel.panel.width + 32;
  this.groupRowsContainer.position.y = 16;
  
  this.groupRowsScrollbar = new ScrollbarComponent(
    this,
    {
      x: this.groupRowsContainer.x + this.groupRowsContainer.width,
      y: 32,
      height: this.panel.height - 64,
      scrollAmount: this.groupRowHeight
    });
  
  this.groupRowsScrollbar.attachComponent(this.groupRowsContainer, this.groupRowsContainer.x, 16, this.groupRowsContainer.width, this.groupRowsContainer.height);
  this.panel.addChild(this.groupRowsContainer);
  this.panel.addChild(this.groupRowsScrollbar);
  
  this.buildGroupRows();
  this.groupRowsScrollbar.setTargetScrollY(this.groupRowsContainer.maxScrollY);
};

GroupManagementScreen.prototype.buildGroupOverview = function()
{
  var x = this.groupRowsContainer.position.x + this.groupRowsContainer.width + 16;
  
  this.groupOverview = new GroupOverviewComponent(
    this,
    {
      x: x,
      y: 16,
      width: this.panel.width - (x + 16),
      height: this.panel.height - 32
    });
  this.panel.addChild(this.groupOverview);
};

GroupManagementScreen.prototype.rebuildGroupRows = function()
{
  var currentTargetScrollY = this.groupRowsContainer.targetScrollY;
  var selectedGroupId = this.selectedGroupRow == null ? -1 : this.selectedGroupRow.groupId;
  
  this.deselectGroupRow();
  this.clearGroupRows();
  this.buildGroupRows();
  
  if (selectedGroupId != -1)
  {
    this.selectGroupRow(this.getGroupRowComponent(selectedGroupId));
  }
  
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

GroupManagementScreen.prototype.selectGroupRow = function(groupRow)
{
  this.selectedGroupRow = groupRow;
  this.selectedGroupRow.setSelect(true);
};

GroupManagementScreen.prototype.deselectGroupRow = function()
{
  if (this.selectedGroupRow != null)
  {
    var groupId = this.selectedGroupRow.groupId;
    
    this.selectedGroupRow.setSelect(false);
    this.selectedGroupRow = null;
  }
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
  if (this.selectedGroupRow != null && this.selectedGroupRow.groupId == groupId)
  {
    this.deselectGroupRow();
  }
  
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
  this.createButton.update();
  this.doneButton.update();
  
  _.each(this.groupRows, function(groupRow)
    {
      groupRow.update();
    });
};