import triangulate from "../utilities/triangulate.js";

const positions = triangulate([
  -0.5,
  -0.5,

  0,
  -0.5,

  0.5,
  -0.5,

  0.5,
  0,

  0.5,
  0.5,

  0,
  0.5,

  -0.5,
  0.5,

  -0.5,
  0,
]);

export default {
  positions: positions,
};
