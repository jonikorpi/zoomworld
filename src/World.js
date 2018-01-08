import React from "react";

import Loop from "./Loop";
import Zoomer from "./Zoomer";
import Positioner from "./Positioner";

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
            <Positioner
              key={index}
              position={{
                x: Math.random() * 500 - 250,
                y: Math.random() * 500 - 250,
              }}
              camera={this.camera}
            >
              {index}
            </Positioner>
          ))}

          <Positioner
            position={this.camera}
            camera={this.camera}
            onChange={this.updateCamera}
          >
            <div ref={element => (this.element = element)} id="playerEntity">
              Player
            </div>
          </Positioner>
        </div>
      </Loop>
    );
  }
}

export default World;
