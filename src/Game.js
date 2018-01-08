import React from "react";

import FirebaseUser from "./FirebaseUser";
import Player from "./Player";

const Game = () => (
  <FirebaseUser>{props => <Player {...props} />}</FirebaseUser>
);

export default Game;
