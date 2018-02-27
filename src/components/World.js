import React from "react";

import Position from "../components/Position";
import TestEntity from "../components/TestEntity";
import SVG from "../components/SVG";
import Graphic from "../components/Graphic";

import { config, getSeed, baseTile, random } from "../utilities/graphics.js";

const testTileRadius = 10;
const testEntityRadius = 10;
const testTileCount = testTileRadius * testTileRadius;
const testEntityCount = testEntityRadius * testEntityRadius;

export default class World extends React.PureComponent {
  static defaultProps = {
    userID: null,
    offsetX: 0,
    offsetY: 0,
  };

  counter = 123;

  render() {
    const { offsetX, offsetY } = this.props;

    return (
      <React.Fragment>
        {[...new Array(testTileCount)].map((nada, index) => {
          const x =
            random(1, this.counter++) * testTileRadius - testTileRadius / 2;
          const y =
            random(1, this.counter++) * testTileRadius - testTileRadius / 2;

          return (
            <TestEntity
              index={index + 134}
              key={index}
              x={offsetX + Math.floor(x)}
              y={offsetY + Math.floor(y)}
              moveAround={false}
            >
              {({ state, events }) => {
                const tile = baseTile(getSeed(x, y))
                  .join(" ")
                  .toString();

                return (
                  <React.Fragment>
                    <Position state={state} events={events} mergeZ={true}>
                      <SVG>
                        <Graphic type="waterLine" points={tile} />
                      </SVG>
                    </Position>
                    <Position state={state} events={events} z={1} mergeZ={true}>
                      <SVG>
                        <Graphic
                          type="ground"
                          fill="var(--ground3)"
                          points={tile}
                        />
                      </SVG>
                    </Position>
                    <Position state={state} events={events} z={2} mergeZ={true}>
                      <SVG>
                        <Graphic
                          type="ground"
                          fill="var(--ground2)"
                          points={tile}
                        />
                      </SVG>
                    </Position>
                    <Position state={state} events={events} z={3} mergeZ={true}>
                      <SVG>
                        <Graphic
                          type="ground"
                          fill="var(--ground)"
                          points={tile}
                        />
                      </SVG>
                    </Position>
                  </React.Fragment>
                );
              }}
            </TestEntity>
          );
        })}

        {[...new Array(testEntityCount)].map((nada, index) => (
          <TestEntity
            key={index}
            index={index + 123}
            x={
              offsetX +
              random(1, this.counter++) * testEntityRadius -
              testEntityRadius / 2
            }
            y={
              offsetY +
              random(1, this.counter++) * testEntityRadius -
              testEntityRadius / 2
            }
          >
            {({ state, events }) => (
              <React.Fragment>
                <Position state={state} events={events}>
                  #{index}
                </Position>
                <Position state={state} events={events} z={1}>
                  #{index}
                </Position>
                <Position state={state} events={events} z={2}>
                  #{index}
                </Position>
                <Position state={state} events={events} z={3}>
                  #{index}
                </Position>
                <Position state={state} events={events} z={4}>
                  #{index}
                </Position>
              </React.Fragment>
            )}
          </TestEntity>
        ))}
      </React.Fragment>
    );
  }
}
