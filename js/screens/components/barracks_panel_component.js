var BarracksPanelComponent = function(screen, options)
{
  options = options || {};
  options.x = options.x || 0;
  options.y = options.y || 0;
  options.width = options.width || 400;
  options.height = options.height || 200;
  
  this.base = PIXI.DisplayObjectContainer;
  this.base();
  this.groupSystem = game.systemManager.getSystem(SystemType.Group);
  this.barracksGroup = this.groupSystem.barracksGroup;
  this.portraits = [];
  this.emptyPortraits = [];
  
  this.panel = new PanelComponent({
    x: options.x,
    y: options.y,
    width: options.width,
    height: options.height,
    type: PanelType.Dark
  });
  this.addChild(this.panel);
  
  this.buildCharacterIcons();
};

BarracksPanelComponent.prototype = new PIXI.DisplayObjectContainer;

BarracksPanelComponent.prototype.buildCharacterIcons = function()
{
  var characterCount = 0;
  var spacingX = 40;
  var spacingY = 58;
  var numRowX = Math.floor((this.panel.width - 32) / spacingX);
  var numRowY = Math.floor((this.panel.height - 32) / spacingY);
  
  for (var j = 0; j < numRowY; j++)
  {
    for (var i = 0; i < numRowX; i++)
    {
      var x = 16 + i * spacingX;
      var y = 16 + j * spacingY;
      
      if (characterCount < this.barracksGroup.characterIds.length)
      {
        var portrait = new PortraitComponent(this.barracksGroup.characterIds[characterCount], {x: x, y: y});
        
        this.panel.addChild(portrait);
        this.portraits.push(portrait);
      }
      else
      {
        var sprite = PIXI.Sprite.fromImage(game.assetManager.paths.ui.portraits.empty);
        
        sprite.position.x = x;
        sprite.position.y = y;
        
        this.panel.addChild(sprite);
        this.emptyPortraits.push(sprite);
      }
      
      characterCount++;
    }
  }
};