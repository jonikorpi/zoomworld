import React from "react";

export default class TestTile extends React.Component {
  static defaultProps = {
    subscribe: () => {},
    unsubscribe: () => {},
    x: 0,
    y: 0,
    state: {},
    events: [],
  };

  componentWillMount() {
    const { x, y } = this.props;

    this.mountedAt = performance.timing.navigationStart + performance.now();
    this.props.subscribe(this.update);
  }

  componentWillUnmount() {
    this.unmountedAt = performance.timing.navigationStart + performance.now();
    this.props.unsubscribe(this.update);
  }

  update = time => {
    const { x, y, state } = this.props;

    return {
      models: ["tileShade", "tile"],
      position: [x, y, 0],
      mountedAt: this.mountedAt,
      unmountedAt: this.unmountedAt,
    };
  };

  render() {
    return null;
  }
}
