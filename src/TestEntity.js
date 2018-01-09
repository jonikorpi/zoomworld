import React from "react";

export default class TestEntity extends React.Component {
  static defaultProps = {
    x: 0,
    y: 0,
  };
  state = {
    state: { ...this.props, speed: 25 + Math.random() * 25 },
    events: [],
  };

  addEvent = () => {
    this.setState({
      events: [
        ...this.state.events,
        {
          ".key": "event-" + Date.now(),
          type: "impulse",
          time: Date.now() - 100,
          duration: 5000,
          data: {
            x: Math.random() * 2 - 1,
            y: Math.random() * 2 - 1,
          },
        },
      ],
    });
  };

  componentDidMount() {
    this.timer = setInterval(this.addEvent, 1000 + Math.random() * 10000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    return this.props.children(this.state);
  }
}
