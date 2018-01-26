import React from "react";

import { angleLerp } from "../utilities/graphics.js";
import { positionAtTime } from "../utilities/state.js";

export default class Positioner extends React.Component {
  static defaultProps = {
    camera: {
      x: 0,
      y: 0,
      scale: 1,
      width: window.innerWidth,
      height: window.innerHeight,
      unit: 1,
      xUnitType: "vmin",
      yUnitType: "vmin",
      xPixelUnit: 1,
      yPixelUnit: 1,
    },
    distanceCulling: true,
    state: { x: 0, y: 0, angle: 0 },
    events: [],
    centered: true,
    translate: true,
    rotate: true,
    inverse: false,
    use3D: true,
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
      translate,
      rotate,
      use3D,
      inverse,
    } = this.props;

    // Reduce events
    const actualState = positionAtTime(now, state, events);

    // New position
    const newX = actualState.x - camera.x;
    const newY = actualState.y - camera.y;
    const newScale = camera.scale;

    // New angle
    const nextAngle = actualState.angle;
    // const newAngle =
    //   nextAngle !== 0
    //     ? angleLerp(this.currentAngle, nextAngle, 0.146)
    //     : this.currentAngle;
    const newAngle = angleLerp(this.currentAngle, nextAngle, 0.091);
    this.currentAngle = newAngle;

    // Distance culling
    const outsideX =
      distanceCulling &&
      (Math.abs(newX) - 1.75) * camera.xPixelUnit > camera.width / 2 / newScale;
    const outsideY =
      distanceCulling &&
      (Math.abs(newY) - 1.75) * camera.yPixelUnit >
        camera.height / 2 / newScale;

    const x = inverse
      ? `${-newX * camera.unit}${camera.xUnitType}`
      : `${newX * camera.unit}${camera.xUnitType}`;
    const y = inverse
      ? `${-newY * camera.unit}${camera.yUnitType}`
      : `${newY * camera.unit}${camera.yUnitType}`;
    const angle = inverse ? `${-newAngle}rad` : `${newAngle}rad`;

    const centering = centered
      ? use3D ? "translate3d(-50%, -50%, 0)" : "translate(-50%, -50%)"
      : "";
    const scaling = use3D
      ? `scale3d(${newScale}, ${newScale}, ${newScale})`
      : `scale(${newScale})`;
    const transform = translate
      ? use3D ? `translate3d(${x}, ${y}, 0)` : `translate(${x}, ${y})`
      : "";
    const rotation = rotate
      ? use3D ? `rotateZ(${angle})` : `rotate(${angle})`
      : "";

    // Transform string
    const newTransform =
      distanceCulling && (outsideX || outsideY)
        ? `scale3d(0,0,0)`
        : `${centering}${scaling}${transform}${rotation}`;

    // Update transforms
    const changed = newTransform !== this.currentTransform;

    if (changed && this.subscribers.length > 0) {
      this.updateTransforms(newTransform);
      this.currentTransform = newTransform;
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
