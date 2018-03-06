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
    z: 0,
  },
  tileShade: {
    data: "tile",
    color: [0.324854902, 0.462164706, 0.529145098, 1],
    z: -1,
    randomness: 0.12,
    scale: 1.15,
  },
  tile: {
    data: "tile",
    color: [0.236, 0.236, 0.236, 1],
    z: 0,
    randomness: 0.12,
    scale: 1.15,
  },
  tileOutline: {
    data: squareData,
    color: [1, 1, 1, 1],
    primitive: "line loop",
    z: 0,
  },
  playerShade: {
    data: "player",
    color: [0, 0, 0, 0.146],
    z: -1,
    scale: 0.125,
  },
  player: {
    data: "player",
    color: [0.91, 0.91, 0.91, 1],
    z: 0,
    scale: 0.125,
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
