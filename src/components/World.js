import React from "react";

import Position from "../components/Position";
import TestEntity from "../components/TestEntity";
import Tile from "../components/Tile";

import { random } from "../utilities/graphics.js";

const testTileRadius = 300;
const testEntityRadius = 100;

export default class World extends React.PureComponent {
  static defaultProps = {
    userID: null,
  };

  counter = 123;

  render() {
    return (
      <React.Fragment>
        {[...new Array(25)].map((nada, index) => {
          const x =
            random(1, this.counter++) * testTileRadius - testTileRadius / 2;
          const y =
            random(1, this.counter++) * testTileRadius - testTileRadius / 2;

          return (
            <TestEntity
              index={index + 134}
              key={index}
              x={x}
              y={y}
              moveAround={false}
            >
              {({ state, events }) => (
                <Position state={state} events={events} centered={false}>
                  <Tile x={x} y={y} tile={{ type: "plains" }} />
                </Position>
              )}
            </TestEntity>
          );
        })}

        {[...new Array(100)].map((nada, index) => (
          <TestEntity
            key={index}
            index={index + 123}
            x={
              random(1, this.counter++) * testEntityRadius -
              testEntityRadius / 2
            }
            y={
              random(1, this.counter++) * testEntityRadius -
              testEntityRadius / 2
            }
          >
            {({ state, events }) => (
              <Position state={state} events={events}>
                Entity&nbsp;#{index}
              </Position>
            )}
          </TestEntity>
        ))}
      </React.Fragment>
    );
  }
}
