import React from "react";

import FirebaseUser from "./FirebaseUser";
import StatusMessage from "./StatusMessage";
import Camera from "./Camera";

const Game = () => (
  <FirebaseUser>
    {props => (
      <React.Fragment>
        {!props.userID && <StatusMessage>Signing in…</StatusMessage>}
        <Camera {...props} />
      </React.Fragment>
    )}
  </FirebaseUser>
);

export default Game;
