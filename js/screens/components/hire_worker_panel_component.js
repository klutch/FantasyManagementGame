var HireWorkerPanelComponent = function(screen, featureId, options)
{
  options = options || {};
  
  this.base = PIXI.DisplayObjectContainer;
  this.base();
  this.screen = screen;
  this.featureId = featureId;
  this.feature = worldManager.getFeature(featureId);
  this.group = characterManager.groups[this.feature.workerGroupId];
  this.z = options.z;
  this.availableButtons = [];
  this.buyerButtons = [];
  this.buyingCharacterIds = {};
  this.rebuildMenus = true;
  
  this.buildAvailableWorkersPanel();
  this.buildBuyerPanel();
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
  // Panel
  this.availablePanel = new PanelComponent({
    x: Math.floor(game.containerWidth * 0.5) - 100,
    y: Math.floor(game.containerHeight * 0.5),
    width: 180,
    height: 340,
    centerX: true,
    centerY: true
  });
  this.addChild(this.availablePanel);
  
  // Title
  this.availableTitle = new PIXI.BitmapText("Available", {font: "18px big_pixelmix", tint: 0xFFFF00});
  this.availableTitle.position.x = 16;
  this.availableTitle.position.y = -24;
  this.availablePanel.addChild(this.availableTitle);
};

HireWorkerPanelComponent.prototype.buildBuyerPanel = function()
{
  // Panel
  this.buyerPanel = new PanelComponent({
    x: Math.floor(game.containerWidth * 0.5) + 100,
    y: Math.floor(game.containerHeight * 0.5),
    width: 180,
    height: 340,
    centerX: true,
    centerY: true
  });
  this.addChild(this.buyerPanel);
  
  // Title
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

    container.position.x = 4;
    container.position.y = 4 + i * 64;

    backgroundButton.width = 160;
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

      this.availablePanel.addChild(container);
      this.availableButtons.push(container);
    }
    else
    {
      onClick = function()
      {
        root.moveCharacterToAvailableMenu(this.characterId);
      };

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
  this.buyingCharacterIds[characterId] = true;
  this.rebuildMenus = true;
};

HireWorkerPanelComponent.prototype.moveCharacterToAvailableMenu = function(characterId)
{
  delete this.buyingCharacterIds[characterId];
  this.rebuildMenus = true;
};

HireWorkerPanelComponent.prototype.update = function()
{
  if (this.rebuildMenus)
  {
    this.clearMenus();
    this.buildMenus();
    this.rebuildMenus = false;
  }
};