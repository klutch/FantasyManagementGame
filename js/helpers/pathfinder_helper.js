/*
 *  "A* Pathfinding for Beginners", Patrick Lester - http://www.policyalmanac.org/games/aStarTutorial.htm
 */

var PathNode = function(i, j)
{
  this.i = i;
  this.j = j;
  this.previous = null;
  this.next = null;
};

var PathfinderHelper = {};

PathfinderHelper.findPath = function(startI, startJ, endI, endJ)
{
  var finished = false;
  var targetTile = worldManager.getOrCreateTile(endI, endJ);
  var targetKey = targetTile.toString();
  
  // Find range
  var diffI = endI - startI;
  var diffJ = endJ - startJ;
  var sideHalfLength = Math.min(Math.max(Math.floor(Math.sqrt(diffI * diffI + diffJ * diffJ)), 128), 1024);
  var middlePointI = Math.floor((startI + endI) * 0.5);
  var middlePointJ = Math.floor((startJ + endJ) * 0.5);
  var upperBoundI = middlePointI - sideHalfLength;
  var upperBoundJ = middlePointJ - sideHalfLength;
  var lowerBoundI = middlePointI + sideHalfLength;
  var lowerBoundJ = middlePointJ + sideHalfLength;
  
  // Initial setup
  var openList = {};
  var closedList = {};
  var initialTile = worldManager.getTile(startI, startJ);
  
  openList[initialTile.toString()] = initialTile;
  initialTile.tempParent = null;
  
  // Find path
  while (!finished)
  {
    var selectedTile = this.findLowestF(openList);
    var selectedKey = selectedTile.toString();
    
    // Move selected tile to the closed list
    closedList[selectedKey] = selectedTile;
    delete openList[selectedKey];
    
    // Process neighbors
    for (var i = selectedTile.i - 1; i < selectedTile.i + 2; i++)
    {
      for (var j = selectedTile.j - 1; j < selectedTile.j + 2; j++)
      {
        var neighborTile;
        var neighborKey;
        var isDiagonal;
        
        // Skip selected tile
        if (i == selectedTile.i && j == selectedTile.j)
        {
          continue;
        }
        
        // Skip out of range neighbor tiles
        if (i < upperBoundI || j < upperBoundJ || i > lowerBoundI || j > lowerBoundJ)
        {
          continue;
        }
        
        // Get neighbor tile (create if necessary)
        //neighborTile = worldManager.getOrCreateTile(i, j);
        //neighborKey = neighborTile.toString();
        
        // Check if neighbor tile exists
        if (worldManager.doesTileExist(i, j))
        {
          neighborTile = worldManager.getTile(i, j);
          neighborKey = neighborTile.toString();
        }
        else
        {
          continue;
        }
        
        // Check to make sure tile is discovered
        if (!neighborTile.discovered)
        {
          continue;
        }
        
        // Check if neighbor tile is walkable
        if (!neighborTile.walkable)
        {
          continue;
        }
        
        // Check if neighbor tile is in closed list
        if (closedList[neighborKey] != null)
        {
          continue;
        }
        
        // Determine whether neighbor is diagonally adjacent
        isDiagonal = (selectedTile.i - i != 0 && selectedTile.j - j != 0);
        
        // Check if neighbor tile is in the open list
        if (openList[neighborKey] == null)
        {
          // Calculate F, G, H, and parent values and add to open list
          openList[neighborKey] = neighborTile;
          neighborTile.tempParent = selectedTile;
          neighborTile.tempG = selectedTile.tempG + (isDiagonal ? 14 : 10);
          neighborTile.tempH = Math.abs(i - endI) + Math.abs(j - endJ);
          neighborTile.tempF = neighborTile.tempG + neighborTile.tempH;
        }
        else
        {
          // See if G value to neighbor tile from the selected tile is shorter than its current path
          var newG = selectedTile.tempG + (isDiagonal ? 14 : 10);
          
          if (newG < neighborTile.tempG)
          {
            neighborTile.tempParent = selectedTile;
            neighborTile.tempG = newG;
            neighborTile.tempF = neighborTile.tempG + neighborTile.tempH;
          }
        }
      }
    }
    
    // Check if open list is empty (failure)
    if (_.size(openList) == 0)
    {
      return null;
    }
    
    // Check if target is in closed list (success)
    if (closedList[targetKey] != null)
    {
      var currentTile = targetTile;
      var currentNode = new PathNode(currentTile.i, currentTile.j);
      var tailNode = currentNode;
      
      // Build linked list of path nodes, and return the head (starts at tail and works backwards)
      while (currentTile.tempParent != null)
      {
        var newNode = new PathNode(currentTile.tempParent.i, currentTile.tempParent.j);
        
        newNode.next = currentNode;
        currentNode.previous = newNode;
        currentNode = newNode;
        
        currentTile = currentTile.tempParent;
      }
      currentNode.end = tailNode;
      return currentNode;
    }
  }
};

PathfinderHelper.findLowestF = function(list)
{
  var result = null;
  
  // Get first result
  for (var key in list)
  {
    if (list.hasOwnProperty(key))
    {
      result = list[key];
      break;
    }
  }
  
  // Compare f scores
  _.each(list, function(tile)
    {
      if (tile.tempF < result.tempF)
      {
        result = tile;
      }
    },
    this);
  
  return result;
};