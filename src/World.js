import React from "react";
// import { connect } from "react-firebase";

import Loop from "./Loop";
import Zoomer from "./Zoomer";
import Positioner from "./Positioner";
import PlayerData from "./PlayerData";

// https://medium.com/@dtipson/creating-an-es6ish-compose-in-javascript-ac580b95104a
// const compose = (...fns) => fns.reduce((f, g) => (...args) => f(g(...args)));

class World extends React.Component {
  static defaultProps = {
    userID: null,
    entityID: null,
    sectorID: null,
    canSee: null,
    system: null,
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
    const { entityID, sectorID } = this.props;

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

          <PlayerData
            entityID={entityID}
            sectorID={sectorID}
            camera={this.camera}
            updateCamera={this.updateCamera}
          />
        </div>
      </Loop>
    );
  }
}

export default World;

// export default compose(
//   connect(
//     (props, ref) =>
//       props.entityID
//         ? {
//             sectorID: `entities/${props.entityID}/state/sectorID`,
//             canSee: `entities/${props.entityID}/state/canSee`,
//           }
//         : {}
//   ),
//   connect(
//     (props, ref) =>
//       props.sectorID
//         ? { system: `systems/${props.sectorID.split("~")[0]}` }
//         : {}
//   )
// )(World);
