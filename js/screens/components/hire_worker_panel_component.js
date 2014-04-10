var HireWorkerPanelComponent = function(screen, featureId, options)
{
  var root = this;
  
  options = options || {};
  
  this.base = PIXI.DisplayObjectContainer;
  this.base();
  this.screen = screen;
  this.featureId = featureId;
  this.feature = worldManager.getFeature(featureId);
  this.group = groupManager.getGroup(this.feature.workerGroupId);
  this.z = options.z;
  this.availableButtons = [];
  this.buyerButtons = [];
  this.buyingCharacterIds = {};
  this.totalCost = 0;
  this.rebuildMenus = true;
  this.centerScreenX = Math.floor(game.containerWidth * 0.5);
  this.centerScreenY = Math.floor(game.containerHeight * 0.5);
  this.worldMapScreen = screenManager.screens[ScreenType.WorldMap];
  
  // Panels
  this.buildAvailableWorkersPanel();
  this.buildBuyerPanel();
  
  // Buy button
  this.buyButton = new ButtonComponent(
    this.screen,
    {
      x: this.centerScreenX + 220,
      y: this.centerScreenY + 200,
      normalTexture: PIXI.Texture.fromImage(assetPathManager.assetPaths.ui.standardButtons[0]),
      hoverTexture: PIXI.Texture.fromImage(assetPathManager.assetPaths.ui.standardButtons[1]),
      disabledTexture: PIXI.Texture.fromImage(assetPathManager.assetPaths.ui.standardButtons[2]),
      text: "Buy",
      centerX: true,
      centerY: true,
      onClick: function(e)
      {
        if (this.enabled)
        {
          var newGroup = groupManager.createGroup({
            name: "Workers",
            playerControlled: true,
            tileI: root.group.tileI,
            tileJ: root.group.tileJ,
            featureId: root.featureId
          });
          
          resourceManager.decreaseQuantity(ResourceType.Gold, root.totalCost);
          
          for (var characterId in root.buyingCharacterIds)
          {
            if (root.buyingCharacterIds.hasOwnProperty(characterId))
            {
              groupManager.removeCharacterFromGroup(root.group.id, characterId);
              groupManager.addCharacterToGroup(newGroup.id, characterId);
            }
          };
          
          orderManager.createReturnOrder(newGroup.id);
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
      normalTexture: PIXI.Texture.fromImage(assetPathManager.assetPaths.ui.standardButtons[0]),
      hoverTexture: PIXI.Texture.fromImage(assetPathManager.assetPaths.ui.standardButtons[1]),
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

HireWorkerPanelComponent.prototype = new PIXI.DisplayObjectContainer;

HireWorkerPanelComponent.prototype.getWorkerText = function(character)
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
  return "Unknown";
};

HireWorkerPanelComponent.prototype.buildAvailableWorkersPanel = function()
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

HireWorkerPanelComponent.prototype.buildBuyerPanel = function()
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

HireWorkerPanelComponent.prototype.buildMenus = function()
{
  var root = this;
  
  for (var i = 0; i < this.group.characterIds.length; i++)
  {
    var characterId = this.group.characterIds[i];
    var character = characterManager.characters[characterId];
    var container = new PIXI.DisplayObjectContainer();
    var backgroundButton = PIXI.Sprite.fromImage(assetPathManager.assetPaths.ui.transparent);
    var portrait = new PortraitComponent(character.id, {x: 4, y: 4});
    var label = new PIXI.BitmapText(this.getWorkerText(character), {font: "16px big_pixelmix", tint: 0xFFFF00});
    var goldSprite = PIXI.Sprite.fromImage(assetPathManager.assetPaths.ui.resources[ResourceType.Gold]);
    var cost = dwellingManager.getWorkerCost(this.featureId, character.id);
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

HireWorkerPanelComponent.prototype.clearMenus = function()
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

HireWorkerPanelComponent.prototype.moveCharacterToBuyerMenu = function(characterId)
{
  this.totalCost += dwellingManager.getWorkerCost(this.featureId, characterId);
  this.buyingCharacterIds[characterId] = true;
  this.rebuildMenus = true;
};

HireWorkerPanelComponent.prototype.moveCharacterToAvailableMenu = function(characterId)
{
  this.totalCost -= dwellingManager.getWorkerCost(this.featureId, characterId);
  delete this.buyingCharacterIds[characterId];
  this.rebuildMenus = true;
};

HireWorkerPanelComponent.prototype.update = function()
{
  var canAfford = this.totalCost <= resourceManager.resourceQuantities[ResourceType.Gold];
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
};