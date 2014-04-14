var GameEventFactory = {};

GameEventFactory.createWalkEvent = function(groupId, startNode, endNode)
{
  var groupSystem = game.systemManager.getSystem(SystemType.Group);
  var worldMap = game.screenManager.screens[ScreenType.WorldMap].worldMap;
  var walkSpeed = 4;  // in pixels
  
  return new GameEventNode({
    group: groupSystem.getGroup(groupId),
    sprite: game.screenManager.screens[ScreenType.WorldMap].worldGroups.getSprite(groupId),
    currentPathNode: startNode,
    isAtDestination: false,
    doWork: function()
    {
      var relativeX = this.currentPathNode.i * TILE_SIZE - this.sprite.position.x;
      var relativeY = this.currentPathNode.j * TILE_SIZE - this.sprite.position.y;
      var length = Math.sqrt(relativeX * relativeX + relativeY * relativeY);
      
      if (length < walkSpeed)
      {
        if (this.currentPathNode == endNode)
        {
          this.isAtDestination = true;
        }
        else
        {
          this.currentPathNode = this.currentPathNode.next;
        }
      }
      else
      {
        var normalX = relativeX / length;
        var normalY = relativeY / length;
        
        this.sprite.position.x += normalX * walkSpeed;
        this.sprite.position.y += normalY * walkSpeed;
        worldMap.camera.targetPosition.x = this.sprite.position.x;
        worldMap.camera.targetPosition.y = this.sprite.position.y;
      }
    },
    isComplete: function()
    {
      return this.isAtDestination;
    },
    onComplete: function()
    {
      this.sprite.position.x = endNode.i * TILE_SIZE;
      this.sprite.position.y = endNode.j * TILE_SIZE;
      worldMap.camera.targetPosition.x = this.sprite.position.x;
      worldMap.camera.targetPosition.y = this.sprite.position.y;
    }
  });
};