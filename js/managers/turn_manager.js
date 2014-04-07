var TurnManager = function()
{
  this.state = TurnState.Ready;
};

TurnManager.prototype.startProcessing = function()
{
  this.state = TurnState.Processing;
  
  // Stop order setup if necessary
  if (orderManager.settingUpOrder)
  {
    orderManager.endOrderSetup();
  }
  
  // Add notification screen
  screenManager.addScreen(notificationManager.notificationScreen);
  screenManager.screens[ScreenType.WorldMap].inputEnabled = false;
};

TurnManager.prototype.endProcessing = function()
{
  this.state = TurnState.Ready;
  
  // Remove notifications screen
  screenManager.removeScreen(ScreenType.Notification);
  screenManager.screens[ScreenType.WorldMap].inputEnabled = true;
};

TurnManager.prototype.pauseProcessing = function()
{
  console.log("paused processing");
  this.state = TurnState.PausedProcessing;
};

TurnManager.prototype.resumeProcessing = function()
{
  this.state = TurnState.Processing;
};

TurnManager.prototype.update = function()
{
  if (this.state == TurnState.Processing)
  {
    orderManager.processQueuedOrders();
    raidManager.processRaids();
  }
};