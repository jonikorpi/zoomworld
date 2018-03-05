import React from "react";
import startRegl from "regl";

import { getModel, drawOrder } from "../utilities/models.js";

const orderByY = (a, b) => (a.position.y > b.position.y ? 1 : -1);

const createModelLists = (lists, { models, ...entity }) => {
  models.forEach(model => {
    lists[model] = lists[model] || [];
    lists[model].push(entity);
  });
  return lists;
};

const config = {
  unitSize: 20,
  unitType: "vmin",
  perspective: 0.0382,
};

const clearConfiguration = {
  color: [0, 0, 0, 0],
};

const getDefaultCamera = () => [0, 0];

export default class Renderer extends React.Component {
  subscribers = [];
  subscribe = callback => this.subscribers.push(callback);
  unsubscribe = id => this.subscribers.splice(id - 1, 1);
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

  drawLoop = context => {
    try {
      const time = performance.timing.navigationStart + performance.now() - 200;
      const camera = this.getCamera(time).position;
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
        const model = getModel(name);

        if (!list || list.length === 0) {
          return;
        }

        drawCalls.push({
          time,
          camera,
          scale,
          positions: model.data.positions,
          color: model.color,
          z: model.z,
          lineWidth: model.lineWidth || 1,
          primitive: model.primitive || "triangles",
          offsets: list.map(({ position }) => [...position, model.scale || 1]),
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
      uniform vec3 camera;
      uniform vec4 color;
      uniform float z;

      attribute vec2 position;
      attribute vec4 offset;
      attribute float seed;

      varying vec4 outputColor;

      vec2 cameraTranslation = vec2(camera[0], camera[1]);
      float cameraAngle = camera[2];

      void main() {
        vec2 translation = vec2(offset[0], offset[1]);
        float angle = offset[2];
        float modelScale = offset[3];

        vec2 scaledPosition = vec2(
          position[0] * modelScale,
          position[1] * modelScale
        );
        vec2 rotatedPosition = vec2(
          scaledPosition[0] * cos(angle) - scaledPosition[1] * sin(angle),
          scaledPosition[1] * cos(angle) + scaledPosition[0] * sin(angle)
        );
        vec2 translatedPosition = rotatedPosition + translation - cameraTranslation;
        vec2 shiftedPosition = vec2(
          translatedPosition[0],
          translatedPosition[1] + perspective * z
        );
        vec2 cameraScaledPosition = vec2(
          unit / viewportWidth * shiftedPosition[0],
          unit / viewportHeight * shiftedPosition[1]
        );

        gl_Position = vec4(cameraScaledPosition, 0, 1);
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
    instances: (context, { instances }) => instances,
    primitive: (context, { primitive }) => primitive,
    lineWidth: (context, { lineWidth }) => lineWidth,

    uniforms: {
      viewportWidth: ({ viewportWidth }) => viewportWidth,
      viewportHeight: ({ viewportHeight }) => viewportHeight,
      unit: ({ viewportWidth, viewportHeight }, { scale }) =>
        Math.min(viewportWidth, viewportHeight) * config.unitSize / 50 * scale,
      camera: (context, { camera }) => camera,
      perspective: config.perspective,
      color: (context, { color }) => color,
      z: (context, { z }) => z,
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
