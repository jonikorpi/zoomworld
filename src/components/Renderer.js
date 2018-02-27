import React from "react";
import startRegl from "regl";

import { positionAtTime } from "../utilities/state.js";

const clearConfiguration = {
  color: [0, 0, 0, 0],
};

export default class Renderer extends React.Component {
  static defaultProps = {
    state: { x: 0, y: 0, angle: 0 },
    events: [],
  };

  subscribers = [];
  regl = startRegl(document.getElementById("canvas"));
  loop = this.regl.frame(context => {
    const height = document.documentElement.clientHeight;
    const scrolled = window.pageYOffset;
    const scale = 1 - scrolled / height;
    const time = performance.timing.navigationStart + performance.now();
    const camera = positionAtTime(time, this.props.state, this.props.events);

    this.regl.clear(clearConfiguration);

    this.subscribers.forEach(callback => {
      callback.call(callback, time, camera, scale);
    });
  });

  componentWillUnmount() {
    this.loop.cancel();
    this.regl.destroy();
  }

  subscribe = callback => this.subscribers.push(callback);
  unsubscribe = id => this.subscribers.splice(id - 1, 1);

  render() {
    return this.props.children(this);
  }
}
