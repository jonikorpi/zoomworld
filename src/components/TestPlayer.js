import React from "react";

import { config, getSeed, baseTile, random } from "../utilities/graphics.js";
import { positionAtTime } from "../utilities/state.js";

export default class TestPlayer extends React.Component {
  static defaultProps = {
    subscribe: () => {},
    unsubscribe: () => {},
    registerCamera: null,
    unregisterCamera: null,
    onUpdate: null,
    playerID: "anonymous",
    state: { x: 0, y: 0 },
    events: [],
  };

  componentWillMount() {
    const { subscribe, registerCamera } = this.props;
    this.mountedAt = performance.timing.navigationStart + performance.now();
    subscribe(this.update);
    if (registerCamera) {
      registerCamera(this.update);
    }
  }

  componentWillUnmount() {
    const { unsubscribe, unregisterCamera } = this.props;
    this.unmountedAt = performance.timing.navigationStart + performance.now();
    unsubscribe(this.update);
    if (unregisterCamera) {
      unregisterCamera();
    }
  }

  update = time => {
    const { state, events, onUpdate } = this.props;
    const position = positionAtTime(time, state, events);

    if (onUpdate) {
      onUpdate(position);
    }

    return {
      models: ["player", "playerShade"],
      position: position,
      mountedAt: this.mountedAt,
      unmountedAt: this.unmountedAt,
    };
  };

  render() {
    return null;
  }
}
