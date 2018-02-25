import React from "react";
import Loadable from "react-loadable";

import Loader from "./Loader";
import LogMessage from "./LogMessage";

import FirebaseUser from "./FirebaseUser";
import Firebase from "./Firebase";

const WaypointUI = Loadable({
  loader: () => import("./WaypointUI"),
  loading: Loader,
});
const WorldUI = Loadable({
  loader: () => import("./WorldUI"),
  loading: Loader,
});
const PlayerProxy = Loadable({
  loader: () => import("./PlayerProxy"),
  loading: Loader,
});

const checkForHeroUnit = (found, unit) => (unit.type === "hero" ? true : found);

export default class Game extends React.Component {
  render() {
    const { isDevelopment } = this.props;

    return (
      <FirebaseUser>
        {({ userID }) => (
          <Firebase
            query={{
              units: {
                path: "units",
                orderByChild: "playerID",
                equalTo: userID,
              },
              online: ".info/connected",
            }}
          >
            {({ units, online }) => {
              const loading = units === undefined;
              // const unitList =
              //   units &&
              //   Object.keys(units).map(unitID => ({
              //     unitID: unitID,
              //     ...units[unitID],
              //   }));
              // const heroUnitExists =
              //   unitList && unitList.reduce(checkForHeroUnit, false);

              return (
                <React.Fragment>
                  {!loading && (
                    <React.Fragment>
                      <WorldUI userID={userID} />
                      {/* {heroUnitExists && (
                        <WorldUI userID={userID} ownUnits={unitList} />
                      )}
                      {!heroUnitExists && <WaypointUI userID={userID} />} */}
                      {/* {<PlayerProxy userID={userID} />} */}
                    </React.Fragment>
                  )}

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

                  {loading && <LogMessage>Checking player data…</LogMessage>}
                </React.Fragment>
              );
            }}
          </Firebase>
        )}
      </FirebaseUser>
    );
  }
}
