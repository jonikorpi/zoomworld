import React from "react";

export default class Loop extends React.Component {
  subscribers = [];
  loopID = null;

  componentDidMount() {
    this.start();
  }

  componentWillUnmount() {
    this.stop();
  }

  loop = timestamp => {
    const time = timestamp
      ? performance.timing.navigationStart + timestamp - 200
      : Date.now();

    this.subscribers.forEach(callback => {
      callback.call(callback, time);
    });

    this.loopID = window.requestAnimationFrame(this.loop);
  };

  start = () => {
    if (!this.loopID) {
      this.loop();
    }
  };

  stop = () => {
    if (!this.loopID) {
      window.cancelAnimationFrame(this.loopID);
      this.loopID = null;
    }
  };

  subscribe = callback => this.subscribers.push(callback);
  unsubscribe = id => this.subscribers.splice(id - 1, 1);

  render() {
    return this.props.children(this);
  }
}
