import React from "react";

import { positionAtTime } from "../utilities/state.js";

export default class Entity extends React.Component {
  static defaultProps = {
    subscribe: () => {},
    unsubscribe: () => {},
    registerCamera: null,
    unregisterCamera: null,
    onUpdate: null,
    state: { x: 0, y: 0, angle: 0 },
    events: [],
    models: ["placeholder"],
    mayMove: true,
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
    const { state, events, onUpdate, mayMove, models } = this.props;
    const position = mayMove
      ? positionAtTime(time, state, events)
      : [state.x, state.y, state.angle];

    if (onUpdate) {
      onUpdate(position);
    }

    return {
      models: models,
      position: position,
      // mountedAt: this.mountedAt,
      // unmountedAt: this.unmountedAt,
    };
  };

  render() {
    return null;
  }
}
