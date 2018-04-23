import triangulate from "../utilities/triangulate.js";

const placeholderData = {
  positions: triangulate([-0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5]),
};
const squareData = {
  positions: triangulate([0, 0, 1, 0, 1, 1, 0, 1]),
};

let models = {
  placeholder: {
    data: placeholderData,
    color: [1, 1, 1, 1],
    primitive: "line loop",
    directionless: true,
  },
  destination: {
    data: "player",
    color: [1, 1, 1, 0.414],
    scale: 0.056,
    primitive: "line loop",
  },
  wake: {
    data: "player",
    color: [1, 1, 1, 0.854],
    scale: 0.146,
    primitive: "line strip",
  },
  tileShade: {
    data: "tile",
    color: [0.324854902, 0.462164706, 0.529145098, 1],
    z: -1,
    randomness: 0.12,
    scale: 1.15,
    directionless: true,
  },
  tile: {
    data: "tile",
    color: [0.236, 0.236, 0.236, 1],
    randomness: 0.12,
    scale: 1.15,
    directionless: true,
  },
  tileOutline: {
    data: squareData,
    color: [1, 1, 1, 1],
    primitive: "line loop",
    directionless: true,
  },
  wind: {
    data: {
      positions: [[0.75, 0], [-0.5, -0.5], [-0.5, 0.5]],
    },
    color: [1, 1, 1, 0.382],
    scale: 0.5,
    primitive: "line loop",
  },
  playerShade: {
    data: "player",
    color: [0, 0, 0, 0.146],
    z: -0.5,
    scale: 0.146,
  },
  player: {
    data: "player",
    color: [0.91, 0.91, 0.91, 1],
    scale: 0.146,
  },
};

const fetchModel = async name => {
  const modelToFetch = models[name].data;
  const data = await import(`../models/${modelToFetch}.js`);
  models[name].data = data.default;
};

const getModel = name => {
  if (typeof models[name].data === "string") {
    fetchModel(name);
    return {
      ...models["placeholder"],
      z: models[name].z,
    };
  } else {
    return models[name];
  }
};

const drawOrder = Object.keys(models).map(model => model);

export { getModel, drawOrder };
