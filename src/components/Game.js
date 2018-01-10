import React from "react";

import FirebaseUser from "../components/FirebaseUser";
import StatusMessage from "../components/StatusMessage";
import Camera from "../components/Camera";

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
