import React from "react";
import uuid4 from "uuid/v4";

import { positionAtTime } from "../utilities/state.js";
import { lerp, angleLerp } from "../utilities/graphics.js";

export default class Entity extends React.Component {
  static defaultProps = {
    renderer: {},
    shouldRegisterCamera: false,
    onUpdate: null,
    state: {
      time: Date.now(),
      validUntil: Date.now(),
      throttle: 0,
      wheel: 0,
      velocity: 0,
      turnVelocity: 0,
      weight: 0.1,
      drag: 0.5,
      windX: 0,
      windY: 0,
      x: 0,
      y: 0,
      angle: 0,
    },
    events: [],
    models: ["placeholder"],
    mayMove: true,
    timeOffset: 0,
    shouldLerp: false,
    positionGetter: positionAtTime,
  };

  ID = uuid4();

  componentWillMount() {
    const {
      renderer: { subscribe, registerCamera },
      shouldRegisterCamera,
    } = this.props;
    this.mountedAt = performance.timing.navigationStart + performance.now();
    subscribe(this.ID, this.update);
    if (shouldRegisterCamera) {
      registerCamera(this.update);
    }
  }

  componentWillUnmount() {
    const {
      renderer: { unsubscribe, unregisterCamera },
      shouldRegisterCamera,
    } = this.props;
    this.unmountedAt = performance.timing.navigationStart + performance.now();
    unsubscribe(this.ID);
    if (shouldRegisterCamera) {
      unregisterCamera();
    }
  }

  update = time => {
    const {
      state,
      events,
      onUpdate,
      mayMove,
      models,
      timeOffset,
      shouldLerp,
      positionGetter,
    } = this.props;
    const currentPosition = mayMove
      ? positionGetter(time + timeOffset, state, events)
      : [state.x, state.y, state.angle];

    const position =
      shouldLerp && this.lastPosition
        ? [
            lerp(this.lastPosition[0], currentPosition[0], 0.5),
            lerp(this.lastPosition[1], currentPosition[1], 0.5),
            angleLerp(this.lastPosition[2], currentPosition[2], 0.25),
          ]
        : currentPosition;

    if (onUpdate) {
      onUpdate(position);
    }

    this.lastPosition = position;

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
