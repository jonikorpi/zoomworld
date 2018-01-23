import React from "react";

import Position from "../components/Position";
import TestEntity from "../components/TestEntity";
import Tile from "../components/Tile";

import { random } from "../utilities/graphics.js";

class Camera extends React.Component {
  static defaultProps = {
    userID: null,
  };

  counter = 123;

  render() {
    return (
      <React.Fragment>
        <div
          className="camera"
          ref={element => {
            this.world = element;
          }}
        >
          {[...new Array(25)].map((nada, index) => {
            const x = random(1, this.counter++) * 100 - 50;
            const y = random(1, this.counter++) * 100 - 50;

            return (
              <TestEntity
                index={index + 134}
                key={index}
                x={x}
                y={y}
                moveAround={false}
              >
                {({ state, events }) => (
                  <Position state={state} events={events} centered={false}>
                    <Tile x={x} y={y} tile={{ type: "plains" }} />
                  </Position>
                )}
              </TestEntity>
            );
          })}

          {[...new Array(100)].map((nada, index) => (
            <TestEntity
              key={index}
              index={index + 123}
              x={random(1, this.counter++) * 100 - 50}
              y={random(1, this.counter++) * 100 - 50}
            >
              {({ state, events }) => (
                <Position state={state} events={events}>
                  <div className="positioner">{index}</div>
                </Position>
              )}
            </TestEntity>
          ))}

          <TestEntity>
            {({ state, events }) => (
              <Position
                state={state}
                events={events}
                // onChange={this.updateCamera}
                distanceCulling={false}
              >
                <div id="playerEntity">Player</div>
              </Position>
            )}
          </TestEntity>
        </div>
      </React.Fragment>
    );
  }
}

export default Camera;
