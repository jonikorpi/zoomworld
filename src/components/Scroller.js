import React from "react";

import { positionAtTime } from "../utilities/state.js";

const cancelScroll = event => event.preventDefault();

class Scroller extends React.Component {
  static defaultProps = {
    state: { x: 0, y: 0, angle: 0 },
    events: [],
  };

  loopID = null;
  vmax = Math.max(window.innerWidth / 100, window.innerHeight / 100);
  xOffset = window.innerWidth / 2;
  yOffset = window.innerHeight / 2;

  setViewport = () => {
    this.vmax = Math.max(window.innerWidth / 100, window.innerHeight / 100);
    this.xOffset = window.innerWidth / 2;
    this.yOffset = window.innerHeight / 2;
  };

  componentDidMount() {
    this.start();
    window.addEventListener("resize", this.setViewport);
    window.addEventListener("wheel", cancelScroll);
  }

  componentWillUnmount() {
    this.stop();
    window.removeEventListener("resize", this.setViewport);
    window.removeEventListener("wheel", cancelScroll);
  }

  start = () => {
    if (!this.loopID) {
      this.loop();
    }
  };

  stop = () => {
    if (!this.loopID) {
      window.cancelAnimationFrame(this.loopID);
      this.loopID = null;
    }
  };

  loop = timestamp => {
    const { state, events } = this.props;

    // Game logic happens slightly in the past to hide lag
    const now = timestamp
      ? performance.timing.navigationStart + timestamp - 200
      : Date.now() - 200;

    const { x, y } = positionAtTime(now, state, events);

    window.scroll(
      1000 / 2 * this.vmax + x * this.vmax * 9 - this.xOffset,
      1000 / 2 * this.vmax + y * this.vmax * 9 - this.yOffset
    );

    this.loopID = window.requestAnimationFrame(this.loop);
  };

  render() {
    return null;
  }
}

export default Scroller;
