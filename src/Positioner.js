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

  currentX = 0;
  currentY = 0;

  componentDidMount() {
    this.context.loop.subscribe(this.update);
  }

  componentWillUnmount() {
    this.context.loop.unsubscribe(this.update);
  }

  update = () => {
    const { position, onChange } = this.props;
    let changed = false;

    const newX = onChange !== undefined ? this.currentX + 0.1 : position.x;
    const newY = onChange !== undefined ? this.currentY + 0.1 : position.y;

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

    if (changed && onChange !== undefined) {
      onChange({ x: newX, y: newY });
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
