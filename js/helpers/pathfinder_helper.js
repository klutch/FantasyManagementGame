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
  var sideHalfLength = Math.floor(Math.sqrt(diffI * diffI + diffJ * diffJ));
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
  initalTile.tempParent = null;
  
  // Find path
  while (!finished)
  {
    var selectedTile = this.findLowestF(openList);
    var selectedKey = selectedTile.toString();
    
    // Move selected tile to the closed list
    this.closedList[selectedKey] = selectedTile;
    delete this.openList[selectedKey];
    
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
          break;
        }
        
        // Skip out of range neighbor tiles
        if (i < upperBoundI || j < upperBoundJ || i > lowerBoundI || j > lowerBoundJ)
        {
          break;
        }
        
        // Get neighbor tile (create if necessary)
        neighborTile = worldManager.getOrCreateTile(i, j);
        
        // Check if neighbor tile exists
        /*if (worldManager.doesTileExist(i, j))
        {
          neighborTile = worldManager.getTile(i, j);
          neighborKey = neighborTile.toString();
        }
        else
        {
          break;
        }*/
        
        // Check if neighbor tile is walkable
        if (!neighborTile.walkable)
        {
          break;
        }
        
        // Check if neighbor tile is in closed list
        if (closedList[neighborKey] != null)
        {
          break;
        }
        
        // Determine whether neighbor is diagonally adjacent
        isDiagonal = (selectedTile.i - i != 0 && selectedTile.j - j != 0);
        
        // Check if neighbor tile is in the open list
        if (openList[neighborKey] == null)
        {
          // Calculate F, G, H, and parent values and add to open list
          openList[neighborKey] = neighorTile;
          neighborTile.tempParent = selectedTile;
          neighborTile.tempG = selectedTile.tempG + (isDiagonal ? 14 : 10);
          neighborTile.tempH = Math.abs(i - endI) + Math.abs(j - endJ);
          neighborTile.tempF = neighborTile.tempG + neighborTile.tempH;
        }
        else
        {
          // See if G value to neighbor tile from the selected tile is
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
      
      // Build linked list of path nodes, and return the head (starts at tail and works backwards)
      while (currentTile.tempParent != null)
      {
        var newNode = new PathNode(currentTile.tempParent.i, currentTile.tempParent.j);
        
        newNode.next = currentNode;
        currentNode.previous = newNode;
        currentNode = newNode;
        
        currentTile = currentTile.tempParent;
      }
      
      return newNode;
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