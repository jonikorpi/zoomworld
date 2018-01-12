import React from "react";

import { random } from "../utilities/graphics.js";

export default class TestEntity extends React.Component {
  static defaultProps = {
    x: 0,
    y: 0,
    moveAround: true,
  };
  state = {
    state: { ...this.props },
    events: [],
  };

  counter = 123;

  addEvent = () => {
    this.setState({
      events: [
        ...this.state.events,
        {
          ".key": "event-" + Date.now(),
          type: "impulse",
          time: Date.now() - 200,
          duration: 5000,
          data: {
            x: random(1, this.counter++) * 2 - 1,
            y: random(1, this.counter++) * 2 - 1,
            speed: 20,
          },
        },
      ],
    });
  };

  componentDidMount() {
    if (this.props.moveAround) {
      this.counter = this.props.index || 123;
      this.timer = setInterval(
        this.addEvent,
        1000 + random(1, this.counter++) * 5000
      );
    }
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    return this.props.children(this.state);
  }
}
