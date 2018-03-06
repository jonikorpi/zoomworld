import React from "react";

import FakeFirebase from "../components/FakeFirebase";
import Entity from "../components/Entity";
import InteractionSurface from "../components/InteractionSurface";
import LogMessage from "./LogMessage";
import PlayerUI from "./PlayerUI";

const testTileRadius = 10;
const testEntityRadius = 10;
const testTileCount = testTileRadius * testTileRadius;
const testEntityCount = testEntityRadius * testEntityRadius;

const tiles = [...new Array(testTileCount)].map((nada, index) => {
  const x = Math.floor(Math.random() * testTileRadius - testTileRadius / 2);
  const y = Math.floor(Math.random() * testTileRadius - testTileRadius / 2);

  return [x, y];
});
const players = [...new Array(testEntityCount)].map((nada, index) => {
  return {
    models: "player",
    state: {
      x: Math.random() * testEntityRadius - testEntityRadius / 2,
      y: Math.random() * testEntityRadius - testEntityRadius / 2,
      velocityX: 0,
      velocityY: 0,
    },
    events: [],
  };
});

export default class World extends React.Component {
  static defaultProps = {
    userID: null,
    subscribe: () => {},
    unsubscribe: () => {},
    registerCamera: () => {},
    unregisterCamera: () => {},
  };

  render() {
    const {
      subscribe,
      unsubscribe,
      registerCamera,
      unregisterCamera,
      userID,
    } = this.props;

    return (
      <React.Fragment>
        {tiles.map(([x, y], index) => (
          <FakeFirebase
            index={index + 134}
            key={index}
            x={Math.floor(x)}
            y={Math.floor(y)}
            moveAround={false}
          >
            {({ state, events }) => (
              <Entity
                subscribe={subscribe}
                unsubscribe={unsubscribe}
                state={state}
                events={events}
                mayMove={false}
                models={["tile", "tileShade"]}
              />
            )}
          </FakeFirebase>
        ))}

        {players.map(({ state: { x, y } }, index) => (
          <FakeFirebase key={index} index={index + 123} x={x} y={y}>
            {({ state, events }) => (
              <Entity
                subscribe={subscribe}
                unsubscribe={unsubscribe}
                state={state}
                events={events}
                models={["player", "playerShade"]}
              />
            )}
          </FakeFirebase>
        ))}

        <FakeFirebase moveAround={false}>
          {({ state, events }, addEvent) => (
            <PlayerUI>
              {({ currentTile }, updateCurrentTile) => (
                <React.Fragment>
                  <LogMessage>
                    <strong>Current</strong> [{currentTile[0]}, {currentTile[1]}]
                  </LogMessage>
                  {[...events].reverse().map((event, index) => (
                    <LogMessage key={index}>
                      <pre>
                        <strong>{event.type}</strong>{" "}
                        {JSON.stringify(event.data, null, 2)}
                      </pre>
                    </LogMessage>
                  ))}
                  <InteractionSurface addEvent={addEvent} />
                  <Entity
                    subscribe={subscribe}
                    unsubscribe={unsubscribe}
                    registerCamera={registerCamera}
                    unregisterCamera={unregisterCamera}
                    onUpdate={position => updateCurrentTile(position)}
                    state={state}
                    events={events}
                    models={["player", "playerShade"]}
                  />
                  <FakeFirebase
                    x={currentTile[0]}
                    y={currentTile[1]}
                    moveAround={false}
                  >
                    {({ state, events }) => (
                      <Entity
                        subscribe={subscribe}
                        unsubscribe={unsubscribe}
                        state={state}
                        events={events}
                        mayMove={false}
                        models={["tileOutline"]}
                      />
                    )}
                  </FakeFirebase>
                </React.Fragment>
              )}
            </PlayerUI>
          )}
        </FakeFirebase>
      </React.Fragment>
    );
  }
}
