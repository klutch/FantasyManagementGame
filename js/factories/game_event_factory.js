var GameEventFactory = {};

GameEventFactory.createWalkEvent = function(groupId, startNode, endNode)
{
  var groupSystem = game.systemManager.getSystem(SystemType.Group);
  var worldMap = game.screenManager.screens[ScreenType.WorldMap].worldMap;
  var walkSpeed = 3;  // in pixels
  
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
      
      if (length < walkSpeed + 0.1)
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

GameEventFactory.createEnterFeatureEvent = function(groupId, featureId)
{
  return new GameEventNode({
    initialize: function()
    {
      game.systemManager.getSystem(SystemType.Group).moveGroupIntoFeature(groupId, featureId);
    },
    isComplete: function()
    {
      return true;
    }
  });
};

GameEventFactory.createDwellingVisitEvent = function(groupId, featureId)
{
  return new GameEventNode({
    isOpen: true,
    initialize: function()
    {
      var notificationScreen = game.screenManager.screens[ScreenType.Notification];
      
      this.dwellingVisitComponent = new DwellingVisitComponent(notificationScreen, this, featureId);
      
      notificationScreen.showBackground();
      notificationScreen.container.addChild(this.dwellingVisitComponent);
    },
    isComplete: function()
    {
      return !this.isOpen;
    },
    onComplete: function()
    {
      var notificationScreen = game.screenManager.screens[ScreenType.Notification];
      
      notificationScreen.hideBackground();
      notificationScreen.container.removeChild(this.dwellingVisitComponent);
    }
  });
};

GameEventFactory.createGatheringVisitEvent = function(groupId, featureId)
{
  var shopScreen = game.screenManager.screens[ScreenType.Shop];
  var worldMapScreen = game.screenManager.screens[ScreenType.WorldMap];
  
  return new GameEventNode({
    initialize: function()
    {
      worldMapScreen.inputEnabled = false;
      shopScreen.openHirePanel(featureId);
    },
    isComplete: function()
    {
      return shopScreen.hirePanel == null;
    },
    onComplete: function()
    {
      worldMapScreen.inputEnabled = true;
    }
  });
};