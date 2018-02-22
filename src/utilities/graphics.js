const config = {
  tileSize: 256,
  tileCanvasMultiplier: 2,
  waterLevel: 0,
  groundLevel: 2,
  shroudLevel: 20,
  shroudThickness: 1,
  unitSize: 9,
  unitType: "vmin",
};

const random = (number = 1, seed = 1) => {
  const rand = Math.sin(seed) * 10000;
  return Math.abs((rand - Math.floor(rand)) * number);
};

const getSeed = (x, y) => {
  return Math.abs((x + 11) * 13 * ((y + 7) * 53));
};

const baseTile = inputSeed => {
  let seed = inputSeed;
  const baseCoordinate = config.tileSize / 2;
  const radius = config.tileSize / 13;

  const cornerDirections = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
  const lineDirections = [[1, 0], [0, 1], [-1, 0], [0, -1]];

  const corners = cornerDirections
    .map(direction => [
      // Spread into rectangle
      direction[0] * baseCoordinate,
      direction[1] * baseCoordinate,
    ])
    .map((corner, index) => [
      // Push corners
      corner[0] + radius * cornerDirections[index][0] * random(1, seed++),
      corner[1] + radius * cornerDirections[index][1] * random(1, seed++),
    ]);

  // Add randomly offset points along the edges
  const shape = corners.reduce((points, corner, cornerIndex) => {
    points.push(corner);
    const pointCount = 2 + Math.floor(random(5, seed++));

    const pointsAlongLine = [...Array(pointCount)].map((nada, index) => {
      const alongLine = config.tileSize / pointCount * index + 1;
      const away = random(radius, seed++);
      const x = lineDirections[cornerIndex][0]
        ? alongLine * lineDirections[cornerIndex][0]
        : away * cornerDirections[cornerIndex][0];
      const y = lineDirections[cornerIndex][1]
        ? alongLine * lineDirections[cornerIndex][1]
        : away * cornerDirections[cornerIndex][1];

      return [corner[0] + x, corner[1] + y];
    });

    return points.concat(pointsAlongLine);
  }, []);

  return shape;
};

// https://gist.github.com/gre/1650294
// const easing = t => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);
const easing = time => (1 + Math.sin(Math.PI * time - Math.PI / 2)) / 2;

// https://gist.github.com/shaunlebron/8832585
const shortAngleDist = (current, target) => {
  const max = Math.PI * 2;
  const da = (target - current) % max;
  return (2 * da) % max - da;
};
const angleLerp = (current, target, time) =>
  current + shortAngleDist(current, target) * time;
const lerp = (current, target, time) => current * (1 - time) + target * time;

export {
  config,
  random,
  getSeed,
  baseTile,
  easing,
  shortAngleDist,
  angleLerp,
  lerp,
};
