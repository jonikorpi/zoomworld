import React from "react";
import PropTypes from "prop-types";

class Positioner extends React.Component {
  static contextTypes = {
    loop: PropTypes.object,
  };

  static defaultProps = {
    position: { x: 0, y: 0 },
    offsetPosition: { x: 0, y: 0 },
    zoom: { scale: 1 },
  };

  componentDidMount() {
    this.context.loop.subscribe(this.update);
  }

  componentWillUnmount() {
    this.context.loop.unsubscribe(this.update);
  }

  update = () => {
    const { position, offsetPosition, zoom, onChange } = this.props;
    let changed = false;

    const currentPosition = {
      x: +getComputedStyle(this.element).getPropertyValue("--x"),
      y: +getComputedStyle(this.element).getPropertyValue("--y"),
      scale: +getComputedStyle(this.element).getPropertyValue("--scale"),
    };

    const newPosition = {
      x: position.x - offsetPosition.x,
      y: position.y - offsetPosition.y,
      scale: zoom.scale,
    };

    if (currentPosition.x !== newPosition.x) {
      this.element.style.setProperty("--x", newPosition.x);
      changed = true;
    }
    if (currentPosition.y !== newPosition.y) {
      this.element.style.setProperty("--y", newPosition.y);
      changed = true;
    }
    if (currentPosition.scale !== newPosition.scale) {
      this.element.style.setProperty("--scale", zoom.scale);
      // zoom doesn't trigger changes
    }

    if (changed && onChange) {
      onChange(newPosition);
    }
  };

  render() {
    return (
      <div
        className="positioner"
        ref={element => {
          this.element = element;
        }}
      >
        {this.props.children}
      </div>
    );
  }
}

export default Positioner;
