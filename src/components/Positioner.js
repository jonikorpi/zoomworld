import React from "react";

import { angleLerp } from "../utilities/graphics.js";
import { positionAtTime } from "../utilities/state.js";

class Positioner extends React.Component {
  static defaultProps = {
    state: { x: 0, y: 0 },
    events: [],
    camera: {
      x: 0,
      y: 0,
      scale: 1,
      width: window.innerWidth,
      height: window.innerHeight,
      unit: 1,
    },
    distanceCulling: true,
    centered: true,
    translation: true,
  };

  currentAngle = 0;
  currentTransform = "";
  subscribers = [];

  componentDidMount() {
    this.props.loop.subscribe(this.update);
  }

  componentWillUnmount() {
    this.props.loop.unsubscribe(this.update);
  }

  update = now => {
    const {
      state,
      events,
      camera,
      onChange,
      distanceCulling,
      centered,
      translation,
    } = this.props;

    // Reduce events
    const actualState = positionAtTime(now, state, events);

    // New position
    const newX = actualState.x - camera.x;
    const newY = actualState.y - camera.y;
    const newScale = camera.scale;

    // New angle
    const nextAngle = actualState.angle;
    const newAngle =
      nextAngle !== 0
        ? angleLerp(this.currentAngle, nextAngle, 0.146)
        : this.currentAngle;

    // Distance culling
    const outsideX =
      distanceCulling &&
      (Math.abs(newX) - 2) * camera.unit > camera.width / 2 / newScale;
    const outsideY =
      distanceCulling &&
      (Math.abs(newY) - 2) * camera.unit > camera.height / 2 / newScale;

    // Transform string
    const transform =
      distanceCulling && (outsideX || outsideY)
        ? "scale(0)"
        : `
            ${centered ? "translate3d(-50%, -50%, 0)" : ""}
            scale(${newScale})
            ${translation ? `translate3d(${newX}vmax, ${newY}vmax, 0)` : ""}
            rotate(${newAngle}rad)
          `;

    // Update transforms
    const changed = transform !== this.currentTransform;

    if (changed && this.subscribers.length > 0) {
      this.updateTransforms(transform);
      this.currentTransform = transform;
    }

    // Callback
    if (onChange !== undefined) {
      onChange(actualState.x, actualState.y);
    }
  };

  subscribe = callback => this.subscribers.push(callback);
  unsubscribe = id => this.subscribers.splice(id - 1, 1);

  updateTransforms = transform => {
    this.subscribers.forEach(callback => {
      callback.call(callback, transform);
    });
  };

  render() {
    return this.props.children(this);
  }
}

export default Positioner;
