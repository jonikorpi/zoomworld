import React from "react";

import { positionAtTime } from "../utilities/state.js";
import { random } from "../utilities/graphics.js";

export default class TestEntity extends React.Component {
  static defaultProps = {
    x: 0,
    y: 0,
    angle: 0,
    moveAround: true,
  };

  constructor(props) {
    super(props);
    const { x, y, angle } = this.props;

    this.state = {
      state: { x: x, y: y, angle: angle },
      events: [],
    };
  }

  counter = 123;

  addEvent = () => {
    const { state, events } = this.state;
    const now = Date.now() - 200;

    const finishedEvents = [...events].filter(
      event => event.time + event.duration <= now
    );
    const unfinishedEvents = [...events].filter(
      event => event.time + event.duration > now
    );

    const flattenedState = positionAtTime(now, state, finishedEvents);

    this.setState({
      state: {
        ...flattenedState,
      },
      events: [
        ...unfinishedEvents,
        {
          ".key": "event-" + now,
          type: "impulse",
          time: now,
          duration: 10000,
          data: {
            x: random(1, this.counter++) * 2 - 1,
            y: random(1, this.counter++) * 2 - 1,
            speed: 3,
          },
        },
      ],
    });
  };

  componentDidMount() {
    if (this.props.moveAround) {
      this.counter = this.props.index || 123;
      this.timer = window.setInterval(
        this.addEvent,
        2000 + random(1, this.counter++) * 10000
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
