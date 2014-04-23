var PortraitComponent = function(characterId, options)
{
  options = options || {};
  options.x = options.x || 0;
  options.y = options.y || 0;
  options.normalTint = options.normalTint || 0xFFFFFF;
  options.disabledTint = options.disabledTint || 0x999999;
  options.enabled = options.enabled || true;
  options.onClick = options.onClick || function(e) { };
  
  this.base = PIXI.DisplayObjectContainer;
  this.base();
  this.characterSystem = game.systemManager.getSystem(SystemType.Character);
  this.characterId = characterId;
  this.character = this.characterSystem.getCharacter(characterId);
  this.position.x = options.x;
  this.position.y = options.y;
  this.z = options.z;
  this.normalTint = options.normalTint;
  this.disabledTint = options.disabledTint;
  this.onClick = options.onClick;
  this.isMouseOver = false;
  
  this.portraitSprite = PIXI.Sprite.fromImage(game.assetManager.paths.ui.portraits[this.character.type]);
  this.addChild(this.portraitSprite);
  
  this.width = this.portraitSprite.width;
  this.height = this.portraitSprite.height;
  
  this.rectangle = new PIXI.Rectangle(0, 0, this.width, this.height);
  
  this.setEnabled(options.enabled);
};

PortraitComponent.prototype = new PIXI.DisplayObjectContainer;

PortraitComponent.prototype.setEnabled = function(value)
{
  this.portraitSprite.tint = value ? this.normalTint : this.disabledTint;
  
  this.enabled = value;
};

PortraitComponent.prototype.onMouseOver = function()
{
  this.isMouseOver = true;
  document.body.style.cursor = "pointer";
};

PortraitComponent.prototype.onMouseOut = function()
{
  this.isMouseOver = false;
  document.body.style.cursor = "auto";
};

PortraitComponent.prototype.update = function()
{
  if (this.enabled)
  {
    var isMouseInRect;

    this.rectangle.x = this.worldTransform.tx;
    this.rectangle.y = this.worldTransform.ty;

    isMouseInRect = this.rectangle.contains(game.inputManager.mousePosition.x, game.inputManager.mousePosition.y);

    if (!this.isMouseOver && isMouseInRect)
    {
      this.onMouseOver();
    }
    else if (this.isMouseOver && !isMouseInRect)
    {
      this.onMouseOut();
    }

    if (isMouseInRect && game.inputManager.singleLeftButton())
    {
      game.inputManager.leftButtonHandled = true;
      this.onClick();
    }
  }
};