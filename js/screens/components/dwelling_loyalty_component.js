var DwellingLoyaltyComponent = function(screen, featureId)
{
  this.base = PIXI.DisplayObjectContainer;
  this.base();
  this.screen = screen;
  this.featureId = featureId;
  this.feature = worldManager.world.features[this.featureId];
  
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

DwellingLoyaltyComponent.prototype = new PIXI.DisplayObjectContainer;

DwellingLoyaltyComponent.prototype.getGreetingText = function()
{
  if (this.feature.isLoyaltyFree)
  {
    return "A group of locals comes out and gives\n" +
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

DwellingLoyaltyComponent.prototype.buildButtons = function()
{
  var root = this;
  var numButtons = 0;
  var addLeaveButton = true;
  var subjugateButton;
  
  if (this.feature.isLoyaltyFree)
  {
    // Done button
    var doneButton = new ButtonComponent(
      this.screen,
      {
        x: 100,
        y: 232,
        normalTexture: PIXI.Texture.fromImage(assetPathManager.assetPaths.ui.standardButtons[0]),
        hoverTexture: PIXI.Texture.fromImage(assetPathManager.assetPaths.ui.standardButtons[1]),
        text: "Done",
        centerX: true,
        centerY: true,
        onClick: function(e) { root.done(); }
      });
    this.panel.addChild(doneButton);
    numButtons++;
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
          y: 180 + numButtons * 48,
          normalTexture: PIXI.Texture.fromImage(assetPathManager.assetPaths.ui.standardButtons[0]),
          hoverTexture: PIXI.Texture.fromImage(assetPathManager.assetPaths.ui.standardButtons[1]),
          text: "Offer Gift",
          centerX: true,
          centerY: true,
          onClick: function(e) { root.openGiftPanel(); }
        });
      this.panel.addChild(giftButton);
      numButtons++;
    }
  }
  
  // Subjugate button
  subjugateButton = new ButtonComponent(
    this.screen,
    {
      x: 100,
      y: 180 + numButtons * 48,
      normalTexture: PIXI.Texture.fromImage(assetPathManager.assetPaths.ui.standardButtons[0]),
      hoverTexture: PIXI.Texture.fromImage(assetPathManager.assetPaths.ui.standardButtons[1]),
      text: "Subjugate Dwelling",
      centerX: true,
      centerY: true,
      onClick: function(e) { root.subjugate(); }
    });
  this.panel.addChild(subjugateButton);
  numButtons++;
  
  // Leave button
  if (addLeaveButton)
  {
    var leaveButton = new ButtonComponent(
      this.screen,
      {
        x: 100,
        y: 180 + numButtons * 48,
        normalTexture: PIXI.Texture.fromImage(assetPathManager.assetPaths.ui.standardButtons[0]),
        hoverTexture: PIXI.Texture.fromImage(assetPathManager.assetPaths.ui.standardButtons[1]),
        text: "Leave",
        centerX: true,
        centerY: true,
        onClick: function(e) { root.done(); }
      });
    this.panel.addChild(leaveButton);
  }
};