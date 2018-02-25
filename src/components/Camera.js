import React from "react";

import World from "../components/World";
import Position from "../components/Position";
// import Scroller from "../components/Scroller";
import TestEntity from "../components/TestEntity";

import { config } from "../utilities/graphics.js";

class Camera extends React.Component {
  static defaultProps = {
    userID: null,
  };

  counter = 123;

  render() {
    const offsetX = 50000;
    const offsetY = 50000;

    return (
      <div
        className="camera"
        style={{
          "--unit": `${config.unitSize}${config.unitType}`,
        }}
      >
        <TestEntity moveAround={true} x={offsetX} y={offsetY}>
          {({ state, events }) => (
            <React.Fragment>
              <Position
                state={state}
                events={events}
                rotate={false}
                inverse={true}
              >
                <World {...this.props} offsetX={offsetX} offsetY={offsetY} />

                <Position state={state} events={events}>
                  <b>Player</b>
                </Position>
                <Position state={state} events={events} z={1}>
                  <b>Player</b>
                </Position>
                <Position state={state} events={events} z={2}>
                  <b>Player</b>
                </Position>
                <Position state={state} events={events} z={3}>
                  <b>Player</b>
                </Position>
                <Position state={state} events={events} z={4}>
                  <b>Player</b>
                </Position>
              </Position>

              {/* <Scroller state={state} events={events} /> */}

              {/* <div id="playerEntity">
                <Position state={state} events={events} translate={false}>
                  Player
                </Position>
              </div> */}
            </React.Fragment>
          )}
        </TestEntity>
      </div>
    );
  }
}

export default Camera;
