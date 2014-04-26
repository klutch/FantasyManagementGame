var GroupRowComponent = function(screen, groupId, options)
{
  var root = this;
  
  options = options || {};
  options.x = options.x || 0;
  options.y = options.y || 0;
  options.width = options.width || 100;
  options.height = options.height || 90;
  
  this.base = PIXI.DisplayObjectContainer;
  this.base();
  this.screen = screen;
  this.groupId = groupId;
  this.groupSystem = game.systemManager.getSystem(SystemType.Group);
  this.characterSystem = game.systemManager.getSystem(SystemType.Character);
  this.worldSystem = game.systemManager.getSystem(SystemType.World);
  this.confirmationScreen = game.screenManager.screens[ScreenType.Confirmation];
  this.group = this.groupSystem.getGroup(groupId);
  this.width = options.width;
  this.height = options.height;
  this.enabled = true;
  this.selected = false;
  this.scrollbar = options.scrollbar;
  this.enabledTextStyle = {font: "14px big_pixelmix", tint: 0xFFFFFF};
  this.disabledTextStyle = {font: "14px big_pixelmix", tint: 0x999999};
  this.rectangle = new PIXI.Rectangle(0, 0, this.width, this.height);
  
  this.position.x = options.x;
  this.position.y = options.y;
  
  this.title = new PIXI.BitmapText(this.group.name, this.enabledTextStyle);
  this.title.position.x = 2;
  this.title.position.y = 0;
  this.title.z = 1;
  this.addChild(this.title);
  
  this.statText = new PIXI.BitmapText("...", {font: "12px big_pixelmix", tint: 0x999999});
  this.statText.position.y = 2;
  this.statText.z = 1;
  this.addChild(this.statText);
  this.rebuildStatText();
  
  this.portraits = [];
  this.buildPortraits();
  
  this.divider = new PIXI.TilingSprite(PIXI.Texture.fromImage(game.assetManager.paths.ui.longDivider), options.width - 32, 4);
  this.divider.position.y = options.height - 10;
  this.divider.z = 1;
  this.addChild(this.divider);
  
  this.selectionSprite = PIXI.Sprite.fromImage(game.assetManager.paths.tiles.white);
  this.selectionSprite.tint = 0xFFFF00;
  this.selectionSprite.position.y = -6;
  this.selectionSprite.width = options.width - 32;
  this.selectionSprite.height = options.height;
  this.selectionSprite.alpha = 0.25;
  this.selectionSprite.z = -1;
  
  this.disable();
};

GroupRowComponent.prototype = new PIXI.DisplayObjectContainer;

GroupRowComponent.prototype.openDisbandConfirmBox = function()
{
  var root = this;
  
  this.screen.inputEnabled = false;
  this.confirmationScreen.openConfirmation(new ConfirmBoxComponent(
    this.confirmationScreen,
    "Are you sure you want to disband\nthis group?",
    function()
    {
      root.screen.disbandGroup(root.groupId);
      root.confirmationScreen.closeConfirmation();
      root.screen.inputEnabled = true;
    },
    function()
    {
      root.confirmationScreen.closeConfirmation();
      root.screen.inputEnabled = true;
    },
    {
      x: Math.floor(game.containerWidth * 0.5),
      y: Math.floor(game.containerHeight * 0.5),
      z: 10
    }));
};

GroupRowComponent.prototype.openRenameConfirmBox = function()
{
  var root = this;
  
  this.screen.inputEnabled = false;
  this.confirmationScreen.openConfirmation(new ConfirmBoxComponent(
    this.confirmationScreen,
    "Rename group:",
    function(text)
    {
      root.group.name = text;
      root.title.setText(text);
      root.confirmationScreen.closeConfirmation();
      root.screen.inputEnabled = true;
    },
    function()
    {
      root.confirmationScreen.closeConfirmation();
      root.screen.inputEnabled = true;
    },
    {
      x: Math.floor(game.containerWidth * 0.5),
      y: Math.floor(game.containerHeight * 0.5),
      z: 10,
      showTextfield: true,
      defaultTextfieldValue: root.group.name
    }));
};

GroupRowComponent.prototype.rebuildPortraits = function()
{
  this.clearPortraits();
  this.buildPortraits();
};

GroupRowComponent.prototype.clearPortraits = function()
{
  for (var i = 0; i < this.portraits.length; i++)
  {
    this.removeChild(this.portraits[i]);
  }
  
  this.portraits.length = 0;
};

GroupRowComponent.prototype.buildPortraits = function()
{
  var root = this;
  
  for (var i = 0; i < this.group.characterIds.length; i++)
  {
    var portrait = new PortraitComponent(
      this.group.characterIds[i],
      {
        x: this.portraits.length * 40,
        y: 18,
        z: 1,
        normalTint: 0xFFFFFF,
        disabledTint: 0x999999,
        onClick: function(e) 
        {
          /*
          if (this.enabled)
          {
            root.screen.moveCharacterToBarracks(root.groupId, this.characterId);
          }*/
        }
      });
    this.portraits.push(portrait);
    this.addChild(portrait);
  }
};

GroupRowComponent.prototype.rebuildStatText = function()
{
  var offense = this.groupSystem.getGroupOffense(this.groupId).toString();
  var defense = this.groupSystem.getGroupDefense(this.groupId).toString();
  var support = this.groupSystem.getGroupSupport(this.groupId).toString();
  
  this.statText.setText("( " + offense + " / " + defense + " / " + support + " )");
  this.statText.updateText();
  this.statText.position.x = this.width - (this.statText.textWidth + 32);
};

GroupRowComponent.prototype.determineEnabledStatus = function()
{
  var top = this.scrollbar.worldTransform.ty + this.scrollbar.maskY - this.height * 0.5;
  var bottom = top + this.scrollbar.maskHeight;
  var isInCastle = this.group.featureId == this.worldSystem.world.playerCastleFeatureId;
  
  if (!isInCastle && this.enabled)
  {
    this.disable();
  }
  
  if (this.worldTransform.ty < top && this.enabled)
  {
    this.disable();
  }
  else if (this.worldTransform.ty > bottom && this.enabled)
  {
    this.disable();
  }
  else if (this.worldTransform.ty < bottom && this.worldTransform.ty > top && !this.enabled && isInCastle)
  {
    this.enable();
  }
};

GroupRowComponent.prototype.determineSelectionStatus = function()
{
  if (this.screen.inputEnabled && this.enabled)
  {
    var isMouseInRect;
    var click = game.inputManager.singleLeftButton();

    this.rectangle.x = this.worldTransform.tx;
    this.rectangle.y = this.worldTransform.ty;

    isMouseInRect = this.rectangle.contains(game.inputManager.mousePosition.x, game.inputManager.mousePosition.y)

    if (isMouseInRect && click && !this.selected)
    {
      this.screen.selectGroupRow(this.groupId);
    }
  }
};

GroupRowComponent.prototype.setSelect = function(value)
{
  if (value)
  {
    this.addChild(this.selectionSprite);
  }
  else
  {
    this.removeChild(this.selectionSprite);
  }
  this.children.sort(depthCompare);
};

GroupRowComponent.prototype.disable = function()
{
  this.enabled = false;
  this.title.setStyle(this.disabledTextStyle);
  for (var i = 0; i < this.portraits.length; i++)
  {
    this.portraits[i].setEnabled(false);
  }
  //this.renameButton.setEnabled(false);
  //this.disbandButton.setEnabled(false);
};

GroupRowComponent.prototype.enable = function()
{
  this.enabled = true;
  this.title.setStyle(this.enabledTextStyle);
  for (var i = 0; i < this.portraits.length; i++)
  {
    this.portraits[i].setEnabled(true);
  }
  //this.renameButton.setEnabled(true);
  //this.disbandButton.setEnabled(true);
};

GroupRowComponent.prototype.update = function()
{
  for (var i = 0; i < this.portraits.length; i++)
  {
    this.portraits[i].update();
  }
  
  //this.renameButton.update();
  //this.disbandButton.update();
  
  this.determineSelectionStatus();
  this.determineEnabledStatus();
};