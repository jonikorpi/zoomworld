import React from "react";
import throttle from "lodash.throttle";

import { config } from "../utilities/graphics.js";

const createEvent = (event, type) => {
  return {
    [type]: {
      set: +event.target.value,
    },
  };
};

class InteractionSurface extends React.Component {
  static defaultProps = {
    addEvent: () => {},
  };

  addEvent = throttle(this.props.addEvent, 200, { leading: false });
  handleWheel = event => {
    this.addEvent(createEvent(event.nativeEvent, "wheel"));
  };
  handleThrottle = event => {
    this.addEvent(createEvent(event.nativeEvent, "throttle"));
  };

  render() {
    return (
      <React.Fragment>
        <input
          type="range"
          min="-1"
          max="1"
          defaultValue="0"
          step="0.1"
          className="wheel"
          onChange={this.handleWheel}
        />
        <input
          type="range"
          min="-1"
          max="1"
          defaultValue="0"
          step="0.1"
          className="throttle"
          onChange={this.handleThrottle}
        />
      </React.Fragment>
    );
  }
}

export default InteractionSurface;
