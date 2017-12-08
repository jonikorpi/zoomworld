import React from "react";
import { connect } from "react-firebase";
import { Loop } from "react-game-kit";

import Zoomer from "./Zoomer";
import PlayerEntity from "./PlayerEntity";

// https://medium.com/@dtipson/creating-an-es6ish-compose-in-javascript-ac580b95104a
const compose = (...fns) => fns.reduce((f, g) => (...args) => f(g(...args)));

class World extends React.Component {
  static defaultProps = {
    userID: null,
    entityID: null,
    sectorID: null,
    canSee: null,
    system: null,
  };

  playerPosition = { x: 0, y: 0 };
  zoom = { scale: 1 };

  updateZoom = newScale => {
    this.zoom.scale = newScale;
  };

  render() {
    const { entityID, sectorID } = this.props;

    return (
      <Loop>
        <div
          className="world"
          ref={element => {
            this.world = element;
          }}
        >
          <Zoomer zoom={this.zoom} onChange={this.updateZoom} />
          {/* <Map zoom={this.zoom}/> */}
          {/* <Sectors playerPosition={this.playerPosition} zoom={this.zoom}/> */}
          <PlayerEntity
            entityID={entityID}
            sectorID={sectorID}
            playerPosition={this.playerPosition}
            zoom={this.zoom}
          />
        </div>
      </Loop>
    );
  }
}

export default compose(
  connect(
    (props, ref) =>
      props.entityID
        ? {
            sectorID: `entities/${props.entityID}/state/sectorID`,
            canSee: `entities/${props.entityID}/state/canSee`,
          }
        : {}
  ),
  connect(
    (props, ref) =>
      props.sectorID
        ? { system: `systems/${props.sectorID.split("~")[0]}` }
        : {}
  )
)(World);
