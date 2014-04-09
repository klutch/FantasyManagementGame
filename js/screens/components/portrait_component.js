var PortraitComponent = function(characterId, options)
{
  options = options || {};
  options.x = options.x || 0;
  options.y = options.y || 0;
  
  this.base = PIXI.DisplayObjectContainer;
  this.base();
  this.characterId = characterId;
  this.character = characterManager.characters[characterId];
  this.position.x = options.x;
  this.position.y = options.y;
  this.portraitSprite = PIXI.Sprite.fromImage(assetPathManager.assetPaths.ui.portraits[this.character.type]);
  this.interactive = true;
  this.buttonMode = true;
  this.onClick = options.onClick;
  this.addChild(this.portraitSprite);
};

PortraitComponent.prototype = new PIXI.DisplayObjectContainer;

PortraitComponent.prototype.click = function(interactionData)
{
  if (this.onClick != null)
  {
    this.onClick(interactionData);
  }
};