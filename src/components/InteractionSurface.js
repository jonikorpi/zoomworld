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
// const dragFactor = 0.91;

class InteractionSurface extends React.Component {
  static defaultProps = {
    addEvent: () => {},
  };

  wheel = 0;
  throttle = 0;

  componentDidMount() {
    this.x = Math.floor(
      (this.scrollerFiller.clientWidth - window.innerWidth) / 2
    );
    this.y = Math.floor(
      (this.scrollerFiller.clientHeight - window.innerHeight) / 2
    );
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

  update = () => {
    const scrollX = Math.floor(this.scroller.scrollLeft);
    const scrollY = Math.floor(this.scroller.scrollTop);

    if (scrollX !== this.x) {
      this.wheel = clampValue(this.wheel + scrollX - this.x);
      if (+this.wheelElement.value !== -this.wheel) {
        const value = Math.abs(this.wheel / precision) > 0.05 ? this.wheel : 0;
        this.wheelElement.value = -value;
        this.addWheelEvent(createEvent(-value / precision, "wheel"));
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
        this.addThrottleEvent(createEvent(value / precision, "throttle"));
      }
      this.y = scrollY;
      this.handleResetScroll();
    }

    this.loop = requestAnimationFrame(this.update);
  };

  resetScroll = () => {
    const scrollWidth = this.scrollerFiller.clientWidth - window.innerWidth;
    const scrollHeight = this.scrollerFiller.clientHeight - window.innerHeight;
    this.scroller.scrollLeft = scrollWidth / 2;
    this.scroller.scrollTop = scrollHeight / 2;
    this.x = Math.floor(scrollWidth / 2);
    this.y = Math.floor(scrollHeight / 2);
  };

  handleResetScroll = debounce(this.resetScroll, 500);
  handleKeyDown = ({ nativeEvent }) => {};
  handleKeyUp = ({ nativeEvent }) => {};

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
