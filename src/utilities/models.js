import triangulate from "../utilities/triangulate.js";

const placeholderPositions = triangulate([
  -0.5,
  -0.5,
  0.5,
  -0.5,
  0.5,
  0.5,
  -0.5,
  0.5,
]);

let models = {
  placeholder: {
    data: {
      positions: placeholderPositions,
    },
    color: [1, 1, 1, 1],
    primitive: "line loop",
    z: 0,
  },
  tileShade: {
    data: "tile",
    color: [0.236, 0.236, 0.236, 1],
    z: -1,
  },
  tile: {
    data: "tile",
    color: [1, 1, 1, 1],
    z: 0,
  },
  playerShade: {
    data: "player",
    color: [0.382, 0.382, 0.382, 1],
    z: -1,
    scale: 0.125,
  },
  player: {
    data: "player",
    color: [0, 0, 0, 1],
    z: 0,
    scale: 0.125,
  },
};

const fetchModel = name => {
  const modelToFetch = models[name].data;
  import(`../models/${modelToFetch}.js`).then(
    module => (models[name].data = module.default)
  );
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
