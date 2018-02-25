import React from "react";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import { connect } from "react-firebase";

import { listTilesInRange, rules } from "../utilities/helpers.js";

const executeAction = (action, ...otherArguments) => {
  switch (action) {
    case "spawn":
      return spawnPlayer(...otherArguments);
    case "concede":
      return despawnPlayer(...otherArguments);
    default:
      return console.warn("Unrecognized action. Skipping.");
  }
};

const despawnPlayer = async (command, userID) => {
  console.log(`Despawning player ${userID}`);

  // Despawn all units
  const units = await firebase
    .database()
    .ref("units")
    .orderByChild("playerID")
    .equalTo(userID)
    .once("value");

  units.forEach(unit => {
    despawnUnit(unit.key);
  });

  return;
};

const despawnUnit = unitID => {
  // Delete unit
  firebase
    .database()
    .ref(`units/${unitID}`)
    .remove();
};

const spawnPlayer = async (command, userID) => {
  await despawnPlayer(command, userID);

  console.log(`Spawning player ${userID}`);

  // Create hero unit
  firebase
    .database()
    .ref("units")
    .push({
      type: "hero",
      playerID: userID,
      location: `${Math.floor(Math.random() * 1000 - 500)},${Math.floor(
        Math.random() * 1000 - 500
      )}`,
    });
};

class PlayerProxy extends React.Component {
  componentDidUpdate() {
    const { commands } = this.props;

    commands &&
      Object.keys(commands).forEach(commandID => {
        const command = commands[commandID];

        if (!command.processed) {
          executeAction(command.action, command, this.props.userID);
          firebase
            .database()
            .ref(`players/${this.props.userID}/commands/${commandID}`)
            .update({ processed: true });
        }

        if (command.time + 10000 < Date.now()) {
          firebase
            .database()
            .ref(`players/${this.props.userID}/commands/${commandID}`)
            .remove();
        }
      });
  }

  render() {
    return null;
  }
}

export default connect((props, ref) => ({
  commands: `players/${props.userID}/commands`,
}))(PlayerProxy);
