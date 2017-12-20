import React from "react";
import PropTypes from "prop-types";

const minimum = 0.333;

class Zoomer extends React.Component {
  static contextTypes = {
    loop: PropTypes.object,
  };

  static defaultProps = {
    camera: { scale: 1 },
  };

  componentDidMount() {
    this.context.loop.subscribe(this.update);
  }

  componentWillUnmount() {
    this.context.loop.unsubscribe(this.update);
  }

  update = () => {
    const { onChange, camera } = this.props;

    const currentScale = camera.scale;
    const height = document.documentElement.clientHeight;
    const scrolled = window.pageYOffset;
    const newScale =
      1 - scrolled / height + (1 - minimum) * (scrolled / height);

    if (currentScale !== newScale && onChange) {
      onChange(newScale);
    }
  };

  render() {
    return null;
  }
}

export default Zoomer;
