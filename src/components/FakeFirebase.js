import React from "react";

import { stateAtTime } from "../utilities/state.js";
import { random } from "../utilities/graphics.js";

export default class FakeFirebase extends React.Component {
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
      state: {
        x: x,
        y: y,
        angle: angle,
        velocityX: 0,
        velocityY: 0,
        time: 0,
      },
      events: [],
    };
  }

  counter = 123;

  addRandomEvent = () => {
    this.addEvent({
      type: "impulse",
      data: {
        x: random(1, this.counter++) * 2 - 1,
        y: random(1, this.counter++) * 2 - 1,
        force: 1,
        duration: 5000,
      },
    });
  };

  addEvent = event => {
    const { state, events } = this.state;
    const now = performance.timing.navigationStart + performance.now();

    const finishedEvents = [...events].filter(
      event => event.time + (event.data.duration || 0) <= now
    );
    const unfinishedEvents = [...events].filter(
      event => event.time + (event.data.duration || 0) > now
    );

    this.setState({
      state: stateAtTime(now, state, finishedEvents),
      events: [
        ...unfinishedEvents,
        {
          ".key": "event-" + now,
          type: event.type,
          time: now,
          data: event.data,
        },
      ],
    });
  };

  componentDidMount() {
    if (this.props.moveAround) {
      this.counter = this.props.index || 123;
      this.timer = window.setInterval(
        this.addRandomEvent,
        2000 + random(1, this.counter++) * 10000
      );
    }
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    const { state, events } = this.state;
    return this.props.children({ state, events: events }, this.addEvent);
  }
}
