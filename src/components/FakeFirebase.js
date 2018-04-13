import React from "react";

import { stateAtTime, precompute } from "../utilities/state.js";
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
        time: Date.now(),
        throttle: 0,
        wheel: 0,
        velocity: 0,
        mass: 10,
        drag: 0.5,
        windX: 0,
        windY: 0,
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
      [Math.random() > 0.5 ? "throttle" : "wheel"]: {
        set: Math.random() * 2 - 1,
      },
    });
  };

  addEvent = event => {
    const { state } = this.state;
    const events = precompute(this.state.events);
    const now = performance.timing.navigationStart + performance.now();

    const finishedEvents = [...events].filter(event => event.validUntil <= now);
    const unfinishedEvents = [...events].filter(
      event => event.validUntil > now
    );

    this.setState({
      state: stateAtTime(now, state, finishedEvents),
      events: [
        ...unfinishedEvents,
        {
          ".key": "event-" + now,
          time: now,
          data: { ...event },
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
