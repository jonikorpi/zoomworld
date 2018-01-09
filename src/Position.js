import React from "react";
import PropTypes from "prop-types";

// https://gist.github.com/gre/1650294
// const easing = t => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);
const easing = time => (1 + Math.sin(Math.PI * time - Math.PI / 2)) / 2;
const lerp = (current, target, time) => current * (1 - time) + target * time;

class Position extends React.Component {
  static contextTypes = {
    loop: PropTypes.object,
  };

  static defaultProps = {
    state: { x: 0, y: 0 },
    events: [],
    camera: { x: 0, y: 0, scale: 1 },
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
    const { state, events, camera, onChange } = this.props;
    let changed = false;
    const duration = 5000;
    const speed = 50;

    const actualState = events.reduce(
      (actualState, { type, time, data }) => {
        if (type !== "impulse") {
          return actualState;
        }

        const elapsed = now - time;
        const endsAt = time + duration;
        const completion = endsAt < now ? 1 : elapsed / duration;

        const velocityX = easing(completion) * speed * data.x;
        const velocityY = easing(completion) * speed * data.y;

        return {
          x: actualState.x + velocityX,
          y: actualState.y + velocityY,
          velocityX: velocityX,
          velocityY: velocityY,
        };
      },
      { x: state.x, y: state.y, velocityX: 0, velocityY: 0 }
    );

    const newX = actualState.x - camera.x;
    const newY = actualState.y - camera.y;
    const newAngle = lerp(
      this.currentAngle,
      Math.atan2(actualState.velocityY, actualState.velocityX),
      0.1
    );
    const newScale = camera.scale;

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
    if (this.currentAngle !== newAngle) {
      this.currentAngle = newAngle;
      this.element.style.setProperty("--angle", newAngle + "rad");
    }
    if (this.currentScale !== newScale) {
      this.currentScale = newScale;
      this.element.style.setProperty("--scale", newScale);
    }

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
