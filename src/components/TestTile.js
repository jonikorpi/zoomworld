import React from "react";

import { config, getSeed, baseTile, random } from "../utilities/graphics.js";
import { positionAtTime } from "../utilities/state.js";

export default class TestTile extends React.Component {
  static defaultProps = {
    subscribe: () => {},
    unsubscribe: () => {},
    x: 0,
    y: 0,
    state: {},
    events: [],
  };

  componentWillMount() {
    const { x, y } = this.props;

    this.mountedAt = performance.timing.navigationStart + performance.now();
    this.seed = getSeed(x, y);
    this.props.subscribe(this.update);
  }

  componentWillUnmount() {
    this.unmountedAt = performance.timing.navigationStart + performance.now();
    this.props.unsubscribe(this.update);
  }

  update = time => {
    const { x, y, state } = this.props;

    return {
      models: ["tileShade", "tile"],
      position: [x, y, 0],
      seed: this.seed,
      mountedAt: this.mountedAt,
      unmountedAt: this.unmountedAt,
    };
  };

  render() {
    return null;
  }
}
