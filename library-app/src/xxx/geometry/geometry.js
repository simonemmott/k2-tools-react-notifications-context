const deg2rad = (deg) => {
  return deg * Math.PI / 180.0;
};

const rad2deg = (rad) => {
  return rad * 180.0 / Math.PI;
};

const polar2cartesian = (radius, deg) => {
  const rad = deg2rad(deg);

  return {
    x: radius * Math.cos(rad),
    y: radius * Math.sin(rad)
  };
};

const cartesian2polar = (x, y) => {
  const radius = Math.pow(Math.pow(x,2) + Math.pow(y,2), 0.5);
  const rad = Math.asin(y / radius);

  return {
    radius: radius,
    deg: rad2deg(rad)
  };
};


module.exports = {
  polar2cartesian: polar2cartesian,
  cartesian2polar: cartesian2polar,
  deg2rad: deg2rad,
  rad2deg: rad2deg
}