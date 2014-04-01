/*
 *  "A* Pathfinding for Beginners", Patrick Lester - http://www.policyalmanac.org/games/aStarTutorial.htm
 */

var PathNode = function(i, j)
{
  this.i = i;
  this.j = j;
  this.previous = null;
  this.next = null;
  
  // Temporary pathfinding values
  this.f = 0;
  this.g = 0;
  this.h = 0;
};

PathNode.prototype.getHead = function()
{
  var head = this;
  
  while (head.previous != null)
  {
    head = head.previous;
  }
  return head;
};

PathNode.prototype.getTail = function()
{
  var tail = this;
  
  while(tail.next != null)
  {
    tail = tail.next;
  }
  return tail;
}

var PathfinderHelper = {};

PathNode.prototype.toString = function()
{
  return this.i + ", " + this.j;
};

PathfinderHelper.findPath = function(startI, startJ, endI, endJ)
{
  var finished = false;
  
  // TODO: This is hacky, and should be handled better when pathfinding supports heuristic-only paths
  var targetKey = endI + ", " + endJ;
  
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
  var initialNode = new PathNode(startI, startJ);
  
  openList[initialNode.toString()] = initialNode;
  
  // Find path
  while (!finished)
  {
    var selectedNode = this.findLowestF(openList);
    var selectedKey = selectedNode.toString();
    
    // Move selected node to the closed list
    closedList[selectedKey] = selectedNode;
    delete openList[selectedKey];
    
    // Process neighbors
    for (var i = selectedNode.i - 1; i < selectedNode.i + 2; i++)
    {
      for (var j = selectedNode.j - 1; j < selectedNode.j + 2; j++)
      {
        var neighborTile;
        var neighborNode;
        var neighborKey;
        var isDiagonal;
        
        // Skip selected tile
        if (i == selectedNode.i && j == selectedNode.j)
        {
          continue;
        }
        
        // Skip out of range neighbor tiles
        if (i < upperBoundI || j < upperBoundJ || i > lowerBoundI || j > lowerBoundJ)
        {
          continue;
        }
        
        // Check if neighbor tile exists (create/store node if it does)
        if (worldManager.doesTileExist(i, j))
        {
          neighborTile = worldManager.getTile(i, j);
          neighborNode = new PathNode(i, j);
          neighborKey = neighborNode.toString();
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
        isDiagonal = (selectedNode.i - i != 0 && selectedNode.j - j != 0);
        
        // Check if neighbor node is in the open list
        if (openList[neighborKey] == null)
        {
          // Calculate F, G, H, and parent values and add to open list
          openList[neighborKey] = neighborNode;
          neighborNode.previous = selectedNode;
          neighborNode.g = selectedNode.g + (isDiagonal ? 14 : 10);
          neighborNode.h = Math.abs(i - endI) + Math.abs(j - endJ);
          neighborNode.f = neighborNode.g + neighborNode.h;
        }
        else
        {
          // See if G value to neighbor tile from the selected tile is shorter than its current path
          var newG = selectedNode.g + (isDiagonal ? 14 : 10);
          
          if (newG < neighborNode.g)
          {
            neighborNode.previous = selectedNode;
            neighborNode.g = newG;
            neighborNode.g = neighborNode.g + neighborNode.h;
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
      var currentNode = closedList[targetKey];
      
      // Build doubly-linked list
      while (currentNode.previous != null)
      {
        currentNode.previous.next = currentNode;
        currentNode = currentNode.previous;
      }
      
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
  _.each(list, function(node)
    {
      if (node.f < result.f)
      {
        result = node;
      }
    },
    this);
  
  return result;
};