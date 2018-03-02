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

  componentWillMount() {
    this.regl = startRegl({
      extensions: ["angle_instanced_arrays"],
      container: document.getElementById("canvas"),
    });

    this.loop = this.regl.frame(context => {
      try {
        const height =
          document.documentElement.offsetHeight - window.innerHeight;
        const scrolled = window.pageYOffset;
        const scale = 1 - scrolled / height + 0.146 * (scrolled / height);
        const time =
          performance.timing.navigationStart + performance.now() - 200;
        const camera = positionAtTime(
          time,
          this.props.state,
          this.props.events
        );

        this.regl.clear(clearConfiguration);

        this.subscribers.forEach(callback => {
          callback.call(callback, time, camera, scale);
        });
      } catch (error) {
        this.loop.cancel();
        throw error;
      }
    });
  }

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
