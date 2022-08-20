const viewBox = (xMin, yMin, width, height) => {
  return {
    xMin: xMin,
    yMin: yMin,
    width: width,
    height: height,
    svg: `${xMin} ${yMin} ${width} ${height}`
  }
};

const offset = (viewBox, origin) => {
  const lcOrigin = origin.toLowerCase();
  if (lcOrigin === "bottom-left") {
    return {
      x: 0,
      y: viewBox.height
    };
  } else if (lcOrigin === "top-left") {
    return {
      x: 0,
      y: 0
    };
  } else if (lcOrigin === "center") {
    return {
      x: viewBox.width / 2,
      y: viewBox.height / 2
    };
  }
  return {
    x: 0,
    y: 0
  };
};

const cartesian2svg = (x, y, viewBox, offset) => {
  offset = {
    x: offset ? offset.x ? offset.x : 0 : 0,
    y: offset ? offset.y ? offset.y : 0 : 0
  };
  
  if (viewBox === undefined) {
    return {
      x: x + offset.x,
      y: -y + offset.y
    };
  } else {
    return {
      x: x + offset.x + viewBox.xMin,
      y: -y + offset.y + viewBox.yMin
    };
  }
};

const describePath = (points, viewBox, offset = {x:0, y:0}) => {
  if (!Array.isArray(points)) {
    throw new TypeError("An array of points must be provided");
  }
  if (points.length <= 1) {
    throw new TypeError("The array of points must contain at least 2 points")
  }
  if (viewBox) {
    for (let i=0; i<points.length; i++) {
      points[i] = cartesian2svg(points[i].x, points[i].y, viewBox, offset);
    }
  }
  let point = points.shift();
  const d = ["M", point.x, point.y];
  points.forEach(point => {
    d.push("L");
    d.push(point.x);
    d.push(point.y);
  });
  return d.join(" ");
};

const describeArc = (rx, ry, rotation, largeArc, sweep, x, y, viewBox, offset = {x: 0, y:0}) => {
  let end = {x: x, y: y};
  if (viewBox) {
    end = cartesian2svg(x, y, viewBox, offset);
  }
  const d = [
    "A", rx, ry, rotation, largeArc, sweep, end.x, end.y
  ];
  return d.join(" ");
};


module.exports = {
  viewBox: viewBox,
  offset: offset,
  cartesian2svg: cartesian2svg,
  describePath: describePath,
  describeArc: describeArc
}