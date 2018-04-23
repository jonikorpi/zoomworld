import React from "react";
import uuid4 from "uuid/v4";

import { stateAtTime } from "../utilities/state.js";
import { lerp, angleLerp } from "../utilities/graphics.js";

export default class Entity extends React.Component {
  static defaultProps = {
    renderer: {},
    shouldRegisterCamera: false,
    onUpdate: null,
    state: {},
    events: [],
    models: ["placeholder"],
    mayMove: true,
    timeOffset: 0,
    positionGetter: stateAtTime,
  };

  ID = uuid4();
  stateObject = { position: [] };

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
      positionGetter,
    } = this.props;
    const { stateObject } = this;
    const position = mayMove
      ? positionGetter(time + timeOffset, state, events)
      : state;

    stateObject.position[0] = position.x;
    stateObject.position[1] = position.y;
    stateObject.position[2] = position.angle;
    stateObject.models = models;

    if (onUpdate) {
      onUpdate(stateObject);
    }

    return stateObject;
  };

  render() {
    return null;
  }
}
