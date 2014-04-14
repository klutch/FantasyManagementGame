var WorldGroupsComponent = function(options)
{
  this.base = PIXI.DisplayObjectContainer;
  this.base();
  this.z = options.z;
  this.groupSprites = [];
  this.groupSystem = game.systemManager.getSystem(SystemType.Group);
};

WorldGroupsComponent.prototype = new PIXI.DisplayObjectContainer;

WorldGroupsComponent.prototype.getSprite = function(groupId)
{
  return this.groupSprites[groupId];
};

WorldGroupsComponent.prototype.showGroup = function(groupId)
{
  var sprite = PIXI.Sprite.fromImage(game.assetManager.paths.ui.partyIcons);
  var tile = this.groupSystem.getGroupTile(groupId);
  
  sprite.position.x = tile.i * TILE_SIZE;
  sprite.position.y = tile.j * TILE_SIZE;
  this.groupSprites[groupId] = sprite;
  this.addChild(this.groupSprites[groupId]);
};

WorldGroupsComponent.prototype.hideGroup = function(groupId)
{
  this.removeChild(this.groupSprites[groupId]);
  delete this.groupSprites[groupId];
};

WorldGroupsComponent.prototype.update = function()
{
};