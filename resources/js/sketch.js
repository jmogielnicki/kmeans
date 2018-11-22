var points = [];
var centroids = []
var centroidsTwo = []
var colors = [[200, 20, 20], [0, 255, 200], [0, 175, 250], [100, 100, 250], [255, 150, 0]];
var step = 0;
var replacementSymbol = '--REPLACE--'
var instructions = [
  "Let's talk about clustering",
  "Take a look at the scatterplot below.  Each point is one of 3 different variations of irisis, but we don't know which is which.  The vertical axis is the length of that flower's sepal in cm, the horizontal axis is the width of the petal in cm.",
  "How might we start to find patterns in our data?  One technique we can use is called k-means clustering. The 'k' stands for the number of clusters we want to create.",
  "How many clusters shall we create?",
  "Great!  We've added " + replacementSymbol + " \"centroids\" on top of the points.  These centroids will soon help us find the clusters in our data.",
  "The next step is to assign each data point to it's closest centroid.  We'll call this the \"parent\" centroid.  Let's draw lines between each point and it's parent (closest) centroid.",
  "There!  Now it's easy to see which points are the children of which centroids.  The next step is to move each centroid so that it sits at the center of all of it's children.",
  "Now that we've moved each centroid, let's repeat the assignment step.  Because things have shifted around, a point may now be closer to a new centroid.  If so we'll re-assign it.",
  "Ok!  Looks like some points were re-assigned to a new centroid.  Now all we have to do is repeat the process.  Let's move the centroids to the middle of their children again.",
  "And then let's re-assign points to their parent centroids.",
  "Move...",
  "Re-assign...",
  "Do you notice that with each iteration, the movements are getting smaller and smaller?  The algorithm is \"converging.\"  Eventually there will be no more re-assignment or movement.",
  "Once there is no more movement (or after a set number of iterations), we can stop the algorithm.  We have found distinct clusters in the data",
  "In this case, we knew there were three different variations of a flower, and we can imagine that these clusters represent the three different varations.",
  "But k-means can ",
  "Feel free to continue clicking the next button until the centroids completely converge",
]
var buttonText = 'next'
var explanation;
var numberClustersDropDown;
var nextButton;
const offset = 100;
var table;

function preload() {
  //my table is comma separated value "csv"
//and has a header specifying the columns labels
table = loadTable("../data/iris_data.csv", "csv", "header");
console.log(table);
}

function setup() {
  var canvas = createCanvas(800, 500);
  canvas.parent('canvasHorizontalContainer');
  setupText();
  noStroke();
  const numCentroids = 5;
}

function draw() {
  background(255);
  for (point of points) {
    point.update();
    point.display();
  }
  for (centroid of centroids) {
    if (step % 2 != 0) {
      centroid.update();
    }
    centroid.display();
  }
}

function createCentroids() {
  if (Number.isInteger(numberClustersDropDown.value())) {
    return null;
  }
  numberClustersDropDown.hide();
  centroids = [];
  for (var i = 0; i < numberClustersDropDown.value(); i++) {
    var color = colors[i]
    centroids.push(new Centroid(
      id=i,
      dimensions=[ random(offset, width-offset), random(offset, height-offset) ],
      color=color
    ));
  }
  nextInstruction();
}

function createPoints() {
  let max_sepal_len = max(table.getColumn("sepal_length_cm"));
  let min_sepal_len = min(table.getColumn("sepal_length_cm"));
  let max_petal_len = max(table.getColumn("petal_width_cm"));
  let min_petal_len = min(table.getColumn("petal_width_cm"));
  for (var r = 0; r < table.getRowCount(); r++) {
    let jitter = random(-0.07, 0.07);
    let x = Number(table.get(r, "sepal_length_cm")) + jitter;
    let y = Number(table.get(r, "petal_width_cm")) + jitter;
    let xMapped = map(x, min_sepal_len, max_sepal_len, 40, width-40);
    let yMapped = map(y, min_petal_len, max_petal_len, 40, height-40);
    points.push(new Point( dimensions=[xMapped, yMapped] ));
  }
}

function findEuclideanDistance(pointDimensions, centroidDimensions) {
  // Euclidian distance - a squared + b squared = c squared
  var squaredErrorTotal = 0;
  for (var i = 0; i < pointDimensions.length; i++) {
    squaredErrorTotal += Math.pow(pointDimensions[i] - centroidDimensions[i], 2);
  }
  var euclideanDistance = Math.sqrt(squaredErrorTotal);
  return euclideanDistance;
}

function assignGroups(points, centroids) {
  let closestCentroid, closestDistance;
  for (point of points) {
    for (var i = 0; i < centroids.length; i++) {
      centroid = centroids[i];
      centroid.points = [];
      var euclideanDistance = findEuclideanDistance(centroid.dimensions, point.dimensions);
      // If first Centroid or distance to this centroid is less than others, assign it as closest
      if (i == 0 || euclideanDistance < closestDistance) {
        closestCentroid = centroid;
        closestDistance = euclideanDistance;
      }
    }
    point.assignClosest(closestCentroid, closestDistance);
  }
  console.log(centroids);

}

function findNewAverageLocation(points, centroids) {
  for (centroid of centroids) {
    centroid.reset();
    for (point of points) {
      if (point.closestCentroid == centroid) {
        // For each point, add up the total for each dimension (e.g [0] is x, [1] is y)
        for (var i = 0; i < point.dimensions.length; i++) {
          if (!centroid.pointDimensionTotals[i]) {
            centroid.pointDimensionTotals[i] = point.dimensions[i];
          } else {
            centroid.pointDimensionTotals[i] += point.dimensions[i];
          }
        }
        centroid.pointCount += 1;
      }
    }
    // For each dimension, take total and divide by count to get average
    for (var i = 0; i < centroid.dimensions.length; i++) {
      centroid.targetDimensions[i] = centroid.pointDimensionTotals[i] / centroid.pointCount;
    }
  }
}

function kmeans() {
  assignGroups(points, centroids)
  findNewAverageLocation(points, centroids)
}

function nextInstruction() {
    nextButton.show();
    explainerText();
    if (step == 1) {
      createPoints();
    }
    if (step == 3) {
      numberClustersDropDown.show();
      nextButton.hide();
    }
    if (step == 5) {
      nextButton.html('draw lines')
    }
    if (step == 6) {

    }
    if (step >= 6) {
      kmeans();
      nextButton.html(step % 2 == 0 ? 'move centroids' : 'reassign points')
    }
  console.log(step);
}

function setupText() {
  explanation = createDiv(instructions[step])
  explanation.parent('explanation');
  explanation.addClass('explanation-text')
  nextButton = createButton('next');
  nextButton.mousePressed(nextInstruction);
  nextButton.parent('explanation');
  numberClustersDropDown = createSelect();
  numberClustersDropDown.parent('explanation');
  numberClustersDropDown.option('choose # clusters');
  numberClustersDropDown.option(2);
  numberClustersDropDown.option(3);
  numberClustersDropDown.option(4);
  numberClustersDropDown.option(5);
  numberClustersDropDown.changed(createCentroids)
  numberClustersDropDown.hide();
}

function explainerText() {
  step += 1
  if (instructions[step]) {
    var instruction = instructions[step];
    if (instruction.includes(replacementSymbol)) {
      var position = instruction.indexOf(replacementSymbol);
      var instruction = [instruction.slice(0, position), numberClustersDropDown.value(), instruction.slice(position + replacementSymbol.length)].join('');
    }
    explanation.html(instruction);
  }
}
