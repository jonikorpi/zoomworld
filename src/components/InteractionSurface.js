import React from "react";

import { config } from "../utilities/graphics.js";

const types = ["impulse", "walk", "stop"];

const createEvent = (event, type) => {
  const x = event.x - window.innerWidth / 2;
  const y = -event.y + window.innerHeight / 2;
  const magnitude = Math.sqrt(x * x + y * y);
  const unitInPixels =
    Math.min(window.innerHeight, window.innerWidth) * config.unitSize / 100;
  const worldX = x / unitInPixels;
  const worldY = y / unitInPixels;

  switch (type) {
    case "impulse":
      return {
        type: type,
        data: {
          x: x / magnitude,
          y: y / magnitude,
          duration: 250 * 1,
        },
      };
    case "walk":
      return {
        type: type,
        data: {
          x: worldX,
          y: worldY,
          speed: 1,
        },
      };
    default:
    case "stop":
      return {
        type: type,
      };
  }
};

class InteractionSurface extends React.Component {
  static defaultProps = {
    addEvent: () => {},
  };

  state = {
    selectedType: types[0],
  };

  changeType = event => {
    this.setState({ selectedType: event.target.value });
  };

  handleClick = event => {
    this.props.addEvent(
      createEvent(event.nativeEvent, this.state.selectedType)
    );
  };

  render() {
    const { selectedType } = this.state;

    return (
      <React.Fragment>
        <button className="interactionSurface" onClick={this.handleClick} />
        <div className="interactionTypes">
          {types.map((type, index) => (
            <label key={index}>
              <input
                type="radio"
                name="type"
                value={type}
                checked={selectedType === type}
                onChange={this.changeType}
              />{" "}
              {type}
            </label>
          ))}
        </div>
      </React.Fragment>
    );
  }
}

export default InteractionSurface;
