var WorldGroupsComponent = function(options)
{
  this.base = PIXI.DisplayObjectContainer;
  this.base();
  this.z = options.z;
  this.groupSprites = [];
};

WorldGroupsComponent.prototype = new PIXI.DisplayObjectContainer;

WorldGroupsComponent.prototype.showGroup = function(groupId)
{
  var sprite = PIXI.Sprite.fromImage(assetPathManager.assetPaths.ui.partyIcons);
  var tile = groupManager.getGroupTile(groupId);
  
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
  for (var key in this.groupSprites)
  {
    if (this.groupSprites.hasOwnProperty(key))
    {
      var sprite = this.groupSprites[key];
      var group = groupManager.getGroup(key);
      
      sprite.position.x += (group.tileI * TILE_SIZE - sprite.position.x) / 8;
      sprite.position.y += (group.tileJ * TILE_SIZE - sprite.position.y) / 8;
    }
  }
};