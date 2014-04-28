var GroupSelectorComponent = function(screen, groupMenu, groupId)
{
  this.base = PIXI.DisplayObjectContainer;
  this.base();
  this.screen = screen;
  this.groupMenu = groupMenu;
  this.groupId = groupId;
  this.characterSystem = game.systemManager.getSystem(SystemType.Character);
  this.groupSystem = game.systemManager.getSystem(SystemType.Group);
  this.group = this.groupSystem.getGroup(groupId);
  this.buttonTexture = PIXI.Texture.fromImage(game.assetManager.paths.ui.groupNameButtons[0]);
  this.buttonOverTexture = PIXI.Texture.fromImage(game.assetManager.paths.ui.groupNameButtons[1]);
  this.buttonRect = new PIXI.Rectangle(0, 200 + 38 * _.size(groupMenu.selectors), this.buttonTexture.width - 8, this.buttonTexture.height);
  this.previewRect = new PIXI.Rectangle(258, this.buttonRect.y - 64, 320, 76 + this.group.characterIds.length * 64);
  this.isPanelOpen = false;
  this.statTexts = [];
  
  // Enforce boundaries on preview rectangle
  if (this.previewRect.y + this.previewRect.height > game.containerHeight)
  {
    this.previewRect.y = game.containerHeight - this.previewRect.height;
  }
  
  // Create button
  this.buttonSprite = new PIXI.Sprite(this.buttonTexture);
  this.buttonSprite.position.x = 0;
  this.buttonSprite.position.y = this.buttonRect.y;
  this.buttonSprite.interactive = true;
  //this.buttonSprite.buttonMode = true;
  this.buttonText = new PIXI.BitmapText("  " + this.group.name, {font: "12px big_pixelmix", tint: 0xCCCCCC});
  this.buttonText.position.x = 0;
  this.buttonText.position.y = this.buttonRect.y + 12;
  this.addChild(this.buttonSprite);
  this.addChild(this.buttonText);
  
  // Build preview panel
  this.buildPreviewPanel();
};

GroupSelectorComponent.prototype = new PIXI.DisplayObjectContainer;

GroupSelectorComponent.prototype.buildPreviewPanel = function()
{
  var root = this;
  
  // Create panel
  this.previewPanel = new PanelComponent({
    x: this.previewRect.x,
    y: this.previewRect.y,
    width: this.previewRect.width,
    height: this.previewRect.height
  });
  
  // Add adventurer portraits and text
  for (var i = 0; i < this.group.characterIds.length; i++)
  {
    var character = this.characterSystem.getCharacter(this.group.characterIds[i]);
    var portrait = new PortraitComponent(character.id, {x: 16, y: 16 + 64 * i});
    var typeText = new PIXI.BitmapText(character.type, {font: "14px big_pixelmix", tint: 0xFFFF00});
    var statText = new PIXI.BitmapText("...", {font: "12px big_pixelmix", tint: 0xCCCCCC});
    var editButton;
    
    typeText.position.x = 64;
    typeText.position.y = portrait.position.y + 4;
    
    statText.position.x = 64;
    statText.position.y = portrait.position.y + 28;
    statText.characterId = character.id;
    this.statTexts.push(statText);
    
    this.previewPanel.addChild(portrait);
    this.previewPanel.addChild(typeText);
    this.previewPanel.addChild(statText);
  }
  
  // Create an edit button
  editButton = new ButtonComponent(
    this.screen,
    {
      x: 96,
      y: this.group.characterIds.length * 64 + 40,
      centerX: true,
      centerY: true,
      normalTexture: PIXI.Texture.fromImage(game.assetManager.paths.ui.standardButtons[0]),
      hoverTexture: PIXI.Texture.fromImage(game.assetManager.paths.ui.standardButtons[1]),
      text: "Edit Group",
      onClick: function(e) { }
    });
  this.previewPanel.addChild(editButton);
  
  // Group stats
  this.groupStats = new PIXI.BitmapText("...", {font: "16px big_pixelmix", tint: 0xFFFF00});
  this.groupStats.position.x = 180;
  this.groupStats.position.y = 20;
  this.previewPanel.addChild(this.groupStats);
};

GroupSelectorComponent.prototype.select = function()
{
  this.groupSystem.selectGroup(this.groupId);
};

GroupSelectorComponent.prototype.handleInput = function()
{
  var isOverButtonRect = this.buttonRect.contains(game.inputManager.mousePosition.x, game.inputManager.mousePosition.y);
  var isOverPanelRect = this.previewRect.contains(game.inputManager.mousePosition.x, game.inputManager.mousePosition.y);
  
  // Handle mouse over states
  if (!this.isPanelOpen && isOverButtonRect)
  {
    this.isPanelOpen = true;
    this.buttonSprite.setTexture(this.buttonOverTexture);
    this.buttonText.tint = 0xFFF568;
    this.buttonText.dirty = true;
    this.addChildAt(this.previewPanel, 0);
  }
  else if (this.isPanelOpen && !(isOverButtonRect || isOverPanelRect))
  {
    this.isPanelOpen = false;
    this.buttonSprite.setTexture(this.buttonTexture);
    this.buttonText.tint = 0xCCCCCC;
    this.buttonText.dirty = true;
    this.removeChild(this.previewPanel);
  }
  
  // Handle mouse clicks
  if (isOverButtonRect && game.inputManager.singleLeftButton())
  {
    game.inputManager.leftButtonHandled = true;
    this.select();
  }
}

GroupSelectorComponent.prototype.update = function()
{
  // Update stat text
  for (var i = 0; i < this.statTexts.length; i++)
  {
    var statText = this.statTexts[i];
    
    statText.setText(
      this.characterSystem.getCharacterOffense(statText.characterId).toString() + " / " +
      this.characterSystem.getCharacterDefense(statText.characterId).toString() + " / " +
      this.characterSystem.getCharacterSupport(statText.characterId).toString());
  }
  
  // Update group stat text
  this.groupStats.setText(
      this.groupSystem.getGroupOffense(this.groupId).toString() + " / " +
      this.groupSystem.getGroupDefense(this.groupId).toString() + " / " +
      this.groupSystem.getGroupSupport(this.groupId).toString());
  
  // Handle input
  if (this.screen.inputEnabled)
  {
    this.handleInput();
  }
};