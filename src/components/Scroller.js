import React from "react";

class Scroller extends React.Component {
  static defaultProps = {
    camera: { scale: 1 },
  };

  componentDidMount() {
    this.props.loop.subscribe(this.update);

    window.setTimeout(() => {
      window.scroll(document.documentElement.offsetWidth / 2, 0);
    }, 1);
  }

  componentWillUnmount() {
    this.props.loop.unsubscribe(this.update);
  }

  update = () => {
    const { onChange, camera } = this.props;

    const currentAngle = camera.angle;
    const width = window.innerWidth * 1.618;
    const newAngle = (window.pageXOffset % width) / width * Math.PI * 2;

    if (currentAngle !== newAngle && onChange) {
      onChange(newAngle);
    }
  };

  render() {
    return null;
  }
}

export default Scroller;
