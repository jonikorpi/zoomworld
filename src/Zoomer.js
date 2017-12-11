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
    const height = document.documentElement.clientHeight;
    const scrolled = window.pageYOffset;
    const newScale = 1 - scrolled / height + 0.2 * (scrolled / height);

    if (currentScale !== newScale) {
      this.props.onChange(newScale);
    }
  };

  render() {
    return null;
  }
}

export default Zoomer;
