import React from "react";

import TestEntity from "../components/TestEntity";
import TestTile from "../components/TestTile";
import TestPlayer from "../components/TestPlayer";
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
const entities = [...new Array(testEntityCount)].map((nada, index) => {
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
          <TestEntity
            index={index + 134}
            key={index}
            x={Math.floor(x)}
            y={Math.floor(y)}
            moveAround={false}
          >
            {({ state, events }) => (
              <TestTile
                x={x}
                y={y}
                subscribe={subscribe}
                unsubscribe={unsubscribe}
                state={state}
                events={events}
              />
            )}
          </TestEntity>
        ))}

        {entities.map(({ state: { x, y } }, index) => (
          <TestEntity key={index} index={index + 123} x={x} y={y}>
            {({ state, events }) => (
              <TestPlayer
                playerID={`dsajiofs${Math.ceil(Math.random() * 10000)}`}
                subscribe={subscribe}
                unsubscribe={unsubscribe}
                state={state}
                events={events}
              />
            )}
          </TestEntity>
        ))}

        <TestEntity moveAround={false}>
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
                  <TestPlayer
                    playerID={userID}
                    subscribe={subscribe}
                    unsubscribe={unsubscribe}
                    registerCamera={registerCamera}
                    unregisterCamera={unregisterCamera}
                    onUpdate={position => updateCurrentTile(position)}
                    state={state}
                    events={events}
                  />
                </React.Fragment>
              )}
            </PlayerUI>
          )}
        </TestEntity>
      </React.Fragment>
    );
  }
}
