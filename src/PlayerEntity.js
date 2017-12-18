import React from "react";
import { connect } from "react-firebase";

import Positioner from "./Positioner";

class PlayerEntity extends React.Component {
  static defaultProps = {
    entityID: null,
    playerPosition: { x: 0, y: 0 },
    stats: null,
    command: null,
  };

  updateViewport = ({ x, y }) => {
    const dimensions = this.element.getBoundingClientRect();

    window.scroll(
      -window.innerWidth / 2 + dimensions.left + window.pageXOffset,
      -window.innerHeight / 2 + dimensions.top + window.pageYOffset
    );
  };

  render() {
    const { entityID, sectorID, playerPosition, stats, command } = this.props;

    return (
      <Positioner position={playerPosition} onChange={this.updateViewport}>
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
)(PlayerEntity);
