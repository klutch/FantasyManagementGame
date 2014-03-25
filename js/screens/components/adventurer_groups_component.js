var AdventurerGroupsComponent = function(options)
{
  this.base = PIXI.DisplayObjectContainer;
  this.base();
  this.z = options.z;
  this.groupSprites = [];
};

AdventurerGroupsComponent.prototype = new PIXI.DisplayObjectContainer;

AdventurerGroupsComponent.prototype.showGroup = function(groupId)
{
  var sprite = PIXI.Sprite.fromImage(assetPathManager.assetPaths.ui.partyIcons);
  var tile = adventurerManager.getGroupTile(groupId);
  
  sprite.position.x = tile.i * TILE_SIZE;
  sprite.position.y = tile.j * TILE_SIZE;
  this.groupSprites[groupId] = sprite;
  this.addChild(this.groupSprites[groupId]);
};

AdventurerGroupsComponent.prototype.hideGroup = function(groupId)
{
  this.removeChild(this.groupSprites[groupId]);
  delete this.groupSprites[groupId];
};

AdventurerGroupsComponent.prototype.update = function()
{
  for (var key in this.groupSprites)
  {
    if (this.groupSprites.hasOwnProperty(key))
    {
      var sprite = this.groupSprites[key];
      var group = adventurerManager.groups[key];
      
      sprite.position.x += (group.tileI * TILE_SIZE - sprite.position.x) / 8;
      sprite.position.y += (group.tileJ * TILE_SIZE - sprite.position.y) / 8;
    }
  }
};