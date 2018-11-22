class Centroid {
  constructor(id, dimensions, color) {
    this.id = id;
    this.dimensions = dimensions;
    this.targetDimensions = [];
    this.color = color;
    this.childPoints = [];
    this.pointDimensionTotals = [];
    this.pointCount = 0;
    this.easing = 0.2;
  }
}

Centroid.prototype.display = function() {
  stroke(0);
  strokeWeight(2);
  fill(...this.color);
  ellipse(this.dimensions[0], this.dimensions[1], 20, 20);
  this.displayLines();
}

Centroid.prototype.displayLines = function() {
  // TODO get centroid lines to points working
  for (point of this.childPoints) {
    line(this.dimensions[0], this.dimensions[1], this.point.dimensions[0], this.point.dimensions[1])
  }
}

Centroid.prototype.update = function() {
  if (this.targetDimensions.length > 0 && this.pointCount > 0) {
    for (var i = 0; i < this.dimensions.length; i++) {
      let delta = this.targetDimensions[i] - this.dimensions[i];
      this.dimensions[i] += delta * this.easing;
    }
  }
}

Centroid.prototype.reset = function() {
  this.pointDimensionTotals = [];
  this.pointCount = 0;
}

Centroid.prototype.add = function(point) {
  this.childPoints.push(point);
}
