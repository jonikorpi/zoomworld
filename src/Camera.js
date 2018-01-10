import React from "react";

import Loop from "./Loop";
import Zoomer from "./Zoomer";
import Position from "./Position";
import TestEntity from "./TestEntity";

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
    unit: Math.max(window.innerWidth / 100, window.innerHeight / 100),
  };

  componentDidMount() {
    window.addEventListener("resize", this.updateViewport);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateViewport);
  }

  updateViewport = () =>
    (this.camera = {
      ...this.camera,
      width: window.innerWidth,
      height: window.innerHeight,
      unit: Math.max(window.innerWidth / 100, window.innerHeight / 100),
    });

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
          className="camera"
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
                distanceCulling={false}
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

export default Camera;
