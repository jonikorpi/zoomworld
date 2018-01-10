import React from "react";
import PropTypes from "prop-types";

// https://gist.github.com/gre/1650294
// const easing = t => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);
const easing = time => (1 + Math.sin(Math.PI * time - Math.PI / 2)) / 2;

// https://gist.github.com/shaunlebron/8832585
const shortAngleDist = (current, target) => {
  const max = Math.PI * 2;
  const da = (target - current) % max;
  return (2 * da) % max - da;
};
const angleLerp = (current, target, time) =>
  current + shortAngleDist(current, target) * time;
const lerp = (current, target, time) => current * (1 - time) + target * time;

class Position extends React.Component {
  static contextTypes = {
    loop: PropTypes.object,
  };

  static defaultProps = {
    state: { x: 0, y: 0 },
    events: [],
    camera: {
      x: 0,
      y: 0,
      scale: 1,
      width: window.innerWidth,
      height: window.innerHeight,
      unit: Math.max(window.innerWidth / 100, window.innerHeight / 100),
    },
    distanceCulling: true,
  };

  currentX = 0;
  currentY = 0;
  currentAngle = 0;
  currentScale = 1;

  componentDidMount() {
    this.context.loop.subscribe(this.update);
  }

  componentWillUnmount() {
    this.context.loop.unsubscribe(this.update);
  }

  update = now => {
    const { state, events, camera, onChange, distanceCulling } = this.props;
    const { speed } = state;
    let changed = false;

    // Reduce events
    const actualState = events.reduce(
      (actualState, { type, time, duration, data }) => {
        if (type !== "impulse") {
          return actualState;
        }

        const elapsed = now - time;
        const endsAt = time + duration;
        const completion = endsAt < now ? 1 : elapsed / duration;
        const completed = completion === 1;

        return {
          x: actualState.x + easing(completion) * speed * data.x,
          y: actualState.y + easing(completion) * speed * data.y,
          velocityX: actualState.velocityX + (completed ? 0 : speed * data.x),
          velocityY: actualState.velocityY + (completed ? 0 : speed * data.y),
        };
      },
      { x: state.x, y: state.y, velocityX: 0, velocityY: 0 }
    );

    // New values
    const newX = actualState.x - camera.x;
    const newY = actualState.y - camera.y;
    const newScale = camera.scale;

    // Distance culling
    if (distanceCulling) {
      const outsideX =
        Math.abs(newX) * camera.unit > camera.width / 2 / newScale;
      const outsideY =
        Math.abs(newY) * camera.unit > camera.height / 2 / newScale;

      if (outsideX || outsideY) {
        if (this.currentScale !== 0) {
          this.currentScale = 0;
          this.element.style.setProperty("--scale", 0);
        }

        return;
      }
    }

    // Calculate angle
    const nextAngle = Math.atan2(actualState.velocityY, actualState.velocityX);
    // const newAngle = nextAngle;
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
    return (
      <div
        className="position"
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
