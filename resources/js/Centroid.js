class Centroid {
  constructor(id, dimensions, color) {
    this.id = id;
    this.dimensions = dimensions;
    this.color = color;
    this.points = [];
    this.pointDimensionTotals = [];
    this.pointCount = 0;
  }
}

Centroid.prototype.display = function() {
  fill(this.color);
  ellipse(this.dimensions[0], this.dimensions[1], 10, 10);
}

Centroid.prototype.reset = function() {
  this.pointDimensionTotals = [];
  this.pointCount = 0;
}

Centroid.prototype.add = function(point) {
  this.points.push(point);
}
