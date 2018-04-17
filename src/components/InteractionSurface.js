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

class InteractionSurface extends React.Component {
  static defaultProps = {
    addEvent: () => {},
  };

  state = {
    wheel: 0,
    throttle: 0,
  };

  addEvent = throttle(this.props.addEvent, 200, { leading: false });
  handleWheel = event => {
    const input = event.nativeEvent.target.value;
    const value =
      Math.abs(input) < 0.034 || Math.abs(input) > 0.966
        ? Math.round(input)
        : input;
    this.setState({ wheel: value });
    this.addEvent(createEvent(value, "wheel"));
  };
  handleThrottle = event => {
    const input = event.nativeEvent.target.value;
    const value =
      Math.abs(input) < 0.034 || Math.abs(input) > 0.966
        ? Math.round(input)
        : input;
    this.setState({ throttle: value });
    this.addEvent(createEvent(value, "throttle"));
  };

  render() {
    const { wheel, throttle } = this.state;

    return <button type="button" id="interactionSurface" />;
  }
}

export default InteractionSurface;
