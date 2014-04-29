var HireCharacterPanelComponent = function(screen, featureId, options)
{
  var root = this;
  
  options = options || {};
  
  this.base = PIXI.DisplayObjectContainer;
  this.base();
  this.screen = screen;
  this.featureId = featureId;
  this.worldSystem = game.systemManager.getSystem(SystemType.World);
  this.groupSystem = game.systemManager.getSystem(SystemType.Group);
  this.resourceSystem = game.systemManager.getSystem(SystemType.Resource);
  this.orderSystem = game.systemManager.getSystem(SystemType.Order);
  this.characterSystem = game.systemManager.getSystem(SystemType.Character);
  this.shopSystem = game.systemManager.getSystem(SystemType.Shop);
  this.feature = this.worldSystem.getFeature(featureId);
  this.group = this.groupSystem.getGroup(this.feature.hireableGroupId);
  this.z = options.z;
  this.availableButtons = [];
  this.buyerButtons = [];
  this.buyingCharacterIds = {};
  this.totalCost = 0;
  this.rebuildMenus = true;
  this.centerScreenX = Math.floor(game.containerWidth * 0.5);
  this.centerScreenY = Math.floor(game.containerHeight * 0.5);
  this.worldMapScreen = game.screenManager.screens[ScreenType.WorldMap];
  
  // Panels
  this.buildAvailablePanel();
  this.buildBuyerPanel();
  
  // Buy button
  this.buyButton = new ButtonComponent(
    this.screen,
    {
      x: this.centerScreenX + 220,
      y: this.centerScreenY + 200,
      normalTexture: PIXI.Texture.fromImage(game.assetManager.paths.ui.standardButtons[0]),
      hoverTexture: PIXI.Texture.fromImage(game.assetManager.paths.ui.standardButtons[1]),
      disabledTexture: PIXI.Texture.fromImage(game.assetManager.paths.ui.standardButtons[2]),
      text: "Buy",
      centerX: true,
      centerY: true,
      onClick: function(e)
      {
        if (this.enabled)
        {
          var newGroup = root.groupSystem.createGroup({
            name: "New Group",
            playerControlled: true,
            tileI: root.group.tileI,
            tileJ: root.group.tileJ,
            featureId: root.featureId
          });
          
          root.resourceSystem.decreaseQuantity(ResourceType.Gold, root.totalCost);
          
          for (var characterId in root.buyingCharacterIds)
          {
            if (root.buyingCharacterIds.hasOwnProperty(characterId))
            {
              root.groupSystem.removeCharacterFromGroup(root.group.id, characterId);
              root.groupSystem.addCharacterToGroup(newGroup.id, characterId);
            }
          };
          
          root.orderSystem.createReturnOrder(newGroup.id);
          root.screen.closeHirePanel();
          root.worldMapScreen.inputEnabled = true;
          root.worldMapScreen.groupMenu.addGroup(newGroup.id);
        }
      }
    });
  this.addChild(this.buyButton);
  
  // Cancel button
  this.cancelButton = new ButtonComponent(
    this.screen,
    {
      x: this.centerScreenX + 40,
      y: this.centerScreenY + 200,
      normalTexture: PIXI.Texture.fromImage(game.assetManager.paths.ui.standardButtons[0]),
      hoverTexture: PIXI.Texture.fromImage(game.assetManager.paths.ui.standardButtons[1]),
      text: "Cancel",
      centerX: true,
      centerY: true,
      onClick: function(e) 
      {
        root.screen.closeHirePanel();
        root.worldMapScreen.inputEnabled = true;
      }
    });
  this.addChild(this.cancelButton);
};

HireCharacterPanelComponent.prototype = new PIXI.DisplayObjectContainer;

HireCharacterPanelComponent.prototype.getCharacterText = function(character)
{
  if (character.isMiner)
  {
    return "Miner";
  }
  else if (character.isLogger)
  {
    return "Logger";
  }
  else if (character.isLaborer)
  {
    return "Laborer";
  }
  else
  {
    return character.type;
  }
};

HireCharacterPanelComponent.prototype.buildAvailablePanel = function()
{
  this.availablePanel = new PanelComponent({
    x: this.centerScreenX - 160,
    y: this.centerScreenY,
    width: 280,
    height: 340,
    centerX: true,
    centerY: true
  });
  this.addChild(this.availablePanel);
  
  this.availableTitle = new PIXI.BitmapText(this.group.name, {font: "18px big_pixelmix", tint: 0xFFFF00});
  this.availableTitle.position.x = 16;
  this.availableTitle.position.y = -24;
  this.availablePanel.addChild(this.availableTitle);
};

HireCharacterPanelComponent.prototype.buildBuyerPanel = function()
{
  this.buyerPanel = new PanelComponent({
    x: this.centerScreenX + 160,
    y: this.centerScreenY,
    width: 280,
    height: 340,
    centerX: true,
    centerY: true
  });
  this.addChild(this.buyerPanel);
  
  this.buyerTitle = new PIXI.BitmapText("Buying", {font: "18px big_pixelmix", tint: 0xFFFF00});
  this.buyerTitle.position.x = 16;
  this.buyerTitle.position.y = -24;
  this.buyerPanel.addChild(this.buyerTitle);
};

HireCharacterPanelComponent.prototype.buildMenus = function()
{
  var root = this;
  
  for (var i = 0; i < this.group.characterIds.length; i++)
  {
    var characterId = this.group.characterIds[i];
    var character = this.characterSystem.getCharacter(characterId);
    var container = new PIXI.DisplayObjectContainer();
    var backgroundButton = PIXI.Sprite.fromImage(game.assetManager.paths.ui.transparent);
    var portrait = new PortraitComponent(this.screen, character.id, {x: 4, y: 4});
    var label = new PIXI.BitmapText(this.getCharacterText(character), {font: "16px big_pixelmix", tint: 0xFFFF00});
    var goldSprite = PIXI.Sprite.fromImage(game.assetManager.paths.ui.resources[ResourceType.Gold]);
    var cost = this.shopSystem.getCharacterCost(this.featureId, character.id);
    var priceLabel = new PIXI.BitmapText(cost.toString(), {font: "12px big_pixelmix", tint: 0xCCCCCC});
    var onClick = null;

    container.position.x = 4; // y calculated below (based on which panel its in)

    backgroundButton.width = 260;
    backgroundButton.height = 60;
    backgroundButton.characterId = character.id;
    backgroundButton.interactive = true;
    backgroundButton.buttonMode = true;

    label.position.x = 48;
    label.position.y = 10;

    goldSprite.position.x = 42;
    goldSprite.position.y = 30;

    priceLabel.position.x = 64;
    priceLabel.position.y = 34;

    container.addChild(backgroundButton);
    container.addChild(portrait);
    container.addChild(label);
    container.addChild(goldSprite);
    container.addChild(priceLabel);
    
    if (this.buyingCharacterIds[characterId] == undefined)
    {
      onClick = function()
      {
        root.moveCharacterToBuyerMenu(this.characterId);
      };
      
      container.position.y = 4 + this.availableButtons.length * 64;
      this.availablePanel.addChild(container);
      this.availableButtons.push(container);
    }
    else
    {
      onClick = function()
      {
        root.moveCharacterToAvailableMenu(this.characterId);
      };

      container.position.y = 4 + this.buyerButtons.length * 64;
      this.buyerPanel.addChild(container);
      this.buyerButtons.push(container);
    }
    
    backgroundButton.click = onClick;
    portrait.onClick = onClick;
  }
};

HireCharacterPanelComponent.prototype.clearMenus = function()
{
  for (var i = 0; i < this.availableButtons.length; i++)
  {
    this.availablePanel.removeChild(this.availableButtons[i]);
  }
  this.availableButtons.length = 0;
  
  for (var i = 0; i < this.buyerButtons.length; i++)
  {
    this.buyerPanel.removeChild(this.buyerButtons[i]);
  }
  this.buyerButtons.length = 0;
};

HireCharacterPanelComponent.prototype.moveCharacterToBuyerMenu = function(characterId)
{
  this.totalCost += this.shopSystem.getCharacterCost(this.featureId, characterId);
  this.buyingCharacterIds[characterId] = true;
  this.rebuildMenus = true;
};

HireCharacterPanelComponent.prototype.moveCharacterToAvailableMenu = function(characterId)
{
  this.totalCost -= this.shopSystem.getCharacterCost(this.featureId, characterId);
  delete this.buyingCharacterIds[characterId];
  this.rebuildMenus = true;
};

HireCharacterPanelComponent.prototype.update = function()
{
  var canAfford = this.totalCost <= this.resourceSystem.resourceQuantities[ResourceType.Gold];
  var size = _.size(this.buyingCharacterIds);
  
  if (this.rebuildMenus)
  {
    this.clearMenus();
    this.buildMenus();
    this.rebuildMenus = false;
  }
  
  if (size == 0)
  {
    if (this.buyButton.enabled)
    {
      this.buyButton.setEnabled(false);
    }
    
    return;
  }
  
  if (canAfford && !this.buyButton.enabled)
  {
    this.buyButton.setEnabled(true);
  }
  else if (!canAfford && this.buyButton.enabled)
  {
    this.buyButton.setEnabled(false);
  }
  
  this.cancelButton.update();
  this.buyButton.update();
};