import triangulate from "../utilities/triangulate.js";

const placeholderPositions = triangulate([0, 0, 1, 0, 1, 1, 0, 1]);

let models = {
  placeholder: {
    data: {
      positions: placeholderPositions,
      color: [0, 0, 0, 0.5],
    },
    z: 0,
  },
  tileShade: {
    z: -1,
  },
  playerShade: {
    z: -1,
  },
  tile: {
    z: 0,
  },
  player: {
    z: 0,
  },
};

const fetchModel = name =>
  import(`../models/${name}.js`).then(
    module => (models[name].data = module.default)
  );

const getModel = name => {
  if (models[name].data) {
    return models[name];
  } else {
    fetchModel(name);

    return {
      ...models[name],
      data: models["placeholder"].data,
    };
  }
};

const drawOrder = Object.keys(models).map(model => model);

export { getModel, drawOrder };
