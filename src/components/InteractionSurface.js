import React from "react";

const createEvent = (event, type) => {
  const x = event.x - window.innerWidth / 2;
  const y = -event.y + window.innerHeight / 2;
  const magnitude = Math.sqrt(x * x + y * y);

  switch (type) {
    default:
    case "impulse":
      return {
        type: type,
        data: {
          x: x / magnitude,
          y: y / magnitude,
          speed: 1,
          duration: 5000,
        },
      };
    case "brake":
      return {
        type: type,
        data: {
          angle: Math.atan2(y, x),
          speed: 1,
          duration: 5000,
        },
      };
  }
};

class InteractionSurface extends React.Component {
  static defaultProps = {
    addEvent: () => {},
  };

  state = {
    type: "impulse",
  };

  changeType = event => {
    this.setState({ type: event.target.value });
  };

  handleClick = event => {
    this.props.addEvent(createEvent(event.nativeEvent, this.state.type));
  };

  render() {
    const { type } = this.state;

    return (
      <React.Fragment>
        <button className="interactionSurface" onClick={this.handleClick} />
        <div className="interactionTypes">
          <label>
            <input
              type="radio"
              name="type"
              value="impulse"
              checked={type === "impulse"}
              onChange={this.changeType}
            />{" "}
            impulse
          </label>
          <label>
            <input
              type="radio"
              name="type"
              value="brake"
              checked={type === "brake"}
              onChange={this.changeType}
            />{" "}
            brake
          </label>
        </div>
      </React.Fragment>
    );
  }
}

export default InteractionSurface;
