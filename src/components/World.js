import React from "react";

import TestEntity from "../components/TestEntity";
import TestTile from "../components/TestTile";
import TestPlayer from "../components/TestPlayer";
import InteractionSurface from "../components/InteractionSurface";

const testTileRadius = 10;
const testEntityRadius = 10;
const testTileCount = testTileRadius * testTileRadius;
const testEntityCount = testEntityRadius * testEntityRadius;

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

        <TestEntity>
          {({ state, events }) => (
            <React.Fragment>
              <InteractionSurface createEvent={event => console.log(event)} />
              <TestPlayer
                playerID={userID}
                subscribe={subscribe}
                unsubscribe={unsubscribe}
                registerCamera={registerCamera}
                unregisterCamera={unregisterCamera}
                state={state}
                events={events}
              />
            </React.Fragment>
          )}
        </TestEntity>
      </React.Fragment>
    );
  }
}
