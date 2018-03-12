import React from "react";
import startRegl from "regl";
import * as models from "../shaders/models.shader.js";

import { getModel, drawOrder } from "../models/models.js";

// const orderByY = (a, b) => (a.position.y > b.position.y ? 1 : -1);

const createModelLists = (lists, { models, ...entity }) => {
  models.forEach(model => {
    lists[model] = lists[model] || [];
    lists[model].push(entity);
  });
  return lists;
};

const config = {
  unitSize: 38.2,
  perspective: 0.0382,
};

const clearConfiguration = {
  color: [0, 0, 0, 0],
};

const getDefaultCamera = () => [0, 0];

export default class Renderer extends React.Component {
  subscribers = {};
  subscribe = (subscriberID, callback) =>
    (this.subscribers[subscriberID] = callback);
  unsubscribe = subscriberID => delete this.subscribers[subscriberID];
  getCamera = getDefaultCamera;
  registerCamera = callback => (this.getCamera = callback);
  unregisterCamera = callback => (this.getCamera = getDefaultCamera);

  regl = startRegl({
    extensions: ["angle_instanced_arrays"],
    container: document.getElementById("canvas"),
  });

  componentWillUnmount() {
    this.loop.cancel();
    this.regl.destroy();
  }

  drawLoop = ({ viewportWidth, viewportHeight }) => {
    try {
      const time = performance.timing.navigationStart + performance.now();
      const camera = this.getCamera(time).position;
      const height = document.documentElement.offsetHeight - window.innerHeight;
      const scrolled = window.pageYOffset;
      const scale = 1 - scrolled / height + 0.146 * (scrolled / height);
      const xRatio = Math.max(1, viewportWidth / viewportHeight) * 50;
      const yRatio = Math.max(1, viewportHeight / viewportWidth) * 50;
      const unit =
        Math.min(viewportWidth, viewportHeight) * config.unitSize / 50 * scale;

      const modelLists = Object.values(this.subscribers)
        .map(callback => callback.call(callback, time))
        .filter(
          ({ position }) =>
            Math.abs(position[0] - camera[0]) - 1 <
              xRatio / config.unitSize / scale &&
            Math.abs(position[1] - camera[1]) - 1 <
              yRatio / config.unitSize / scale
        )
        // .sort(orderByY)
        .reduce(createModelLists, {});

      const drawCalls = drawOrder
        .filter(name => modelLists[name] && modelLists[name].length > 0)
        .map(name => {
          const list = modelLists[name];
          const model = getModel(name);

          return {
            time,
            camera,
            unit,
            positions: model.data.positions,
            color: model.color,
            z: model.z || 0,
            primitive: model.primitive || "triangles",
            offsets: list.map(({ position }) => [
              position[0],
              position[1],
              model.directionless ? 0 : position[2],
              model.scale || 1,
            ]),
            randomness: model.randomness || 0,
            // mountedTimes: list.map(({mountedAt}) => mountedAt),
            // unmountedTimes: list.map(({unmountedAt}) => unmountedAt),
            instances: list.length,
          };
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
    frag: models.fragmentShader,
    vert: models.vertexShader,

    attributes: {
      position: (context, { positions }) => positions,
      offset: (context, { offsets }) => ({
        buffer: offsets,
        divisor: 1,
      }),
    },
    count: (context, { positions }) => positions.length,
    instances: (context, { instances }) => instances,
    primitive: (context, { primitive }) => primitive,

    uniforms: {
      viewportWidth: ({ viewportWidth }) => viewportWidth,
      viewportHeight: ({ viewportHeight }) => viewportHeight,
      unit: (context, { unit }) => unit,
      camera: (context, { camera }) => camera,
      perspective: config.perspective,
      color: (context, { color }) => color,
      z: (context, { z }) => z,
      randomness: (context, { randomness }) => randomness,
    },
    blend: {
      enable: true,
      func: {
        srcRGB: "src alpha",
        srcAlpha: 1,
        dstRGB: "one minus src alpha",
        dstAlpha: 1,
      },
    },
    depth: {
      enable: false,
    },
  });

  render() {
    return this.props.children(this);
  }
}
