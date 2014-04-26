var CharacterPanelComponent = function(screen, options)
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
  this.characterSystem = game.systemManager.getSystem(SystemType.Character);
  this.initialized = false;
  this.contentHeight = 0;
  
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
};

CharacterPanelComponent.prototype = new PIXI.DisplayObjectContainer;

CharacterPanelComponent.prototype.selectCharacter = function(characterId)
{
  this.characterId = characterId;
  this.rebuild();
};

CharacterPanelComponent.prototype.rebuild = function()
{
  this.clear();
  this.build();
};

CharacterPanelComponent.prototype.clear = function()
{
  if (!this.initialized)
  {
    return;
  }
  
  this.container.removeChild(this.title);
  this.container.removeChild(this.titleDivider);
  this.container.removeChild(this.offenseText);
  this.container.removeChild(this.defenseText);
  this.container.removeChild(this.supportText);
  this.container.removeChild(this.movementText);
  this.contentHeight = 0;
};

CharacterPanelComponent.prototype.build = function()
{
  var character = this.characterSystem.getCharacter(this.characterId);
  var statTextStyle = {font: "12px big_pixelmix", tint: 0xCCCCCC};
  var statTextSpacing = 4;
  
  this.title = new PIXI.BitmapText(character.name, {font: "20px big_pixelmix", tint: 0xFFFF00});
  this.title.position.x = 2;
  this.container.addChild(this.title);
  this.contentHeight = this.title.textHeight + 8;
  
  this.titleDivider = new PIXI.TilingSprite(PIXI.Texture.fromImage(game.assetManager.paths.ui.longDivider), this.panel.width - 32, 4);
  this.titleDivider.position.y = this.contentHeight;
  this.container.addChild(this.titleDivider);
  this.contentHeight = this.titleDivider.position.y + this.titleDivider.height + 8;
  
  this.offenseText = new PIXI.BitmapText("Offense: " + this.characterSystem.getCharacterOffense(this.characterId), statTextStyle);
  this.offenseText.position.y = this.contentHeight;
  this.container.addChild(this.offenseText);
  this.contentHeight = this.offenseText.position.y + this.offenseText.textHeight + statTextSpacing;
  
  this.defenseText = new PIXI.BitmapText("Defense: " + this.characterSystem.getCharacterDefense(this.characterId), statTextStyle);
  this.defenseText.position.y = this.contentHeight;
  this.container.addChild(this.defenseText);
  this.contentHeight = this.defenseText.position.y + this.defenseText.textHeight + statTextSpacing;
  
  this.supportText = new PIXI.BitmapText("Support: " + this.characterSystem.getCharacterSupport(this.characterId), statTextStyle);
  this.supportText.position.y = this.contentHeight;
  this.container.addChild(this.supportText);
  this.contentHeight = this.supportText.position.y + this.supportText.textHeight + statTextSpacing;
  
  this.movementText = new PIXI.BitmapText("Movement Ability: " + this.characterSystem.getCharacterMovementAbility(this.characterId), statTextStyle);
  this.movementText.position.y = this.contentHeight;
  this.container.addChild(this.movementText);
  this.contentHeight = this.movementText.position.y + this.movementText.textHeight + statTextSpacing;
  
  this.initialized = true;
};

CharacterPanelComponent.prototype.update = function()
{
};