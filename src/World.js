import React from "react";

import Loop from "./Loop";
import Zoomer from "./Zoomer";
import Position from "./Position";
import TestEntity from "./TestEntity";

class World extends React.Component {
  static defaultProps = {
    userID: null,
  };

  camera = { x: 0, y: 0, scale: 1 };

  updateCamera = ({ x, y }) => {
    this.camera.x = x;
    this.camera.y = y;
  };

  updateScale = scale => {
    this.camera.scale = scale;
  };

  render() {
    return (
      <Loop>
        <Zoomer onChange={this.updateScale} />

        <div
          className="world"
          ref={element => {
            this.world = element;
          }}
        >
          {[...new Array(200)].map((nada, index) => (
            <TestEntity
              key={index}
              x={Math.random() * 500 - 250}
              y={Math.random() * 500 - 250}
            >
              {({ state, events }) => (
                <Position state={state} events={events} camera={this.camera}>
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
                camera={this.camera}
                onChange={this.updateCamera}
                disableCulling
              >
                <div id="playerEntity">Player</div>
              </Position>
            )}
          </TestEntity>
        </div>
      </Loop>
    );
  }
}

export default World;
