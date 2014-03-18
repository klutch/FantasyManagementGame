var GroupPreviewComponent = function(groupId, options)
{
  options = options || {};
  options.x = options.x || 0;
  options.y = options.y || 0;
  options.width = options.width || 400;
  options.height = options.height || 300;
  
  this.base = PIXI.DisplayObjectContainer;
  this.base();
  this.groupId = groupId;
  this.group = adventurerManager.groups[groupId];
  this.adventurerStatTexts = [];
  this.position.x = options.x;
  this.position.y = options.y;
  this.z = options.z;
  delete options.x;
  delete options.y;
  delete options.z;
  
  // Create preview panel
  this.panel = new PanelComponent(options);
  this.addChild(this.panel);
  
  // Create adventurer portraits and labels
  for (var i = 0; i < this.group.adventurerIds.length; i++)
  {
    var adventurer = adventurerManager.adventurers[this.group.adventurerIds[i]];
    var sprite = PIXI.Sprite.fromImage(assetPathManager.assetPaths.ui.portraits[adventurer.type]);
    var typeText = new PIXI.BitmapText(adventurer.type, {font: "14px big_pixelmix", tint: 0xFFFF00});
    var statText = new PIXI.BitmapText("    /    /", {font: "12px big_pixelmix", tint: 0xCCCCCC});
    var offenseText = new PIXI.BitmapText("XX", {font: "12px big_pixelmix", tint: OFFENSE_COLOR});
    var defenseText = new PIXI.BitmapText("XX", {font: "12px big_pixelmix", tint: DEFENSE_COLOR});
    var supportText = new PIXI.BitmapText("XX", {font: "12px big_pixelmix", tint: SUPPORT_COLOR});
    
    sprite.position.x = 16;
    sprite.position.y = 16 + 64 * i;
    typeText.position.x = 64;
    typeText.position.y = sprite.position.y + 4;
    statText.position.x = 64;
    statText.position.y = typeText.position.y + 28;
    offenseText.baseX = 92;
    offenseText.position.y = statText.position.y;
    defenseText.baseX = 129;
    defenseText.position.y = statText.position.y;
    supportText.baseX = 170;
    supportText.position.y = statText.position.y;
    this.addChild(sprite);
    this.addChild(typeText);
    this.addChild(statText);
    this.addChild(offenseText);
    this.addChild(defenseText);
    this.addChild(supportText);
    this.adventurerStatTexts.push([offenseText, defenseText, supportText]);
  }
};

GroupPreviewComponent.prototype = new PIXI.DisplayObjectContainer;

GroupPreviewComponent.prototype.update = function()
{
  for (var i = 0; i < this.adventurerStatTexts.length; i++)
  {
    var adventurerId = this.group.adventurerIds[i];
    var offenseText = this.adventurerStatTexts[i][0];
    var defenseText = this.adventurerStatTexts[i][1];
    var supportText = this.adventurerStatTexts[i][2];
    
    offenseText.setText(adventurerManager.getAdventurerOffense(adventurerId).toString());
    defenseText.setText(adventurerManager.getAdventurerDefense(adventurerId).toString());
    supportText.setText(adventurerManager.getAdventurerSupport(adventurerId).toString());
    
    offenseText.position.x = offenseText.baseX - offenseText.textWidth;
    defenseText.position.x = defenseText.baseX - defenseText.textWidth;
    supportText.position.x = supportText.baseX - supportText.textWidth;
  }
};