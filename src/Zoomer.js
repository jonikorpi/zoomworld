import React from "react";
import PropTypes from "prop-types";

class Zoomer extends React.Component {
  static contextTypes = {
    loop: PropTypes.object,
  };

  static defaultProps = {
    zoom: { scale: 1 },
    onChange: () => {},
  };

  componentDidMount() {
    this.context.loop.subscribe(this.update);
  }

  componentWillUnmount() {
    this.context.loop.unsubscribe(this.update);
  }

  update = () => {
    const currentScale = this.props.zoom.scale;
    const newScale = Math.abs(1 - window.pageYOffset / window.innerHeight);

    if (currentScale !== newScale) {
      this.props.onChange(newScale);
    }
  };

  render() {
    return null;
  }
}

export default Zoomer;
