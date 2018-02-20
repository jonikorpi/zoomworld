import React from "react";

import World from "../components/World";
import Position from "../components/Position";
import Scroller from "../components/Scroller";
import TestEntity from "../components/TestEntity";
import SVG from "../components/SVG";
import Graphic from "../components/Graphic";

import { config, getSeed, baseTile, random } from "../utilities/graphics.js";

const testTileRadius = 10;
const testEntityRadius = 10;
const testTileCount = 25;
const testEntityCount = 100;

const unit = 38.2;
const xUnitType = "vmin";
const yUnitType = "vmin";

const computeUnit = type => {
  switch (type) {
    case "vw":
      return window.innerWidth / 100;
    case "vh":
      return window.innerHeight / 100;
    case "vmax":
      return Math.max(window.innerWidth / 100, window.innerHeight / 100);
    case "vmin":
      return Math.min(window.innerWidth / 100, window.innerHeight / 100);
    default:
      return 1;
  }
};

class Camera extends React.Component {
  static defaultProps = {
    userID: null,
  };

  camera = {
    x: 0,
    y: 0,
    scale: 1,
    width: window.innerWidth,
    height: window.innerHeight,
    unit: unit,
    xUnitType: xUnitType,
    yUnitType: yUnitType,
    xPixelUnit: unit,
    yPixelUnit: unit,
  };

  counter = 123;

  render() {
    return (
      <div className="camera">
        <World {...this.props} />

        <TestEntity moveAround={true}>
          {({ state, events }) => (
            <React.Fragment>
              <div id="playerEntity">
                <Position state={state} events={events} translate={false}>
                  Player
                </Position>
              </div>
              <Scroller state={state} events={events} />
            </React.Fragment>
          )}
        </TestEntity>
      </div>
    );
  }
}

export default Camera;
