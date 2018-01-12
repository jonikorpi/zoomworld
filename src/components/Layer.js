import React from "react";

export default class Layer extends React.Component {
  componentDidMount() {
    this.props.positioner.subscribe(this.updateTransform);
  }

  componentWillUnmount() {
    this.props.positioner.unsubscribe(this.updateTransform);
  }

  updateTransform = transform =>
    this.element.style.setProperty("transform", transform);

  render() {
    return (
      <div
        className="layer"
        ref={element => {
          this.element = element;
        }}
      >
        {this.props.children}
      </div>
    );
  }
}
