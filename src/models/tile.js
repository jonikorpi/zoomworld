import triangulate from "../utilities/triangulate.js";

const positions = triangulate([
  0,
  0,
  0.5,
  0,
  1,
  0,
  1,
  0.5,
  1,
  1,
  0.5,
  1,
  0,
  1,
  0,
  0.5,
]);

export default {
  positions: positions,
};
