import React from "react";

import Zoomer from "../components/Zoomer";
import Position from "../components/Position";
import TestEntity from "../components/TestEntity";
import Tile from "../components/Tile";

class Camera extends React.Component {
  static defaultProps = {
    userID: null,
  };

  camera = {
    x: 0,
    y: 0,
    scale: 1,
  };

  updateCamera = ({ x, y }) => {
    this.camera.x = x;
    this.camera.y = y;
  };

  updateScale = scale => {
    this.camera.scale = scale;
  };

  render() {
    return (
      <React.Fragment>
        <Zoomer onChange={this.updateScale} />

        <div
          className="camera"
          ref={element => {
            this.world = element;
          }}
        >
          {[...new Array(25)].map((nada, index) => {
            const x = Math.random() * 500 - 250;
            const y = Math.random() * 500 - 250;

            return (
              <TestEntity
                index={index + 134}
                key={index}
                x={x}
                y={y}
                moveAround={false}
              >
                {({ state, events }) => (
                  <Position
                    state={state}
                    events={events}
                    camera={this.camera}
                    centered={false}
                  >
                    <Tile x={x} y={y} tile={{ type: "plains" }} />
                  </Position>
                )}
              </TestEntity>
            );
          })}

          {[...new Array(25)].map((nada, index) => (
            <TestEntity
              key={index}
              index={index + 123}
              x={(Math.random() * 500 - 250) / 10}
              y={(Math.random() * 500 - 250) / 10}
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
              <div id="playerEntity">
                <Position
                  state={state}
                  events={events}
                  camera={this.camera}
                  onChange={this.updateCamera}
                  distanceCulling={false}
                  translate={false}
                >
                  Player
                </Position>
              </div>
            )}
          </TestEntity>
        </div>
      </React.Fragment>
    );
  }
}

export default Camera;
