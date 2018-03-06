import React from "react";

const createEvent = event => {
  const x = event.x - window.innerWidth / 2;
  const y = -event.y + window.innerHeight / 2;
  const magnitude = Math.sqrt(x * x + y * y);

  return {
    x: x / magnitude,
    y: y / magnitude,
    speed: 1,
    duration: 5000,
  };
};

class InteractionSurface extends React.Component {
  static defaultProps = {
    addEvent: () => {},
  };

  state = {};

  handleClick = event => {
    this.props.addEvent(createEvent(event.nativeEvent));
  };

  render() {
    return <button className="interactionSurface" onClick={this.handleClick} />;
  }
}

export default InteractionSurface;
