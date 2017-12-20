import React from "react";
import { connect } from "react-firebase";

import Positioner from "./Positioner";

class PlayerData extends React.Component {
  static defaultProps = {
    entityID: null,
    camera: { x: 0, y: 0, scale: 1 },
    stats: null,
    command: null,
  };

  render() {
    const {
      entityID,
      sectorID,
      camera,
      stats,
      command,
      updateCamera,
    } = this.props;

    return (
      <Positioner position={camera} camera={camera} onChange={updateCamera}>
        <div ref={element => (this.element = element)} id="playerEntity">
          Player
        </div>
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
)(PlayerData);
