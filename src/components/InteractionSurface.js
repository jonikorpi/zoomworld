import React from "react";
import throttle from "lodash.throttle";

import { config } from "../utilities/graphics.js";

const createEvent = (value, type) => {
  return {
    [type]: {
      set: value,
    },
  };
};

const getDimensionSize = () => Math.min(window.innerHeight, window.innerWidth);
const pointsToValue = points => points / (getDimensionSize() / 300);
const clampValue = value => Math.round(Math.max(-100, Math.min(100, value)));
// const dragFactor = 0.91;

class InteractionSurface extends React.Component {
  static defaultProps = {
    addEvent: () => {},
  };

  wheel = 0;
  wheelVelocity = 0;
  throttle = 0;
  throttleVelocity = 0;
  movingSince = null;
  lockedToAxis = null;
  startedAt = [0, 0];
  lastMoveAt = [0, 0];

  componentDidMount() {
    this.loop = requestAnimationFrame(this.update);
    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp);
    window.addEventListener("touchmove", this.handleTouchMove, {
      passive: false,
    });
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.loop);
    window.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("keyup", this.handleKeyUp);
    window.removeEventListener("touchmove", this.handleTouchMove);
  }

  update = () => {
    const { wheel, wheelVelocity, throttle, throttleVelocity } = this;

    // if (Math.abs(wheelVelocity) > 0) {
    //   this.wheel = clampValue(wheel + wheelVelocity);
    //   this.wheelVelocity = wheelVelocity * dragFactor;
    // }

    // if (Math.abs(throttleVelocity) > 0) {
    //   this.throttle = clampValue(throttle + throttleVelocity);
    //   this.throttleVelocity = throttleVelocity * dragFactor;
    // }

    if (+this.wheelElement.value !== this.wheel) {
      this.wheelElement.value = this.wheel;
      this.addEvent(createEvent(this.wheel / 100, "wheel"));
    }
    if (+this.throttleElement.value !== this.throttle) {
      this.throttleElement.value = this.throttle;
      this.addEvent(createEvent(this.throttle / 100, "throttle"));
    }

    this.loop = requestAnimationFrame(this.update);
  };

  handleTouchStart = event => {
    this.startMoving(event.touches[0].clientX, event.touches[0].clientY);
  };
  handleMouseDown = ({ nativeEvent }) =>
    this.startMoving(nativeEvent.clientX, nativeEvent.clientY);

  handleTouchMove = event => {
    if (event.target.id === "interactionSurface") {
      event.preventDefault();

      if (this.movingSince) {
        this.moveBy(event.touches[0].clientX, event.touches[0].clientY);
      }
    }
  };
  handleMouseMove = ({ nativeEvent }) => {
    if (this.movingSince) {
      this.moveBy(nativeEvent.clientX, nativeEvent.clientY);
    }
  };

  handleTouchCancel = () => this.stopMoving();
  handleMouseOut = () => this.stopMoving();

  handleTouchEnd = () => this.applyVelocity();
  handleMouseUp = () => this.applyVelocity();

  handleKeyDown = ({ nativeEvent }) => {};
  handleKeyUp = ({ nativeEvent }) => {};

  startMoving = (x, y) => {
    this.movingSince = Date.now();
    this.startedAt[0] = x;
    this.startedAt[1] = y;
    this.lastMoveAt[0] = x;
    this.lastMoveAt[1] = y;
    this.wheelVelocity = 0;
    this.throttleVelocity = 0;
  };
  moveBy = (x, y) => {
    if (!this.lockedToAxis) {
      const totalWheel = Math.abs(x - this.startedAt[0]);
      const totalThrottle = Math.abs(y - this.startedAt[1]);

      if (totalThrottle > 10) {
        this.lockedToAxis = "throttle";
      } else if (totalWheel > 10) {
        this.lockedToAxis = "wheel";
      }
    }

    if (this.lockedToAxis === "wheel") {
      const wheel = x - this.lastMoveAt[0];
      this.wheel = clampValue(this.wheel + pointsToValue(wheel));
    } else if (this.lockedToAxis === "throttle") {
      const throttle = y - this.lastMoveAt[1];
      this.throttle = clampValue(this.throttle - pointsToValue(throttle));
    }

    this.lastMoveAt[0] = x;
    this.lastMoveAt[1] = y;
  };
  applyVelocity = () => {
    // const elapsed = (Date.now() - this.movingSince) / 1000;

    // if (elapsed > 0.5) {
    //   const wheelMoved = this.lastMoveAt[0] - this.startedAt[0];
    //   const throttleMoved = this.lastMoveAt[1] - this.startedAt[1];
    //   const wheelVelocityChange = wheelMoved / elapsed;
    //   const throttleVelocityChange = throttleMoved / elapsed;

    //   if (this.lockedToAxis === "wheel" && Math.abs(wheelVelocityChange) > 10) {
    //     this.wheelVelocity += pointsToValue(wheelVelocityChange);
    //   } else if (
    //     this.lockedToAxis === "throttle" &&
    //     Math.abs(throttleVelocityChange) > 10
    //   ) {
    //     this.throttleVelocity -= pointsToValue(throttleVelocityChange);
    //   }
    // }

    this.stopMoving();
  };
  stopMoving = () => {
    this.movingSince = null;
    this.lockedToAxis = null;
    this.startedAt[0] = 0;
    this.startedAt[1] = 0;
    this.lastMoveAt[0] = 0;
    this.lastMoveAt[1] = 0;
  };

  addEvent = throttle(this.props.addEvent, 200, { leading: false });

  render() {
    return (
      <div id="interaction" onMouseOut={this.handleMouseOut}>
        <input
          type="range"
          min="-100"
          max="100"
          defaultValue="0"
          id="throttle"
          ref={ref => (this.throttleElement = ref)}
        />
        <input
          type="range"
          min="-100"
          max="100"
          defaultValue="0"
          id="wheel"
          ref={ref => (this.wheelElement = ref)}
        />
        <button
          type="button"
          id="interactionSurface"
          onTouchStart={this.handleTouchStart}
          onTouchEnd={this.handleTouchEnd}
          onTouchCancel={this.handleTouchCancel}
          onMouseDown={this.handleMouseDown}
          onMouseUp={this.handleMouseUp}
          onMouseMove={this.handleMouseMove}
        />
      </div>
    );
  }
}

export default InteractionSurface;
