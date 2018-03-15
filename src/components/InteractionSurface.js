import React from "react";

import { config } from "../utilities/graphics.js";

const types = ["walk", "impulse", "thrust"];

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
          duration: Math.floor(
            distance * 12000 / (force * weight) + distanceTax
          ),
        },
      };
    case "thrust":
      return {
        type: type,
        data: {
          x: worldX,
          y: worldY,
          duration: Math.floor(
            distance * 12000 / (force * weight) + distanceTax
          ),
        },
      };
    case "walk":
      return {
        type: type,
        data: {
          x: worldX,
          y: worldY,
          duration: Math.floor(distance * 12000 / (force * weight)),
        },
      };
  }
};

class InteractionSurface extends React.Component {
  static defaultProps = {
    addEvent: () => {},
  };

  state = {
    selectedType: "walk",
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
