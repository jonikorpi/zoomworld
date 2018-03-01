import earcut from "earcut";

export default (points, dimensions = 2) =>
  earcut(points).map(index => [
    points[index * dimensions],
    points[index * dimensions + 1],
  ]);
