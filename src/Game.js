import React from "react";

import FirebaseUser from "./FirebaseUser";
import StatusMessage from "./StatusMessage";
import World from "./World";

const Game = () => (
  <FirebaseUser>
    {props => (
      <React.Fragment>
        {!props.userID && <StatusMessage>Signing in…</StatusMessage>}
        <World {...props} />
      </React.Fragment>
    )}
  </FirebaseUser>
);

export default Game;
