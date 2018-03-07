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
  const x = index % testTileRadius - testTileRadius / 2;
  const y = Math.floor(index / testTileRadius) - testTileRadius / 2;
  const angle = Math.sin(x + y) * Math.PI * 2;
  const hasGround = Math.random() < 0.5;

  return { x, y, angle, hasGround };
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
    lagCompensation: 0,
  };

  render() {
    const {
      subscribe,
      unsubscribe,
      registerCamera,
      unregisterCamera,
      userID,
      lagCompensation,
    } = this.props;

    return (
      <React.Fragment>
        {tiles.map(({ x, y, angle, hasGround }, index) => (
          <FakeFirebase
            index={index + 134}
            key={index}
            x={Math.floor(x) + 0.5}
            y={Math.floor(y) + 0.5}
            angle={angle}
            moveAround={false}
          >
            {({ state, events }) => (
              <Entity
                subscribe={subscribe}
                unsubscribe={unsubscribe}
                state={state}
                events={events}
                mayMove={false}
                models={hasGround ? ["tile", "tileShade", "wind"] : ["wind"]}
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
            <PlayerUI addEvent={addEvent}>
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
                        timeOffset={lagCompensation}
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
