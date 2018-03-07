import React from "react";

import FakeFirebase from "../components/FakeFirebase";
import Entity from "../components/Entity";
import InteractionSurface from "../components/InteractionSurface";
import LogMessage from "./LogMessage";

import { random, getSeed } from "../utilities/graphics";

export default class World extends React.Component {
  static defaultProps = {
    userID: null,
    subscribe: () => {},
    unsubscribe: () => {},
    registerCamera: () => {},
    unregisterCamera: () => {},
    lagCompensation: 0,
  };

  state = {
    currentTile: [0, 0],
    vision: 5,
  };

  updateCurrentTile = position => {
    const [x, y] = this.state.currentTile;
    const newX = Math.floor(position[0]);
    const newY = Math.floor(position[1]);

    if (newX !== x || newY !== y) {
      this.setState({ currentTile: [newX, newY] });
    }
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

    const { currentTile, vision } = this.state;

    let tiles = [];
    for (let x = currentTile[0] - vision; x <= currentTile[0] + vision; x++) {
      for (let y = currentTile[1] - vision; y <= currentTile[1] + vision; y++) {
        let seed = getSeed(x, y);
        const angle = Math.sin(x + y) * Math.PI * 2;
        const hasGround = random(1, seed++) < 0.3;
        const playerCount = Math.floor(random(5, seed++));

        let players = [];
        for (let index = 0; index < playerCount; index++) {
          players.push({
            x: x,
            y: y,
            playerID: `player-${x}-${y}-${index}`,
          });
        }

        tiles.push({ x, y, angle, hasGround, players });
      }
    }

    const players = tiles.reduce((players, tile) => {
      return [...players, ...tile.players];
    }, []);

    return (
      <React.Fragment>
        {tiles.map(({ x, y, angle, hasGround }, index) => (
          <FakeFirebase
            index={index + 134}
            key={`${x},${y}`}
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

        {players.map(({ x, y, playerID }, index) => (
          <FakeFirebase key={playerID} index={index + 123} x={x} y={y}>
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
                onUpdate={position => this.updateCurrentTile(position)}
                state={state}
                events={events}
                models={["player", "playerShade"]}
                timeOffset={lagCompensation}
              />
              <Entity
                subscribe={subscribe}
                unsubscribe={unsubscribe}
                state={{ x: currentTile[0], y: currentTile[1] }}
                mayMove={false}
                models={["tileOutline"]}
              />
            </React.Fragment>
          )}
        </FakeFirebase>
      </React.Fragment>
    );
  }
}
