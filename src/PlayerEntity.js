import React from "react";
import { connect } from "react-firebase";

import Positioner from "./Positioner";

class PlayerEntity extends React.Component {
  static defaultProps = {
    entityID: null,
    playerPosition: { x: 0, y: 0 },
    zoom: { scale: 0 },
    stats: null,
    command: null,
  };

  updatePlayerPosition = newPosition => {
    this.props.playerPosition.x = newPosition.x;
    this.props.playerPosition.y = newPosition.y;
  };

  render() {
    const {
      entityID,
      sectorID,
      playerPosition,
      zoom,
      stats,
      command,
    } = this.props;

    return (
      <Positioner
        position={playerPosition}
        offsetPosition={playerPosition}
        zoom={zoom}
        onChange={this.updatePlayerPosition}
      >
        <div className="playerEntity">Player</div>
      </Positioner>
    );
  }
}

export default connect(
  (props, ref) =>
    props.entityID
      ? {
          stats: `entities/${props.entityID}/state/stats`,
          command: `entities/${props.entityID}/command`,
        }
      : {}
)(PlayerEntity);
