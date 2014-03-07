var MathHelper = {};

// http://msdn.microsoft.com/en-us/library/windows/desktop/bb509618%28v=vs.85%29.aspx
MathHelper.lerp = function(x, y, s)
{
  return x + s * (y - x);
};