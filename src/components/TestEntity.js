import React from "react";

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
            x: Math.random() * 2 - 1,
            y: Math.random() * 2 - 1,
            speed: 10 + Math.random() * 10,
          },
        },
      ],
    });
  };

  componentDidMount() {
    if (this.props.moveAround) {
      this.timer = setInterval(this.addEvent, 1000 + Math.random() * 5000);
    }
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    return this.props.children(this.state);
  }
}
