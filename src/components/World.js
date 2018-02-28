import React from "react";

// import Position from "../components/Position";
import TestEntity from "../components/TestEntity";
// import SVG from "../components/SVG";
// import Graphic from "../components/Graphic";

import { config, getSeed, baseTile, random } from "../utilities/graphics.js";
import { positionAtTime, calculateAngle } from "../utilities/state.js";

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
        tile: baseTile(getSeed(x, y))
          .join(" ")
          .toString(),
        state: {
          x,
          y,
        },
        events: [],
      };
    }),
    entities: [...new Array(testEntityCount)].map((nada, index) => {
      return {
        state: {
          x: Math.random() * testEntityRadius - testEntityRadius / 2,
          y: Math.random() * testEntityRadius - testEntityRadius / 2,
          velocityX: 0,
          velocityY: 0,
        },
        events: [],
      };
    }),
  };

  componentDidMount() {
    const { subscribe, regl } = this.props.renderer;
    subscribe(this.update);

    const triangle = [[0.25, 0], [-0.125, -0.125], [-0.125, 0.125]];

    this.drawPlayers = regl({
      frag: `
        precision mediump float;

        void main() {
          gl_FragColor = vec4(1, 1, 1, 1);
        }`,

      vert: `
        precision mediump float;
        attribute vec2 position;
        attribute vec3 offset;
        uniform float viewportWidth;
        uniform float viewportHeight;
        uniform float unit;
        uniform vec2 camera;

        void main() {
          vec2 rotatedPosition = vec2(
            position[0] * cos(offset[2]) - position[1] * sin(offset[2]),
            position[1] * cos(offset[2]) + position[0] * sin(offset[2])
          );
          vec2 translatedPosition = rotatedPosition + vec2(offset[0], offset[1]) - camera;
          vec2 scaledPosition = vec2(
            (translatedPosition[0] * unit) / viewportWidth, 
            (translatedPosition[1] * unit) / viewportHeight
          );
          gl_Position = vec4(scaledPosition, 0, 1);
        }`,

      attributes: {
        position: (context, { players, time, camera }) => {
          return [triangle, ...players.map(() => triangle)];
        },
        offset: (context, { players, time, camera }) => {
          const cameraPosition = [
            camera.x,
            camera.y,
            Math.atan2(camera.velocityY, camera.velocityX),
          ];
          return [
            [cameraPosition, cameraPosition, cameraPosition],
            ...players.map(({ state, events }) => {
              const { x, y, velocityX, velocityY } = positionAtTime(
                time,
                state,
                events
              );
              const position = [x, y, Math.atan2(velocityY, velocityX)];
              return [position, position, position];
            }),
          ];
        },
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

      count: (context, { players, time, camera }) =>
        triangle.length * (players.length + 1),

      depth: {
        enable: false,
      },
    });

    const square = [
      [-0.5, -0.5],
      [-0.5, 0.5],
      [0.5, -0.5],
      [-0.5, 0.5],
      [0.5, 0.5],
      [0.5, -0.5],
    ];

    this.drawTiles = regl({
      frag: `
        precision mediump float;

        void main() {
          gl_FragColor = vec4(0, 0, 0, 1);
        }`,

      vert: `
        precision mediump float;
        attribute vec2 position;
        attribute vec2 offset;
        uniform float viewportWidth;
        uniform float viewportHeight;
        uniform float unit;
        uniform vec2 camera;

        void main() {
          vec2 translatedPosition = position - offset - camera;
          vec2 scaledPosition = vec2(
            (translatedPosition[0] * unit) / viewportWidth, 
            (translatedPosition[1] * unit) / viewportHeight
          );
          gl_Position = vec4(scaledPosition, 0, 1);
        }`,

      attributes: {
        position: (context, { tiles, time, camera }) =>
          tiles.map(({ state, events }) => square),
        offset: (context, { tiles, time, camera }) =>
          tiles.map(({ state, events }) => {
            const { x, y } = positionAtTime(time, state, events);
            const position = [x, y];
            return [position, position, position, position, position, position];
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

      count: (context, { tiles }) => tiles.length * square.length,

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
        {tiles.map(({ state: { x, y }, tile }, index) => {
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

        {entities.map(({ state: { x, y } }, index) => (
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
