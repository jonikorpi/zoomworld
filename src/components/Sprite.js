import React from "react";
import { createPortal } from "react-dom";

export default class Sprite extends React.Component {
  componentDidMount() {
    this.props.positioner.subscribe(this.updateTransform);
  }

  componentWillUnmount() {
    this.props.positioner.unsubscribe(this.updateTransform);
  }

  updateTransform = transform =>
    this.element.style.setProperty("transform", transform);

  render() {
    return createPortal(
      <div
        className="sprite"
        ref={element => {
          this.element = element;
        }}
      >
        {this.props.children}
      </div>,
      document.getElementById("layer-" + this.props.layer || 0)
    );
  }
}
