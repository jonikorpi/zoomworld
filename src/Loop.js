import React from "react";
import PropTypes from "prop-types";

export default class Loop extends React.Component {
  static childContextTypes = {
    loop: PropTypes.object,
  };

  getChildContext() {
    return {
      loop: this,
    };
  }

  constructor(props) {
    super(props);

    this.subscribers = [];
    this.loopID = null;
  }

  componentDidMount() {
    this.start();
  }

  componentWillUnmount() {
    this.stop();
  }

  loop = timestamp => {
    const time = timestamp
      ? performance.timing.navigationStart + timestamp
      : Date.now();

    this.subscribers.forEach(callback => {
      callback.call(time);
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

  subscribe = callback => {
    return this.subscribers.push(callback);
  };

  unsubscribe = id => {
    this.subscribers.splice(id - 1, 1);
  };

  render() {
    return this.props.children;
  }
}
