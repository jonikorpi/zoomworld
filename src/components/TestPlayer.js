import React from "react";

import { config, getSeed, baseTile, random } from "../utilities/graphics.js";
import { positionAtTime } from "../utilities/state.js";

export default class TestPlayer extends React.Component {
  static defaultProps = {
    subscribe: () => {},
    unsubscribe: () => {},
    playerID: "anonymous",
    state: { x: 0, y: 0 },
    events: [],
  };

  componentWillMount() {
    const { playerID } = this.props;

    this.mountedAt = performance.timing.navigationStart + performance.now();
    this.seed = Math.ceil(Math.random() * 1000);
    this.props.subscribe(this.update);
  }

  componentWillUnmount() {
    this.unmountedAt = performance.timing.navigationStart + performance.now();
    this.props.unsubscribe(this.update);
  }

  update = time => {
    const { state, events } = this.props;

    return {
      models: ["player"],
      position: positionAtTime(time, state, events),
      seed: this.seed,
      mountedAt: this.mountedAt,
      unmountedAt: this.unmountedAt,
    };
  };

  render() {
    return null;
  }
}
