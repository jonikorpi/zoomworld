import React from "react";

const minimum = 0.414;

class Zoomer extends React.Component {
  static defaultProps = {
    camera: { scale: 1 },
  };

  // componentDidMount() {
  //   this.props.loop.subscribe(this.update);
  // }
  //
  // componentWillUnmount() {
  //   this.props.loop.unsubscribe(this.update);
  // }

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
