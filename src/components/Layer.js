import React from "react";

export default class Layer extends React.Component {
  static defaultProps = {
    z: 0,
  };

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
        className="layerContainer"
        ref={element => {
          this.element = element;
        }}
      >
        <div
          id={`layer-${this.props.z}`}
          className="layer"
          style={{ "--z": this.props.z }}
        >
          {this.props.children}
        </div>
      </div>
    );
  }
}
