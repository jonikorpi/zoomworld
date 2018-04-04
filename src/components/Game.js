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
                    {renderer => (
                      <World
                        userID={userID}
                        player={player}
                        renderer={renderer}
                      />
                    )}
                  </Renderer>

                  <div className="hud" id="map">
                    <h1 className="safeAll pinTop">Map UI</h1>
                  </div>

                  <div className="hud" id="world">
                    <h1 className="safeAll pinBottom">World UI</h1>
                  </div>

                  <div className="hud" id="avatar">
                    <h1 className="safeAll pinTop">Avatar UI</h1>
                  </div>

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
