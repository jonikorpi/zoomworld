import React from "react";

import FakeFirebase from "../components/FakeFirebase";
import Entity from "../components/Entity";
import InteractionSurface from "../components/InteractionSurface";
import LogMessage from "./LogMessage";

import { random, getSeed } from "../utilities/graphics";
import { stateAtTime } from "../utilities/state";

export default class World extends React.Component {
  static defaultProps = {
    userID: null,
    renderer: {},
    lagCompensation: 0,
  };

  state = {
    currentTile: [212, -39],
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
    const { renderer, userID, lagCompensation } = this.props;

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
            x: x + random(1, seed++),
            y: y + random(1, seed++),
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
                renderer={renderer}
                state={state}
                events={events}
                mayMove={false}
                models={hasGround ? ["tile", "tileShade"] : []}
              />
            )}
          </FakeFirebase>
        ))}

        {players.map(({ x, y, playerID }, index) => (
          <FakeFirebase key={playerID} index={index + 123} x={x} y={y}>
            {({ state, events }) => (
              <Entity
                renderer={renderer}
                state={state}
                events={events}
                models={["player", "playerShade"]}
                timeOffset={-200}
                shouldLerp={true}
              />
            )}
          </FakeFirebase>
        ))}

        <FakeFirebase moveAround={false} x={212} y={-39}>
          {({ state, events }, addEvent) => (
            <React.Fragment>
              <LogMessage>
                <pre>
                  <strong>state</strong> {JSON.stringify(state, null, 2)}
                </pre>
              </LogMessage>
              {[...events].map((event, index) => (
                <LogMessage key={index}>
                  <pre>
                    <strong>{event.type}</strong>{" "}
                    {JSON.stringify(event, null, 2)}
                  </pre>
                </LogMessage>
              ))}
              <InteractionSurface addEvent={addEvent} />
              <Entity
                renderer={renderer}
                shouldRegisterCamera={true}
                onUpdate={position => this.updateCurrentTile(position)}
                state={state}
                events={events}
                models={["player", "playerShade"]}
                shouldLerp={true}
              />
              {/* {[1000, 2000, 3000, 5000, 8000, 13000, 21000].map(offset => (
                <Entity
                  renderer={renderer}
                  state={state}
                  events={events}
                  models={["target"]}
                  shouldLerp={true}
                  timeOffset={offset}
                  key={offset}
                />
              ))} */}
              <Entity
                renderer={renderer}
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
