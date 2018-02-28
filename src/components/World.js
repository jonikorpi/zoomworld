import React from "react";

// import Position from "../components/Position";
import TestEntity from "../components/TestEntity";
// import SVG from "../components/SVG";
// import Graphic from "../components/Graphic";

import { config, getSeed, baseTile, random } from "../utilities/graphics.js";
import { positionAtTime } from "../utilities/state.js";

const testTileRadius = 10;
const testEntityRadius = 10;
const testTileCount = testTileRadius * testTileRadius;
const testEntityCount = testEntityRadius * testEntityRadius;

export default class World extends React.PureComponent {
  static defaultProps = {
    userID: null,
    renderer: null,
  };

  state = {
    tiles: [...new Array(testTileCount)].map((nada, index) => {
      const x = Math.random() * testTileRadius - testTileRadius / 2;
      const y = Math.random() * testTileRadius - testTileRadius / 2;
      return {
        x,
        y,
        tile: baseTile(getSeed(x, y))
          .join(" ")
          .toString(),
        state: {},
        events: [],
      };
    }),
    entities: [...new Array(testEntityCount)].map((nada, index) => {
      return {
        x: Math.random() * testEntityRadius - testEntityRadius / 2,
        y: Math.random() * testEntityRadius - testEntityRadius / 2,
        state: {},
        events: [],
      };
    }),
  };

  componentDidMount() {
    const { subscribe, regl } = this.props.renderer;
    subscribe(this.update);

    this.drawPlayers = regl({
      frag: `
        precision mediump float;

        void main() {
          gl_FragColor = vec4(1, 1, 1, 1);
        }`,

      vert: `
        precision mediump float;
        attribute vec2 position;
        uniform float viewportWidth;
        uniform float viewportHeight;
        uniform float unidt;
        uniform vec2 camera;

        void main() {
          vec2 positionAfterCamera = position - camera;
          vec2 scaledPosition = vec2(
            (positionAfterCamera[0] * unit) / viewportWidth, 
            (positionAfterCamera[1] * unit) / viewportHeight
          );
          gl_Position = vec4(scaledPosition, 0, 1);
        }`,

      attributes: {
        // position: [[0, 0], [0, 1], [1, 1]],
        position: (context, { players, time, camera }) => [
          [
            [0 + camera.x, 0.125 + camera.y],
            [0.125 + camera.x, -0.125 + camera.y],
            [-0.125 + camera.x, -0.125 + camera.y],

            [0 + camera.x, 0.125 + camera.y - 0.0625],
            [0.125 + camera.x, -0.125 + camera.y - 0.0625],
            [-0.125 + camera.x, -0.125 + camera.y - 0.0625],

            [0 + camera.x, 0.125 + camera.y - 0.0625 * 2],
            [0.125 + camera.x, -0.125 + camera.y - 0.0625 * 2],
            [-0.125 + camera.x, -0.125 + camera.y - 0.0625 * 2],

            [0 + camera.x, 0.125 + camera.y - 0.0625 * 3],
            [0.125 + camera.x, -0.125 + camera.y - 0.0625 * 3],
            [-0.125 + camera.x, -0.125 + camera.y - 0.0625 * 3],
          ],
          ...players.map(({ state, events }) => {
            const { x, y } = positionAtTime(time, state, events);
            return [
              [0 + x, 0.125 + y],
              [0.125 + x, -0.125 + y],
              [-0.125 + x, -0.125 + y],

              [0 + x, 0.125 + y - 0.0625],
              [0.125 + x, -0.125 + y - 0.0625],
              [-0.125 + x, -0.125 + y - 0.0625],

              [0 + x, 0.125 + y - 0.0625 * 2],
              [0.125 + x, -0.125 + y - 0.0625 * 2],
              [-0.125 + x, -0.125 + y - 0.0625 * 2],

              [0 + x, 0.125 + y - 0.0625 * 3],
              [0.125 + x, -0.125 + y - 0.0625 * 3],
              [-0.125 + x, -0.125 + y - 0.0625 * 3],
            ];
          }),
        ],
      },
      uniforms: {
        viewportWidth: ({ viewportWidth }) => viewportWidth,
        viewportHeight: ({ viewportHeight }) => viewportHeight,
        unit: ({ viewportWidth, viewportHeight }, { scale }) =>
          Math.min(viewportWidth, viewportHeight) *
          config.unitSize /
          50 *
          scale,
        camera: (context, { camera }) => [camera.x, camera.y],
      },

      count: (context, { players }) => (players.length + 1) * 12,

      depth: {
        enable: false,
      },
    });

    this.drawTiles = regl({
      frag: `
        precision mediump float;

        void main() {
          gl_FragColor = vec4(0, 0, 0, 1);
        }`,

      vert: `
        precision mediump float;
        attribute vec2 position;
        uniform float viewportWidth;
        uniform float viewportHeight;
        uniform float unit;
        uniform vec2 camera;

        void main() {
          vec2 positionAfterCamera = position - camera;
          vec2 scaledPosition = vec2(
            (positionAfterCamera[0] * unit) / viewportWidth, 
            (positionAfterCamera[1] * unit) / viewportHeight
          );
          gl_Position = vec4(scaledPosition, 0, 1);
        }`,

      attributes: {
        // position: [[0, 0], [0, 1], [1, 1]],
        position: (context, { tiles, time, camera }) =>
          tiles.map(({ state, events }) => {
            const { x, y } = positionAtTime(time, state, events);
            return [
              [-0.5 + x, -0.5 + y],
              [-0.5 + x, 0.5 + y],
              [0.5 + x, -0.5 + y],

              [-0.5 + x, 0.5 + y],
              [0.5 + x, 0.5 + y],
              [0.5 + x, -0.5 + y],

              [-0.5 + x + 0.0625, -0.5 + y - 0.0625],
              [-0.5 + x + 0.0625, 0.5 + y - 0.0625],
              [0.5 + x + 0.0625, -0.5 + y - 0.0625],

              [-0.5 + x + 0.0625, 0.5 + y - 0.0625],
              [0.5 + x + 0.0625, 0.5 + y - 0.0625],
              [0.5 + x + 0.0625, -0.5 + y - 0.0625],
            ];
          }),
      },
      uniforms: {
        viewportWidth: ({ viewportWidth }) => viewportWidth,
        viewportHeight: ({ viewportHeight }) => viewportHeight,
        unit: ({ viewportWidth, viewportHeight }, { scale }) =>
          Math.min(viewportWidth, viewportHeight) *
          config.unitSize /
          50 *
          scale,
        camera: (context, { camera }) => [camera.x, camera.y],
      },

      count: (context, { tiles }) => tiles.length * 12,

      depth: {
        enable: false,
      },
    });
  }

  componentWillUnmount() {
    this.props.renderer.unsubscribe(this.update);
  }

  update = (time, camera, scale) => {
    // console.log(time, context, camera, scale);
    this.drawTiles({ time, camera, scale, tiles: this.state.tiles });
    this.drawPlayers({ time, camera, scale, players: this.state.entities });
  };

  render() {
    const { tiles, entities } = this.state;

    return (
      <React.Fragment>
        {tiles.map(({ x, y, tile }, index) => {
          return (
            <TestEntity
              index={index + 134}
              key={index}
              x={Math.floor(x)}
              y={Math.floor(y)}
              moveAround={false}
            >
              {({ state, events }) => {
                this.state.tiles[index].state = state;
                this.state.tiles[index].events = events;
                return null;

                {
                  /* return (
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
                ); */
                }
              }}
            </TestEntity>
          );
        })}

        {entities.map(({ x, y }, index) => (
          <TestEntity key={index} index={index + 123} x={x} y={y}>
            {({ state, events }) => {
              this.state.entities[index].state = state;
              this.state.entities[index].events = events;
              return null;

              {
                /* return (
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
              ); */
              }
            }}
          </TestEntity>
        ))}
      </React.Fragment>
    );
  }
}
