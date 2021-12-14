// const startPoligon = [{x: 55, y: 5}, {x: 12, y: 105}, {x: 125, y: 215}, {x: 125, y: 115}, {x: 425, y: 215}, {x: 425, y: 50}]
// const startPoligon = [{x: 55, y: 5}, {x: 12, y: 105}, {x: 125, y: 215}, {x: 150, y: 115}, {x: 300, y: 115}, {x: 300, y: 50}, {x: 425, y: 50}]
const startPoligon = [{x: 55, y: 5}, {x: 12, y: 105}, {x: 125, y: 215}, {x: 150, y: 115}, {x: 300, y: 115}, {x: 300, y: 300}, {x: 425, y: 50}, {x: 200, y: 100}]
function setup() {
	createCanvas(600, 500)
	background(250)
}

poligons = [startPoligon];
res = []
colors = ["blue", "red", "green", "yellow", "purple", "pink", "orange"]

function drawPoligon(poligon) {
	for (let i=0; i < poligon.length; i++) {
		if (i === poligon.length - 1) {
			line(poligon[i].x, poligon[i].y, poligon[0].x, poligon[0].y);
		}
		else {
			line(poligon[i].x, poligon[i].y, poligon[i+1].x, poligon[i+1].y);
		}
	}
}

function getLinesByPoligon(poligon) {
	var lines = [];
	for (let i=0; i < poligon.length; i++) {
		if (i === poligon.length - 1) {
			lines.push({first: poligon[i], second: poligon[0]});
		}
		else {
			lines.push({first: poligon[i], second: poligon[i+1]});
		}
	}
	return lines;
}

function draw() {
	drawPoligon(startPoligon)

	noLoop()
	process(startPoligon)

	//print(res)
	for (var j=0; j < res.length; j++) {
		stroke(colors[j])
		drawPoligon(res[j])
	}

}

function process(poligon) {
	var line = isConvex(poligon)
	if (line != null) {
		var lines = getLinesByPoligon(poligon)
		var interseptPoint = getInterseptPoint(line, lines)
		var first = getFirstPoligon(poligon, line.first, interseptPoint.second);
		var second = getSecondPoligon(poligon, line.second, interseptPoint.second);
		process(first)
		process(second)
	}
	else {
		res.push(poligon)
	}
}

function getFirstPoligon(poligon, startPoint, interseptPoint) {
	var firstPoligon = []
	var tempDots = {first: null, second: null}
	var flag = true
	var flag2 = true;
	for (let i=0; i < poligon.length; i++) {
		if (flag) {
			firstPoligon.push(poligon[i])
		}

		if (tempDots.first === null) {
			tempDots.first = poligon[i]
		}
		else if (tempDots.second === null) {
			tempDots.second = poligon[i]
		}
		else {
			tempDots.first = tempDots.second
			tempDots.second = poligon[i]
		}

		if (tempDots.first !== null && tempDots.second !== null && flag2) {
			if (isBelongsToSegment(interseptPoint, tempDots.first, tempDots.second)) {
				firstPoligon.push(tempDots.second)
				flag2 = false
				flag = true
			}
		}

		if (poligon[i].x === startPoint.x && poligon[i].y === startPoint.y) {
			firstPoligon.push(interseptPoint)
			flag = false
		}
	}
	return firstPoligon;
}

function getSecondPoligon(poligon, startPoint, interseptPoint) {
	var secondPoligon = []
	var tempDots = {first: null, second: null}
	var flag = false;
	for (let i=0; i < poligon.length; i++) {
		if (tempDots.first === null) {
			tempDots.first = poligon[i]
		}
		else if (tempDots.second === null) {
			tempDots.second = poligon[i]
		}
		else {
			tempDots.first = tempDots.second
			tempDots.second = poligon[i]
		}

		if (tempDots.first !== null && tempDots.second !== null) {
			if (isBelongsToSegment(interseptPoint, tempDots.first, tempDots.second)) {
				flag = false
			}
		}

		if (poligon[i].x === startPoint.x && poligon[i].y === startPoint.y) {
			flag = true
		}

		if (flag) {
			secondPoligon.push(poligon[i])
		}
	}
	secondPoligon.push(interseptPoint)
	return secondPoligon;
}

function getInterseptPoint(line, lines) {
	var points = []
	var listLentgh = []
	for (let i=0; i < lines.length; i++) {
		var point = isLineIntersection(lines[i].first, lines[i].second, line.first, line.second)
		if (point !== null && isBelongsToSegment(point, lines[i].first, lines[i].second) && isRay(point, line.first, line.second)) {
			points.push(point)
		}
	}
	for (let c=0; c < points.length; c++) {
		listLentgh.push({first: line.second, second: points[c], length: getLength(points[c], line.second)})
	}
	listLentgh.sort(function(a, b) {
		return a.length - b.length
	})
	return listLentgh[0];
}

function isConvex(poligon) {
  for (var i=0; i < poligon.length; i++) {
    var ab = 0
    var bc = 0
		var line = {};
    if (i === 0) {
			line = {first: {x: poligon[poligon.length-1].x, y: poligon[poligon.length-1].y}, second: {x: poligon[i].x, y: poligon[i].y}};
      var ab = { x: poligon[i].x - poligon[poligon.length-1].x, y: poligon[i].y - poligon[poligon.length-1].y};
      var bc = { x: poligon[i+1].x - poligon[i].x, y: poligon[i+1].y - poligon[i].y};
    }
    else if (i === poligon.length - 1) {
			line = {first: {x: poligon[i-1].x, y: poligon[i-1].y}, second: {x: poligon[i].x, y: poligon[i].y}};
      var ab = { x: poligon[i].x - poligon[i-1].x, y: poligon[i].y - poligon[i-1].y};
      var bc = { x: poligon[0].x - poligon[i].x, y: poligon[0].y - poligon[i].y};
    }
    else {
			line = {first: {x: poligon[i-1].x, y: poligon[i-1].y}, second: {x: poligon[i].x, y: poligon[i].y}};
      var ab = { x: poligon[i].x - poligon[i-1].x, y: poligon[i].y - poligon[i-1].y};
      var bc = { x: poligon[i+1].x - poligon[i].x, y: poligon[i+1].y - poligon[i].y};
    }

    var product = ab.x * bc.y - ab.y * bc.x;
    if (product > 0) {
      return line
    }
  }
  return null
}

function isLineIntersection(point1, point2, point3, point4) {
		var a1 = point2.y - point1.y;
		var b1 = point1.x - point2.x;
		var c1 = a1 * (point1.x) + b1 * (point1.y);

		var a2 = point4.y - point3.y;
		var b2 = point3.x - point4.x;
		var c2 = a2 * (point3.x) + b2 * (point3.y);
		if (Math.abs(a1 * b2 - a2 * b1) < 0.001)
		{
				return null;
		}
		else
		{
				var determinant = a1 * b2 - a2 * b1;
				var x = (b2 * c1 - b1 * c2) / determinant;
				var y = (a1 * c2 - a2 * c1) / determinant;
				return {x: x, y: y};
		}
}

function isRay(point, point1, point2) {
	return (point.x > point1.x) === (point2.x > point1.x) && (point.y > point1.y) === (point2.y > point1.y)
}

function isBelongsToSegment(point, point1, point2) {
	if (point1.x > point2.x) {
		var temp = point1
		point1 = point2
		point2 = temp
	}
	if (point1.x === point2.x) {
		return point1.y < point.y && point.y < point2.y && point.x === point1.x;
	}
	var first = (point.x-point1.x)/(point2.x-point1.x); //-0.176666
	if (point1.y === point2.y) {
		return point1.x < point.x && point.x < point2.x && point.y === point1.y;
	}
	var second = (point.y-point1.y)/(point2.y-point1.y); //
	var flag = Math.abs(first - second) < 0.001
	if (flag) {
		if (point1.x < point.x && point.x < point2.x && point1.x < point2.x) {
			return true
		}
	}
	return false
}

function getLength(point1, point2) {
	return Math.sqrt((point2.x - point1.x) * (point2.x - point1.x) + (point2.y - point1.y) * (point2.y - point1.y))
}
