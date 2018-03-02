import React from "react";
import startRegl from "regl";

import { positionAtTime } from "../utilities/state.js";
import { baseTile, getSeed } from "../utilities/graphics.js";
import triangulate from "../utilities/triangulate.js";

const models = {
  tile: {
    data: {
      positions: triangulate(baseTile(getSeed(123, 456))),
      color: [1, 1, 1, 1],
    },
    z: 0,
  },
  player: {
    data: {
      positions: [[0.25, 0], [-0.125, -0.125], [-0.125, 0.125]],
      color: [1, 1, 1, 1],
    },
    z: 0,
  },
};

const drawOrder = Object.keys(models).map(model => model);
const orderByY = (a, b) => (a.position.y > b.position.y ? 1 : -1);

const createModelLists = (lists, { models, ...entity }) => {
  models.forEach(model => {
    lists[model] = lists[model] || [];
    lists[model].push(entity);
  });
  return lists;
};

const config = {
  unitSize: 14.6,
  unitType: "vmin",
  perspective: 0.0382,
};

const clearConfiguration = {
  color: [0, 0, 0, 0],
};

export default class Renderer extends React.Component {
  static defaultProps = {
    state: { x: 0, y: 0, angle: 0 },
    events: [],
  };

  subscribers = [];
  subscribe = callback => this.subscribers.push(callback);
  unsubscribe = id => this.subscribers.splice(id - 1, 1);

  regl = startRegl({
    extensions: ["angle_instanced_arrays"],
    container: document.getElementById("canvas"),
  });

  componentWillUnmount() {
    this.loop.cancel();
    this.regl.destroy();
  }

  drawLoop = context => {
    try {
      const time = performance.timing.navigationStart + performance.now() - 200;
      const camera = positionAtTime(time, this.props.state, this.props.events);
      const height = document.documentElement.offsetHeight - window.innerHeight;
      const scrolled = window.pageYOffset;
      const scale = 1 - scrolled / height + 0.146 * (scrolled / height);

      const modelLists = this.subscribers
        .map(callback => callback.call(callback, time))
        .sort(orderByY)
        .reduce(createModelLists, {});

      const drawCalls = [];
      drawOrder.forEach(name => {
        const list = modelLists[name];

        if (list.length === 0) {
          return;
        }

        drawCalls.push({
          time,
          camera,
          scale,
          positions: models[name].data.positions,
          color: models[name].data.color,
          z: models[name].z,
          offsets: list.map(({ position }) => position),
          seeds: list.map(({ seed }) => seed),
          // mountedTimes: list.map(({mountedAt}) => mountedAt),
          // unmountedTimes: list.map(({unmountedAt}) => unmountedAt),
          instances: list.length,
        });
      });

      this.regl.clear(clearConfiguration);
      this.drawModels(drawCalls);
    } catch (error) {
      this.loop.cancel();
      throw error;
    }
  };

  loop = this.regl.frame(this.drawLoop);

  drawModels = this.regl({
    frag: `
      precision mediump float;

      varying vec4 outputColor;

      void main() {
        gl_FragColor = outputColor;
      }`,

    vert: `
      precision mediump float;
      uniform float viewportWidth;
      uniform float viewportHeight;
      uniform float unit;
      uniform float perspective;
      uniform vec2 camera;
      uniform vec4 color;
      uniform float z;

      attribute vec2 position;
      attribute vec4 offset;
      attribute float seed;

      varying vec4 outputColor;

      void main() {
        vec2 translation = vec2(offset[0], offset[1]);
        float angle = offset[3];

        vec2 rotatedPosition = vec2(
          position[0] * cos(angle) - position[1] * sin(angle),
          position[1] * cos(angle) + position[0] * sin(angle)
        );
        vec2 translatedPosition = rotatedPosition + translation - camera;
        vec2 shiftedPosition = vec2(
          translatedPosition[0],
          translatedPosition[1] + perspective * offset[2]
        );
        vec2 scaledPosition = vec2(
          (shiftedPosition[0] * unit) / viewportWidth,
          (shiftedPosition[1] * unit) / viewportHeight
        );
        gl_Position = vec4(scaledPosition, 0, 1);
        float shade = 0.0 + offset[2] / 3.0;
        outputColor = color;
      }`,

    attributes: {
      position: (context, { positions }) => positions,
      offset: (context, { offsets }) => ({
        buffer: offsets,
        divisor: 1,
      }),
      seed: (context, { seeds }) => ({
        buffer: seeds,
        divisor: 1,
      }),
    },
    count: (context, { positions }) => positions.length,
    instances: (context, { instances }) => instances / 10,

    uniforms: {
      viewportWidth: ({ viewportWidth }) => viewportWidth,
      viewportHeight: ({ viewportHeight }) => viewportHeight,
      unit: ({ viewportWidth, viewportHeight }, { scale }) =>
        Math.min(viewportWidth, viewportHeight) * config.unitSize / 50 * scale,
      camera: (context, { camera }) => [camera.x, camera.y],
      perspective: config.perspective,
      color: (context, { color }) => color,
      z: (context, { z }) => z,
    },
    depth: {
      enable: false,
    },
  });

  render() {
    return this.props.children(this);
  }
}
