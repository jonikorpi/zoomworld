import React from "react";
import throttle from "lodash.throttle";
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
// const dragFactor = 0.91;

class InteractionSurface extends React.Component {
  static defaultProps = {
    addEvent: () => {},
  };

  wheel = 0;
  throttle = 0;
  x = Math.floor(
    (document.documentElement.offsetWidth - window.innerWidth) / 2
  );
  y = Math.floor(
    (document.documentElement.offsetHeight - window.innerHeight) / 2
  );

  componentDidMount() {
    this.loop = requestAnimationFrame(this.update);
    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp);
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.loop);
    window.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("keyup", this.handleKeyUp);
  }

  update = () => {
    const scrollX = Math.floor(window.pageXOffset);
    const scrollY = Math.floor(window.pageYOffset);

    if (scrollX !== this.x) {
      this.wheel = clampValue(this.wheel + scrollX - this.x);
      if (+this.wheelElement.value !== -this.wheel) {
        const value = Math.abs(this.wheel / precision) > 0.05 ? this.wheel : 0;
        this.wheelElement.value = -value;
        this.addEvent(createEvent(-value / precision, "wheel"));
      }
      this.x = scrollX;
      this.handleResetScroll();
    }

    if (scrollY !== this.y) {
      this.throttle = clampValue(this.throttle + scrollY - this.y);
      if (+this.throttleElement.value !== this.throttle) {
        const value =
          Math.abs(this.throttle / precision) > 0.05 ? this.throttle : 0;
        this.throttleElement.value = value;
        this.addEvent(createEvent(value / precision, "throttle"));
      }
      this.y = scrollY;
      this.handleResetScroll();
    }

    this.loop = requestAnimationFrame(this.update);
  };

  resetScroll = () => {
    const scrollWidth =
      document.documentElement.offsetWidth - window.innerWidth;
    const scrollHeight =
      document.documentElement.offsetHeight - window.innerHeight;
    window.scrollTo(scrollWidth / 2, scrollHeight / 2);
    this.x = Math.floor(window.pageXOffset);
    this.y = Math.floor(window.pageYOffset);
  };

  handleResetScroll = debounce(this.resetScroll, 500);
  handleKeyDown = ({ nativeEvent }) => {};
  handleKeyUp = ({ nativeEvent }) => {};

  addEvent = throttle(this.props.addEvent, 200, { leading: false });

  render() {
    return (
      <div id="interaction">
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
