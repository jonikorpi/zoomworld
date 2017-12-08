import React from "react";
import { connect } from "react-firebase";

import World from "./World";

class Player extends React.Component {
  static defaultProps = {
    userID: null,
    entityID: null,
  };

  render() {
    return <World {...this.props} />;
  }
}

export default connect(
  (props, ref) =>
    props.userID
      ? {
          entityID: `players/${props.userID}/session/entityID`,
        }
      : {}
)(Player);
