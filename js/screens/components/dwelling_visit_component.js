var DwellingVisitComponent = function(screen, event, groupId, featureId)
{
  this.base = PIXI.DisplayObjectContainer;
  this.base();
  this.screen = screen;
  this.event = event;
  this.groupId = groupId;
  this.featureId = featureId;
  this.worldSystem = game.systemManager.getSystem(SystemType.World);
  this.resourceSystem = game.systemManager.getSystem(SystemType.Resource);
  this.loyaltySystem = game.systemManager.getSystem(SystemType.Loyalty);
  this.combatSystem = game.systemManager.getSystem(SystemType.Combat);
  this.gameEventSystem = game.systemManager.getSystem(SystemType.GameEvent);
  this.confirmationScreen = game.screenManager.screens[ScreenType.Confirmation];
  this.worldScreen = game.screenManager.screens[ScreenType.WorldMap];
  this.feature = this.worldSystem.getFeature(this.featureId);
  this.z = 1;
  this.buttons = [];
  this.confirmBox = null;
  
  // Panel
  this.panel = new PanelComponent({
    x: Math.floor(game.containerWidth * 0.5),
    y: Math.floor(game.containerHeight * 0.5),
    width: 400,
    height: 300,
    centerX: true,
    centerY: true
  });
  this.addChild(this.panel);
  
  // Text
  this.bitmapText = new PIXI.BitmapText(
    this.getGreetingText(),
    {
      font: "14px big_pixelmix",
      tint: 0xFFF500
    });
  this.bitmapText.position.x = 16;
  this.bitmapText.position.y = 16;
  this.panel.addChild(this.bitmapText);
  
  // Buttons
  this.buildButtons();
};

DwellingVisitComponent.prototype = new PIXI.DisplayObjectContainer;

DwellingVisitComponent.prototype.getGreetingText = function()
{
  if (this.feature.isLoyaltyFree)
  {
    return "A group of locals come out and give\n" +
      "you a warm welcome. They pledge their\n" +
      "loyalty to you freely.\n\n" +
      "You may now hire workers from them.";
  }
  else
  {
    if (this.feature.requiresGift)
    {
      return "You have come across a dwelling. They\n" +
        "tell you they will pledge loyalty to\n" +
        "you in exchange for a sign of good" +
        "faith.";
    }
    else
    {
      return "A group of armed men greet you as you\n" +
        "arrive. They threaten you with violence\n" +
        "and demand you leave immediately!";
    }
  }
};

DwellingVisitComponent.prototype.buildButtons = function()
{
  var root = this;
  var addLeaveButton = true;
  var subjugateButton;
  
  if (this.feature.isLoyaltyFree)
  {
    // Done button
    var doneButton = new ButtonComponent(
      this.screen,
      {
        x: 100,
        y: 180,
        normalTexture: PIXI.Texture.fromImage(game.assetManager.paths.ui.standardButtons[0]),
        hoverTexture: PIXI.Texture.fromImage(game.assetManager.paths.ui.standardButtons[1]),
        text: "Done",
        centerX: true,
        centerY: true,
        onClick: function(e) 
        {
          root.close();
        }
      });
    this.panel.addChild(doneButton);
    this.buttons.push(doneButton);
    addLeaveButton = false;
  }
  else
  {
    // Gift button
    if (this.feature.requiresGift)
    {
      var giftButton = new ButtonComponent(
        this.screen,
        {
          x: 100,
          y: 180 + this.buttons.length * 48,
          normalTexture: PIXI.Texture.fromImage(game.assetManager.paths.ui.standardButtons[0]),
          hoverTexture: PIXI.Texture.fromImage(game.assetManager.paths.ui.standardButtons[1]),
          text: "Offer Gift",
          centerX: true,
          centerY: true,
          onClick: function(e) 
          {
            root.screen.inputEnabled = false;
            root.worldScreen.inputEnabled = false;
            root.confirmBox = new ConfirmBoxComponent(
              root.confirmationScreen,
              "Give a gift of " + root.feature.giftAmountRequired + " " + root.feature.giftResourceType + "?",
              function()
              {
                // Okay (can only be called if the player has enough of the resource)
                root.resourceSystem.decreaseQuantity(root.feature.giftResourceType, root.feature.giftAmountRequired);
                root.loyaltySystem.makeLoyal(root.feature.id);
                root.confirmationScreen.closeConfirmation();
                root.screen.inputEnabled = true;
                root.worldScreen.inputEnabled = true;
                root.close();
              },
              function()
              {
                // Cancel
                root.confirmationScreen.closeConfirmation();
                root.screen.inputEnabled = true;
                root.worldScreen.inputEnabled = true;
              },
              {
                x: Math.floor(game.containerWidth * 0.5),
                y: Math.floor(game.containerHeight * 0.5),
                z: 10
              });
            root.confirmationScreen.openConfirmation(root.confirmBox);
          }
        });
      this.panel.addChild(giftButton);
      this.buttons.push(giftButton);
    }
    
    // Subjugate button
    subjugateButton = new ButtonComponent(
      this.screen,
      {
        x: 100,
        y: 180 + this.buttons.length * 48,
        normalTexture: PIXI.Texture.fromImage(game.assetManager.paths.ui.standardButtons[0]),
        hoverTexture: PIXI.Texture.fromImage(game.assetManager.paths.ui.standardButtons[1]),
        text: "Subjugate Dwelling",
        centerX: true,
        centerY: true,
        onClick: function(e) 
        {
          if (root.combatSystem.doesAttackerWin(root.groupId, root.feature.defenderGroupId))
          {
            root.gameEventSystem.insertGameEventAfter(
              root.event.getIndex(),
              GameEventFactory.createSubjugationVictoryEvent(root.groupId, root.featureId));
            root.loyaltySystem.makeLoyal(root.featureId);
          }
          else
          {
            root.gameEventSystem.insertGameEventAfter(
              root.event.getIndex(),
              GameEventFactory.createSubjugationDefeatEvent(root.groupId, root.featureId));
          }
          root.close();
        }
      });
    this.panel.addChild(subjugateButton);
    this.buttons.push(subjugateButton);
  }
  
  // Leave button
  if (addLeaveButton)
  {
    var leaveButton = new ButtonComponent(
      this.screen,
      {
        x: 100,
        y: 180 + this.buttons.length * 48,
        normalTexture: PIXI.Texture.fromImage(game.assetManager.paths.ui.standardButtons[0]),
        hoverTexture: PIXI.Texture.fromImage(game.assetManager.paths.ui.standardButtons[1]),
        text: "Leave",
        centerX: true,
        centerY: true,
        onClick: function(e) 
        {
          root.close();
        }
      });
    this.panel.addChild(leaveButton);
    this.buttons.push(leaveButton);
  }
};

DwellingVisitComponent.prototype.close = function()
{
  this.event.isOpen = false;
};

DwellingVisitComponent.prototype.update = function()
{
  // Update confirm button's okay state, based one whether or not the player has enough to give
  if (this.feature.requiresGift && this.confirmBox != null)
  {
    var availableAmount = this.resourceSystem.resourceQuantities[this.feature.giftResourceType];
    var hasEnough = availableAmount >= this.feature.giftAmountRequired;
    
    if (this.confirmBox.okayButton.enabled && !hasEnough)
    {
      this.confirmBox.okayButton.setEnabled(false);
    }
    else if (!this.confirmBox.okayButton.enabled && hasEnough)
    {
      this.confirmBox.okayButton.setEnabled(true);
    }
  }
  
  _.each(this.buttons, function(button)
    {
      button.update();
    });
};