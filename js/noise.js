var Noise = function(seed)
{
  this.perlinGridWidth = 64;
  this.perlinGridHeight = 64;
  this.rng = seed == null ? new Math.seedrandom() : new Math.seedrandom(seed);
  this.perlinGradients = [];
  
  // Create perlin gradient grid
  for (var i = 0; i < this.perlinGridWidth; i++)
  {
    this.perlinGradients[i] = [];
    
    for (var j = 0; j < this.perlinGridHeight; j++)
    {
      this.perlinGradients[i][j] = [this.rng() * 2 - 1, this.rng() * 2 - 1];
    }
  }
};

// 2D dot product
Noise.prototype.dot = function(a, b)
{
  return a[0] * b[0] + a[1] * b[1];
};

// Perlin weight
Noise.prototype.perlinWeight = function(x)
{
  return x*x*x*(x*(x*6-15)+10);
};

// Perlin noise algorithm (slightly modified from 'Simplex Noise Demystified')
// http://webstaff.itn.liu.se/~stegu/simplexnoise/simplexnoise.pdf
// returns a number between [-1, 1]
Noise.prototype.perlin = function(x, y)
{
  // Modify x and y values, otherwise we'll always be dealing with whole numbers
  var noiseX = x / this.perlinGridWidth;
  var noiseY = y / this.perlinGridHeight;
  
  // Get grid cell containing this point
  var gridI = Math.floor(noiseX);
  var gridJ = Math.floor(noiseY);
  
  // Get coordinates relative to its containing grid cell
  var relX = noiseX - gridI;
  var relY = noiseY - gridJ;
  
  // Get gradients
  var g00 = this.perlinGradients[gridI % this.perlinGridWidth][gridJ % this.perlinGridHeight];
  var g10 = this.perlinGradients[(gridI + 1) % this.perlinGridWidth][gridJ % this.perlinGridHeight];
  var g01 = this.perlinGradients[gridI % this.perlinGridWidth][(gridJ + 1) % this.perlinGridHeight];
  var g11 = this.perlinGradients[(gridI + 1) % this.perlinGridWidth][(gridJ + 1) % this.perlinGridHeight];
  
  // Calculate noise contributions from each corner
  var n00 = this.dot(g00, [relX, relY]);
  var n10 = this.dot(g10, [relX - 1, relY]);
  var n01 = this.dot(g01, [relX, relY - 1]);
  var n11 = this.dot(g11, [relX - 1, relY - 1]);
  
  // Weight contributions
  var nx0 = n00 * (1 - this.perlinWeight(relX)) + n10 * this.perlinWeight(relX);
  var nx1 = n01 * (1 - this.perlinWeight(relX)) + n11 * this.perlinWeight(relX);
  var nxy = nx0 * (1 - this.perlinWeight(relY)) + nx1 * this.perlinWeight(relY);
  
  return nxy;
};

// Fractional brownian motion
Noise.prototype.fbm = function(x, y, count, frequency, gain, lacunarity, noiseMethod)
{
  var total = 0;
  var amplitude = gain;
  
  for (var i = 0; i < count; i++)
  {
    total += noiseMethod(x * frequency, y * frequency) * amplitude;
    frequency *= lacunarity;
    amplitude *= gain;
  }
  
  return total;
};