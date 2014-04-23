var BarracksPanelComponent = function(screen, options)
{
  options = options || {};
  options.x = options.x || 0;
  options.y = options.y || 0;
  options.width = options.width || 400;
  options.height = options.height || 200;
  
  this.base = PIXI.DisplayObjectContainer;
  this.base();
  this.screen = screen;
  this.groupSystem = game.systemManager.getSystem(SystemType.Group);
  this.barracksGroup = this.groupSystem.barracksGroup;
  this.portraits = [];
  this.scrollAmount = 58;
  
  this.panel = new PanelComponent({
    x: options.x,
    y: options.y,
    width: options.width,
    height: options.height,
    type: PanelType.Dark
  });
  this.addChild(this.panel);
  
  this.portraitContainer = new PIXI.DisplayObjectContainer();
  this.panel.addChild(this.portraitContainer);
  
  this.scrollbar = new ScrollbarComponent(
    this.screen,
    {
      x: this.panel.width - 16,
      y: 16,
      height: this.panel.height - 32,
      scrollAmount: this.scrollAmount,
      maskX: 0,
      maskY: 16,
      maskWidth: this.panel.width - 32,
      maskHeight: this.panel.height - 32,
      component: this.portraitContainer
    });
  this.panel.addChild(this.scrollbar);
  
  this.buildCharacterIcons();
};

BarracksPanelComponent.prototype = new PIXI.DisplayObjectContainer;

BarracksPanelComponent.prototype.rebuildPortraits = function()
{
  var currentScrollY = this.portraitContainer.targetScrollY;
  
  this.clearCharacterIcons();
  this.buildCharacterIcons();
  this.scrollbar.setTargetScrollY(currentScrollY);
};

BarracksPanelComponent.prototype.clearCharacterIcons = function()
{
  for (var i = 0; i < this.portraits.length; i++)
  {
    this.portraitContainer.removeChild(this.portraits[i]);
  }
  this.portraits.length = 0;
};

BarracksPanelComponent.prototype.buildCharacterIcons = function()
{
  var root = this;
  var spacingX = 40;
  var spacingY = 58;
  var containerWidth = this.panel.width - 32;
  var containerHeight = this.panel.height - 32;
  var numRowX = Math.floor(containerWidth / spacingX);
  var totalContentHeight = 0;
  
  for (var i = 0; i < this.barracksGroup.characterIds.length; i++)
  {
    var x = 16 + Math.floor(i % numRowX) * spacingX;
    var y = 16 + Math.floor(i / numRowX) * spacingY;
    var portrait = new PortraitComponent(
      this.barracksGroup.characterIds[i],
      {
        x: x,
        y: y,
        onClick: function(e)
        {
          if (this.enabled)
          {
            if (root.screen.selectedGroupRow != null)
            {
              var group = root.groupSystem.getGroup(root.screen.selectedGroupRow.groupId);
              
              console.log(group.capacity);
              if (group.characterIds.length < group.capacity)
              {
                root.screen.moveCharacterToGroup(group.id, this.characterId);
              }
            }
          }
        }
      });
        
    this.portraitContainer.addChild(portrait);
    this.portraits.push(portrait);
  }
  
  totalContentHeight = Math.ceil(this.barracksGroup.characterIds.length / numRowX) * spacingY;
  
  this.portraitContainer.minScrollY = totalContentHeight < containerHeight ? 0 : -totalContentHeight + containerHeight;
  this.portraitContainer.maxScrollY = 0;
};

BarracksPanelComponent.prototype.update = function()
{
  this.scrollbar.update();
  
  for (var i = 0; i < this.portraits.length; i++)
  {
    this.portraits[i].update();
  }
};