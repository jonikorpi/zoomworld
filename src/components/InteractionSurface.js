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

const pointsToValue = points => points / 1;
const clampValue = value => Math.max(-100, Math.min(100, value));

class InteractionSurface extends React.Component {
  static defaultProps = {
    addEvent: () => {},
  };

  wheel = 0;
  wheelVelocity = 0;
  throttle = 0;
  throttleVelocity = 0;
  movingSince = null;
  startedAt = [0, 0];
  lastMoveAt = [0, 0];

  componentDidMount() {
    this.loop = requestAnimationFrame(this.update);
    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp);
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.loop);
  }

  update = () => {
    const { wheel, wheelVelocity, throttle, throttleVelocity } = this;

    if (Math.abs(wheelVelocity) > 0) {
      this.wheel = clampValue(wheel + wheelVelocity);
      this.wheelVelocity =
        Math.abs(wheelVelocity) > 1 ? wheelVelocity * 0.95 : 0;
    }

    if (Math.abs(throttleVelocity) > 0) {
      this.throttle = clampValue(throttle + throttleVelocity);
      this.throttleVelocity =
        Math.abs(throttleVelocity) > 1 ? throttleVelocity * 0.95 : 0;
    }

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
    event.preventDefault();
    this.startMoving(event.touches[0].clientX, event.touches[0].clientY);
  };
  handleMouseDown = ({ nativeEvent }) =>
    this.startMoving(nativeEvent.clientX, nativeEvent.clientY);

  handleTouchMove = event => {
    event.preventDefault();
    event.stopPropagation();
    if (this.movingSince) {
      this.moveBy(event.touches[0].clientX, event.touches[0].clientY);
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
    this.wheel = clampValue(this.wheel + pointsToValue(x - this.lastMoveAt[0]));
    this.throttle = clampValue(
      this.throttle - pointsToValue(y - this.lastMoveAt[1])
    );
    this.lastMoveAt[0] = x;
    this.lastMoveAt[1] = y;
  };
  applyVelocity = () => {
    const elapsed = (Date.now() - this.movingSince) / 1000;
    const wheelMoved = this.lastMoveAt[0] - this.startedAt[0];
    const throttleMoved = this.lastMoveAt[1] - this.startedAt[1];
    const wheelVelocityChange = wheelMoved / 10 / elapsed;
    const throttleVelocityChange = throttleMoved / 10 / elapsed;

    this.wheelVelocity +=
      Math.abs(wheelVelocityChange) > 10
        ? pointsToValue(wheelVelocityChange)
        : 0;
    this.throttleVelocity -=
      Math.abs(throttleVelocityChange) > 10
        ? pointsToValue(throttleVelocityChange)
        : 0;
    this.stopMoving();
  };
  stopMoving = () => {
    this.movingSince = null;
    this.startedAt[0] = 0;
    this.startedAt[1] = 0;
    this.lastMoveAt[0] = 0;
    this.lastMoveAt[1] = 0;
  };

  addEvent = throttle(this.props.addEvent, 300, { leading: false });

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
          onTouchMove={this.handleTouchMove}
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
