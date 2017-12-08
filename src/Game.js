import React from "react";

import FirebaseProvider from "./FirebaseProvider";
import Player from "./Player";

// Wrap in FirebaseAuth render prop
const Game = () => (
  <FirebaseProvider render={({ ...props }) => <Player {...props} />} />
);

export default Game;
