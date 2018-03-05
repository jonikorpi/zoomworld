import { baseTile, getSeed } from "../utilities/graphics.js";
import triangulate from "../utilities/triangulate.js";

const positions = triangulate(baseTile(getSeed(123, 456)));

export default {
  positions: positions,
};