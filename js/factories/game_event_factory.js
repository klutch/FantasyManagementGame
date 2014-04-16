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

GameEventFactory.createRaidEvent = function(groupId, featureId)
{
  return new GameEventNode({
    initialize: function()
    {
      var notificationScreen = game.screenManager.screens[ScreenType.Notification];
      var worldMap = game.screenManager.screens[ScreenType.WorldMap].worldMap;
      var group = game.systemManager.getSystem(SystemType.Group).getGroup(groupId);
      var feature = game.systemManager.getSystem(SystemType.World).getFeature(group.featureId);
      var raidSystem = game.systemManager.getSystem(SystemType.Raid);
      
      this.messageBox = new MessageBoxComponent(
        notificationScreen,
        {
          message: group.name + " has entered the\ndungeon."
        });
      
      notificationScreen.showBackground();
      notificationScreen.container.addChild(this.messageBox);
      
      worldMap.camera.targetPosition.x = (feature.tileI + feature.width * 0.5) * TILE_SIZE;
      worldMap.camera.targetPosition.y = (feature.tileJ + feature.height * 0.5) * TILE_SIZE;
      
      raidSystem.createRaid(groupId, featureId);
    },
    isComplete: function()
    {
      return !this.messageBox.isOpen;
    },
    onComplete: function()
    {
      var notificationScreen = game.screenManager.screens[ScreenType.Notification];
      
      notificationScreen.hideBackground();
      notificationScreen.container.removeChild(this.messageBox);
    }
  });
};

GameEventFactory.createRaidVictoryEvent = function(groupId, featureId)
{
  var worldSystem = game.systemManager.getSystem(SystemType.World);
  var groupSystem = game.systemManager.getSystem(SystemType.Group);
  var orderSystem = game.systemManager.getSystem(SystemType.Order);
  var group = groupSystem.getGroup(groupId);
  var feature = game.systemManager.getSystem(SystemType.World).getFeature(featureId);
  var enemyGroup = groupSystem.getGroup(feature.enemyGroupId);
  
  return new GameEventNode({
    initialize: function()
    {
      var notificationScreen = game.screenManager.screens[ScreenType.Notification];
      var returnPath = game.pathfinderManager.findPath(
          group.tileI,
          group.tileJ,
          worldSystem.world.playerCastleI,
          worldSystem.world.playerCastleJ);
      
      this.messageBox = new MessageBoxComponent(
        notificationScreen,
        {
          message: group.name + " has defeated\n" + enemyGroup.name + "!",
          tint: SUCCESS_COLOR
        });
      
      notificationScreen.showBackground();
      notificationScreen.container.addChild(this.messageBox);
      
      if (returnPath != null)
      {
        orderSystem.createReturnOrder(groupId, returnPath);
      }
      
      // TODO: Remove enemy group from feature
      // TODO: Reward player group
    },
    isComplete: function()
    {
      return !this.messageBox.isOpen;
    },
    onComplete: function()
    {
      var notificationScreen = game.screenManager.screens[ScreenType.Notification];
      
      notificationScreen.hideBackground();
      notificationScreen.container.removeChild(this.messageBox);
    }
  });
};

GameEventFactory.createRaidDefeatEvent = function(groupId, featureId)
{
  var groupSystem = game.systemManager.getSystem(SystemType.Group);
  var group = groupSystem.getGroup(groupId);
  var feature = game.systemManager.getSystem(SystemType.World).getFeature(featureId);
  var enemyGroup = groupSystem.getGroup(feature.enemyGroupId);
  
  return new GameEventNode({
    initialize: function()
    {
      var notificationScreen = game.screenManager.screens[ScreenType.Notification];
      
      this.messageBox = new MessageBoxComponent(
        notificationScreen,
        {
          message: enemyGroup.name + " has defeated\n" + group.name + "!",
          tint: FAILURE_COLOR
        });
      
      notificationScreen.showBackground();
      notificationScreen.container.addChild(this.messageBox);
      
      groupSystem.deleteGroup(groupId);
    },
    isComplete: function()
    {
      return !this.messageBox.isOpen;
    },
    onComplete: function()
    {
      var notificationScreen = game.screenManager.screens[ScreenType.Notification];
      
      notificationScreen.hideBackground();
      notificationScreen.container.removeChild(this.messageBox);
    }
  });
};