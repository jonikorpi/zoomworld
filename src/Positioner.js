import React from "react";
import PropTypes from "prop-types";

class Positioner extends React.Component {
  static contextTypes = {
    loop: PropTypes.object,
  };

  static defaultProps = {
    position: { x: 0, y: 0 },
    camera: { x: 0, y: 0, scale: 1 },
  };

  currentX = 0;
  currentY = 0;
  currentScale = 1;

  componentDidMount() {
    this.context.loop.subscribe(this.update);
  }

  componentWillUnmount() {
    this.context.loop.unsubscribe(this.update);
  }

  update = () => {
    const { position, camera, onChange } = this.props;
    let changed = false;

    const newX = position.x - camera.x;
    const newY = position.y - camera.y;
    const newScale = camera.scale;

    if (this.currentX !== newX) {
      this.currentX = newX;
      this.element.style.setProperty("--x", newX);
      changed = true;
    }
    if (this.currentY !== newY) {
      this.currentY = newY;
      this.element.style.setProperty("--y", newY);
      changed = true;
    }
    if (this.currentScale !== newScale) {
      this.currentScale = newScale;
      this.element.style.setProperty("--scale", newScale);
    }

    if (onChange !== undefined) {
      // TODO: prototype code
      onChange({ x: position.x + 0.1, y: position.y - 0.1 });
      // onChange({ x: newX, y: newY });
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
