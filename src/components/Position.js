import React from "react";

import { angleLerp } from "../utilities/graphics.js";
import { positionAtTime } from "../utilities/state.js";

class Position extends React.Component {
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
  };

  currentX = 0;
  currentY = 0;
  currentAngle = 0;
  currentScale = 1;

  componentDidMount() {
    this.props.loop.subscribe(this.update);
  }

  componentWillUnmount() {
    this.props.loop.unsubscribe(this.update);
  }

  update = now => {
    const { state, events, camera, onChange, distanceCulling } = this.props;
    let changed = false;

    // Reduce events
    const actualState = positionAtTime(now, state, events);

    // New values
    const newX = actualState.x - camera.x;
    const newY = actualState.y - camera.y;
    const newScale = camera.scale;

    // Distance culling
    if (distanceCulling) {
      const outsideX =
        (Math.abs(newX) - 2) * camera.unit > camera.width / 2 / newScale;
      const outsideY =
        (Math.abs(newY) - 2) * camera.unit > camera.height / 2 / newScale;

      if (outsideX || outsideY) {
        if (this.currentScale !== 0) {
          this.currentScale = 0;
          this.element.style.setProperty("--scale", 0);
        }

        return;
      }
    }

    // Calculate angle
    const nextAngle = actualState.angle;
    const newAngle = angleLerp(this.currentAngle, nextAngle, 0.146);

    // Update properties
    if (this.currentX !== newX) {
      this.currentX = newX;
      this.element.style.setProperty("--x", newX);
      changed = true;
    }
    if (this.currentY !== newY) {
      this.currentY = newY;
      this.element.style.setProperty("--y", newY);
      changed = true;
    }
    if (this.currentAngle !== newAngle && nextAngle !== 0) {
      this.currentAngle = newAngle;
      this.element.style.setProperty("--angle", newAngle + "rad");
    }
    if (this.currentScale !== newScale) {
      this.currentScale = newScale;
      this.element.style.setProperty("--scale", newScale);
    }

    // Callback
    if (onChange !== undefined && changed) {
      onChange({ x: actualState.x, y: actualState.y });
    }
  };

  render() {
    const { centered } = this.props;

    return (
      <div
        className={`position ${centered ? "centered" : ""}`}
        ref={element => {
          this.element = element;
        }}
      >
        {this.props.children}
      </div>
    );
  }
}

export default Position;
