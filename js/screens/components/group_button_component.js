var GroupButtonComponent = function(groupPanel, groupId)
{
  var root = this;
  
  this.base = PIXI.DisplayObjectContainer;
  this.base();
  this.groupPanel = groupPanel;
  this.group = adventurerManager.groups[groupId];
  this.position.x = 0;
  this.position.y = 200 + this.groupPanel.groupButtons.length * 32;
  
  // Create basic button
  this.button = new ButtonComponent({
    x: 0,
    y: 0,
    centerX: false,
    centerY: true,
    normalTexture: PIXI.Texture.fromImage(assetPathManager.assetPaths.ui.groupNameButtons[0]),
    hoverTexture: PIXI.Texture.fromImage(assetPathManager.assetPaths.ui.groupNameButtons[1]),
    text: "  " + this.group.name
  });
  this.button.mouseover = function(e) { root.mouseover(e); };
  this.button.mouseout = function(e) { root.mouseout(e); };
  this.addChild(this.button);
};

GroupButtonComponent.prototype = new PIXI.DisplayObjectContainer;

GroupButtonComponent.prototype.mouseover = function(interactionData)
{
  // Hover effects
  if (this.button.bitmapText != null)
  {
    this.button.bitmapText.tint = 0xFFF568;
    this.button.bitmapText.dirty = true;
  }
  if (this.button.textureSprite != null)
  {
    if (this.button.hoverTexture != null)
    {
      this.button.textureSprite.setTexture(this.button.hoverTexture);
    }
  }
  
  // Tooltips
  if (this.button.tooltipText != null)
  {
    screenManager.screens[ScreenType.Tooltip].enableTooltip(this.button.tooltipText);
  }
  
  // Show preview panel
  this.groupPanel.showPreviewPanel(this.group.id);
};

GroupButtonComponent.prototype.mouseout = function(interactionData)
{
  // Tooltips
  if (this.button.tooltipText != null)
  {
    screenManager.screens[ScreenType.Tooltip].disableTooltip();
  }
};