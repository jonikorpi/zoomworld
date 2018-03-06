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
      state: {
        x: x,
        y: y,
        angle: angle,
      },
      events: [],
    };
  }

  counter = 123;

  addRandomEvent = () => {
    this.addEvent({
      x: random(1, this.counter++) * 2 - 1,
      y: random(1, this.counter++) * 2 - 1,
      speed: 2,
      duration: 10000,
    });
  };

  addEvent = data => {
    const { state, events } = this.state;
    const now = performance.timing.navigationStart + performance.now() - 200;

    const finishedEvents = [...events].filter(
      event => event.time + (event.data.duration || 0) <= now
    );
    const unfinishedEvents = [...events].filter(
      event => event.time + (event.data.duration || 0) > now
    );

    const flattenedPosition = positionAtTime(now, state, finishedEvents);

    this.setState({
      state: {
        x: flattenedPosition[0],
        y: flattenedPosition[1],
        angle: flattenedPosition[2],
      },
      events: [
        ...unfinishedEvents,
        {
          ".key": "event-" + now,
          type: "impulse",
          time: now,
          data: data,
        },
      ],
    });
  };

  componentDidMount() {
    if (this.props.moveAround) {
      this.counter = this.props.index || 123;
      this.timer = window.setInterval(
        this.addRandomEvent,
        2000 + random(1, this.counter++) * 3000
      );
    }
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    return this.props.children(this.state, this.addEvent);
  }
}
