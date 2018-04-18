import React from "react";
import debounce from "lodash.debounce";

import { config } from "../utilities/graphics.js";

const createEvent = (value, type) => {
  return {
    [type]: {
      set: value,
    },
  };
};

const precision = 1000;
const clampValue = value => Math.max(-precision, Math.min(precision, value));
const keyboardSpeed = precision / 1000;
// const dragFactor = 0.91;

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

  wheel = 0;
  throttle = 0;
  lastScrollerX = 0;
  lastScrollerY = 0;
  keyboardTurning = null;
  keyboardThrottling = null;
  lastFrameAt = Date.now();

  componentDidMount() {
    this.resetScroll();
    this.loop = requestAnimationFrame(this.update);
    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp);
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.loop);
    window.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("keyup", this.handleKeyUp);
  }

  update = now => {
    const deltaTime = now - this.lastFrameAt;
    this.lastFrameAt = now;
    const scrollerX = Math.floor(this.scroller.scrollLeft);
    const scrollerY = Math.floor(this.scroller.scrollTop);

    if (scrollerX !== this.scrollerX || this.keyboardTurning) {
      this.wheel = clampValue(
        this.wheel +
          scrollerX -
          this.scrollerX -
          this.keyboardTurning * keyboardSpeed * deltaTime
      );
      if (+this.wheelElement.value !== -this.wheel) {
        const value = Math.abs(this.wheel / precision) > 0.05 ? this.wheel : 0;
        this.wheelElement.value = -value;
        this.addWheelEvent(createEvent(-value / precision, "wheel"));
      }
      this.scrollerX = scrollerX;
      this.handleResetScroll();
    }

    if (scrollerY !== this.scrollerY || this.keyboardThrottling) {
      this.throttle = clampValue(
        this.throttle +
          scrollerY -
          this.scrollerY +
          this.keyboardThrottling * keyboardSpeed * deltaTime
      );
      if (+this.throttleElement.value !== this.throttle) {
        const value =
          Math.abs(this.throttle / precision) > 0.05 ? this.throttle : 0;
        this.throttleElement.value = value;
        this.addThrottleEvent(createEvent(value / precision, "throttle"));
      }
      this.scrollerY = scrollerY;
      this.handleResetScroll();
    }

    this.loop = requestAnimationFrame(this.update);
  };

  resetScroll = () => {
    const scrollWidth = this.scrollerFiller.clientWidth - window.innerWidth;
    const scrollHeight = this.scrollerFiller.clientHeight - window.innerHeight;
    this.scroller.scrollLeft = scrollWidth / 2;
    this.scroller.scrollTop = scrollHeight / 2;
    this.scrollerX = Math.floor(scrollWidth / 2);
    this.scrollerY = Math.floor(scrollHeight / 2);
  };

  handleResetScroll = debounce(this.resetScroll, 500);

  handleKeyDown = event => {
    const action = this.startAction(keyCodeToAction(event.keyCode));

    if (action) {
      event.preventDefault();
    }
  };
  handleKeyUp = event => {
    const action = this.stopAction(keyCodeToAction(event.keyCode));

    if (action) {
      event.preventDefault();
    }
  };
  startAction = action => {
    switch (action) {
      case "left":
        return (this.keyboardTurning = -1);
      case "up":
        return (this.keyboardThrottling = 1);
      case "right":
        return (this.keyboardTurning = 1);
      case "down":
        return (this.keyboardThrottling = -1);
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
        return (this.keyboardTurning = false);
      case "up":
        return (this.keyboardThrottling = false);
      case "right":
        return (this.keyboardTurning = false);
      case "down":
        return (this.keyboardThrottling = false);
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

  addThrottleEvent = debounce(this.props.addEvent, 200, { maxWait: 700 });
  addWheelEvent = debounce(this.props.addEvent, 200, { maxWait: 700 });

  render() {
    return (
      <div id="interaction">
        <div id="scroller" ref={ref => (this.scroller = ref)}>
          <div id="scrollerFiller" ref={ref => (this.scrollerFiller = ref)} />
        </div>
        <input
          type="range"
          min={-precision}
          max={precision}
          defaultValue="0"
          id="wheel"
          ref={ref => (this.wheelElement = ref)}
        />
        <input
          type="range"
          min={-precision}
          max={precision}
          defaultValue="0"
          id="throttle"
          ref={ref => (this.throttleElement = ref)}
        />
      </div>
    );
  }
}

export default InteractionSurface;
