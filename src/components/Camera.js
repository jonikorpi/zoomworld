import React from "react";

import Loop from "../components/Loop";
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
    width: window.innerWidth,
    height: window.innerHeight,
    unit: 1,
  };

  componentDidMount() {
    this.updateViewport();
    window.addEventListener("resize", this.updateViewport);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateViewport);
  }

  updateViewport = () => {
    this.camera.width = window.innerWidth;
    this.camera.height = window.innerHeight;
    this.camera.unit =
      Math.max(window.innerWidth / 100, window.innerHeight / 100) * 5;
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
      <Loop>
        {loop => (
          <React.Fragment>
            <Zoomer onChange={this.updateScale} loop={loop} />

            <div
              className="camera"
              ref={element => {
                this.world = element;
              }}
            >
              {[...new Array(50)].map((nada, index) => {
                const x = Math.random() * 50 - 25;
                const y = Math.random() * 50 - 25;

                return (
                  <TestEntity key={index} x={x} y={y} moveAround={false}>
                    {({ state, events }) => (
                      <Position
                        state={state}
                        events={events}
                        camera={this.camera}
                        loop={loop}
                      >
                        <Tile x={x} y={y} tile={{ type: "plains" }} />
                      </Position>
                    )}
                  </TestEntity>
                );
              })}

              {[...new Array(100)].map((nada, index) => (
                <TestEntity
                  key={index}
                  x={(Math.random() * 500 - 250) / 10}
                  y={(Math.random() * 500 - 250) / 10}
                >
                  {({ state, events }) => (
                    <Position
                      state={state}
                      events={events}
                      camera={this.camera}
                      loop={loop}
                    >
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
                    loop={loop}
                  >
                    <div id="playerEntity">Player</div>
                  </Position>
                )}
              </TestEntity>
            </div>
          </React.Fragment>
        )}
      </Loop>
    );
  }
}

export default Camera;
