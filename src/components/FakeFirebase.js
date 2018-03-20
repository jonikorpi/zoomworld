import React from "react";

import {
  positionAtTime,
  precompute,
  eventBufferLength,
} from "../utilities/state.js";
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
      },
      events: [],
    };
  }

  counter = 123;

  addRandomEvent = () => {
    this.addEvent({
      type: "run",
      data: {
        x: random(3, this.counter++) - 1.5,
        y: random(3, this.counter++) - 1.5,
        speed: Math.ceil(random(1, this.counter++) * 2),
      },
    });
  };

  addEvent = event => {
    const { state } = this.state;
    const events = precompute(this.state.events);
    const now = performance.timing.navigationStart + performance.now();

    const finishedEvents = [...events].filter(
      event => event.endsAt <= now - eventBufferLength
    );
    const unfinishedEvents = [...events].filter(
      event => event.endsAt > now - eventBufferLength
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
    return this.props.children(
      { state, events: events.length > 0 ? precompute(events) : events },
      this.addEvent
    );
  }
}
