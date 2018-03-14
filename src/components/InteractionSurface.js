import React from "react";

import { config } from "../utilities/graphics.js";

const createEvent = (event, type) => {
  const x = event.x - window.innerWidth / 2;
  const y = -event.y + window.innerHeight / 2;
  const unitInPixels =
    Math.min(window.innerHeight, window.innerWidth) * config.unitSize / 100;
  const worldX = x / unitInPixels;
  const worldY = y / unitInPixels;
  const distance = Math.sqrt(worldX * worldX + worldY * worldY);
  const distanceTax = 1000 * Math.max(0, 0.1 / distance);
  const weight = 1;
  const force = 1;

  switch (type) {
    default:
    case "impulse":
      return {
        type: type,
        data: {
          x: worldX,
          y: worldY,
          duration: Math.floor(distance * 8000 / force * weight + distanceTax),
        },
      };
    case "thrust":
      return {
        type: type,
        data: {
          x: worldX,
          y: worldY,
          duration: Math.floor(distance * 8000 / force * weight + distanceTax),
        },
      };
  }
};

class InteractionSurface extends React.Component {
  static defaultProps = {
    addEvent: () => {},
  };

  state = {
    type: "thrust",
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
              value="thrust"
              checked={type === "thrust"}
              onChange={this.changeType}
            />{" "}
            thrust
          </label>
        </div>
      </React.Fragment>
    );
  }
}

export default InteractionSurface;
