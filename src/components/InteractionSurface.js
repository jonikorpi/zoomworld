import React from "react";

import { clamp } from "../utilities/helpers.js";

const increment = 0.25;
const createEvent = (value, type) => ({
  [type]: {
    set: value,
  },
});

const clampValue = value => clamp(value.toPrecision(2), -1);
const throttleForward = ({ throttle }) => ({
  throttle: clampValue(
    throttle + increment <= 0 ? throttle + increment * 2 : throttle + increment
  ),
});
const throttleBackward = ({ throttle }) => ({
  throttle: clampValue(
    throttle - increment < 0 ? throttle - increment * 2 : throttle - increment
  ),
});
const steerLeft = ({ wheel }) => ({
  wheel: clampValue(wheel - increment),
});
const steerRight = ({ wheel }) => ({
  wheel: clampValue(wheel + increment),
});

const keyCodeToAction = keyCode => {
  switch (keyCode) {
    case 37:
    case 65:
      return "left";
    case 38:
    case 87:
      return "up";
    case 39:
    case 68:
      return "right";
    case 40:
    case 83:
      return "down";
    case 48:
      return 0;
    case 49:
      return 1;
    case 50:
      return 2;
    case 51:
      return 3;
    case 52:
      return 4;
    case 53:
      return 5;
    case 54:
      return 6;
    case 55:
      return 7;
    case 56:
      return 8;
    case 57:
      return 9;
    case 77:
      return "map";
    case 73:
    case 66:
      return "inventory";
    default:
      return null;
  }
};

class InteractionSurface extends React.Component {
  static defaultProps = {
    addEvent: () => {},
  };

  state = {
    throttle: 0,
    wheel: 0,
  };

  componentDidMount() {
    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp);
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("keyup", this.handleKeyUp);
  }

  componentDidUpdate(previousProps, { throttle, wheel }) {
    if (throttle !== this.state.throttle) {
      this.props.addEvent(createEvent(this.state.throttle, "throttle"));
    }
    if (wheel !== this.state.wheel) {
      this.props.addEvent(createEvent(this.state.wheel, "wheel"));
    }
  }

  handleKeyDown = event => {
    const action = this.startAction(keyCodeToAction(event.keyCode));

    if (action) {
      event.preventDefault();
      event.stopPropagation();
    }
  };
  handleKeyUp = event => {
    const action = this.stopAction(keyCodeToAction(event.keyCode));

    if (action) {
      event.preventDefault();
      event.stopPropagation();
    }
  };
  startAction = action => {
    switch (action) {
      case "left":
        this.steerLeft();
        return true;
      case "up":
        this.throttleForward();
        return true;
      case "right":
        this.steerRight();
        return true;
      case "down":
        this.throttleBackward();
        return true;
      case 0:
        return;
      case 1:
        return;
      case 2:
        return;
      case 3:
        return;
      case 4:
        return;
      case 5:
        return;
      case 6:
        return;
      case 7:
        return;
      case 8:
        return;
      case 9:
        return;
      case "map":
        return;
      case "inventory":
        return;
      default:
        return;
    }
  };
  stopAction = action => {
    switch (action) {
      case "left":
        return;
      case "up":
        return;
      case "right":
        return;
      case "down":
        return;
      case 0:
        return;
      case 1:
        return;
      case 2:
        return;
      case 3:
        return;
      case 4:
        return;
      case 5:
        return;
      case 6:
        return;
      case 7:
        return;
      case 8:
        return;
      case 9:
        return;
      case "map":
        return;
      case "inventory":
        return;
      default:
        return;
    }
  };

  throttleForward = () => this.setState(throttleForward);
  throttleBackward = () => this.setState(throttleBackward);
  steerLeft = () => this.setState(steerLeft);
  steerRight = () => this.setState(steerRight);

  render() {
    return (
      <div id="interaction">
        <input
          id="throttle"
          type="range"
          value={this.state.throttle}
          min="-1"
          max="1"
          step="0.01"
          className="safeAll"
        />
        <input
          id="wheel"
          type="range"
          value={this.state.wheel}
          min="-1"
          max="1"
          step="0.01"
          className="safeAll"
        />
        <button
          type="button"
          className="movementButton forward"
          onClick={this.throttleForward}
        >
          Throttle forward
        </button>
        <button
          type="button"
          className="movementButton backward"
          onClick={this.throttleBackward}
        >
          Throttle backward
        </button>
        <button
          type="button"
          className="movementButton left"
          onClick={this.steerLeft}
        >
          Steer left
        </button>
        <button
          type="button"
          className="movementButton right"
          onClick={this.steerRight}
        >
          Steer right
        </button>
      </div>
    );
  }
}

export default InteractionSurface;
