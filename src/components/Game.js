import React from "react";

import LogMessage from "./LogMessage";
import FirebaseUser from "./FirebaseUser";
import Firebase from "./Firebase";
import Renderer from "./Renderer";
import World from "./World";

export default class Game extends React.Component {
  render() {
    // const { isDevelopment } = this.props;

    return (
      <FirebaseUser>
        {({ userID }) => (
          <Firebase
            query={
              userID
                ? {
                    player: {
                      path: `players/${userID}`,
                      // orderByChild: "playerID",
                      // equalTo: userID,
                    },
                    online: ".info/connected",
                  }
                : null
            }
          >
            {({ player, online }) => {
              return (
                <React.Fragment>
                  <Renderer>
                    {({
                      subscribe,
                      unsubscribe,
                      registerCamera,
                      unregisterCamera,
                    }) => (
                      <World
                        userID={userID}
                        player={player}
                        subscribe={subscribe}
                        unsubscribe={unsubscribe}
                        registerCamera={registerCamera}
                        unregisterCamera={unregisterCamera}
                      />
                    )}
                  </Renderer>

                  {!online && (
                    <LogMessage>
                      Offline, connecting to database…{" "}
                      <button
                        type="button"
                        className="buttonWithDelayedReveal"
                        onClick={window.location.reload}
                      >
                        Turn it off and on again
                      </button>
                    </LogMessage>
                  )}

                  {player === undefined && (
                    <LogMessage>Checking player data…</LogMessage>
                  )}
                  {!userID && <LogMessage>Signing in…</LogMessage>}
                </React.Fragment>
              );
            }}
          </Firebase>
        )}
      </FirebaseUser>
    );
  }
}
