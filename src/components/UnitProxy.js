import React from "react";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import { connect } from "react-firebase";

const executeAction = (action, ...otherArguments) => {
  switch (action) {
    default:
      return console.warn("Unrecognized action. Skipping.");
  }
};

class UnitProxy extends React.Component {
  componentDidUpdate(previousProps) {
    const previousCommand = previousProps.command || {};
    const command = this.props.command || {};

    if (previousCommand.ID !== command.ID && command.ID) {
      console.log(`Executing command #${command.ID}: ${command.action}`);
      executeAction(command.action, command, this.props.userID);
    }
  }

  render() {
    return null;
  }
}

export default connect((props, ref) => ({
  command: `units/${props.unitID}/command`,
}))(UnitProxy);
