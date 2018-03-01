import React from "react";

// import Position from "../components/Position";
import TestEntity from "../components/TestEntity";
// import SVG from "../components/SVG";
// import Graphic from "../components/Graphic";

import { config, getSeed, baseTile, random } from "../utilities/graphics.js";
import { positionAtTime } from "../utilities/state.js";
import triangulate from "../utilities/triangulate.js";

const testTileRadius = 10;
const testEntityRadius = 10;
const testTileCount = testTileRadius * testTileRadius;
const testEntityCount = testEntityRadius * testEntityRadius;

const layers = [0, 1, 2, 3];
const triangle = [[0.25, 0], [-0.125, -0.125], [-0.125, 0.125]];

export default class World extends React.PureComponent {
  static defaultProps = {
    userID: null,
    renderer: null,
  };

  state = {
    tiles: [...new Array(testTileCount)].map((nada, index) => {
      const x = Math.floor(Math.random() * testTileRadius - testTileRadius / 2);
      const y = Math.floor(Math.random() * testTileRadius - testTileRadius / 2);

      return {
        tile: triangulate(baseTile(getSeed(x, y))),
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

    const uniforms = {
      viewportWidth: ({ viewportWidth }) => viewportWidth,
      viewportHeight: ({ viewportHeight }) => viewportHeight,
      unit: ({ viewportWidth, viewportHeight }, { scale }) =>
        Math.min(viewportWidth, viewportHeight) * config.unitSize / 50 * scale,
      camera: (context, { camera }) => [camera.x, camera.y],
      perspective: 0.0382,
    };
    const depth = {
      enable: false,
    };

    this.drawPlayers = regl({
      frag: `
        precision mediump float;

        varying vec4 color;

        void main() {
          gl_FragColor = color;
        }`,

      vert: `
        precision mediump float;
        uniform float viewportWidth;
        uniform float viewportHeight;
        uniform float unit;
        uniform float perspective;
        uniform vec2 camera;

        attribute vec2 position;
        attribute vec2 offset;
        attribute float angle;
        attribute float layer;

        varying vec4 color;

        void main() {
          vec2 rotatedPosition = vec2(
            position[0] * cos(angle) - position[1] * sin(angle),
            position[1] * cos(angle) + position[0] * sin(angle)
          );
          vec2 translatedPosition = rotatedPosition + offset - camera;
          vec2 shiftedPosition = vec2(
            translatedPosition[0], 
            translatedPosition[1] + perspective * layer
          );
          vec2 scaledPosition = vec2(
            (shiftedPosition[0] * unit) / viewportWidth, 
            (shiftedPosition[1] * unit) / viewportHeight
          );
          gl_Position = vec4(scaledPosition, 0, 1);
          float shade = 0.0 + layer / 3.0;
          color = vec4(shade, shade, shade, 1.0);
        }`,

      attributes: {
        position: (context, { playerPositions }) => playerPositions,
        offset: (context, { playerOffsets }) => playerOffsets,
        layer: (context, { playerLayers }) => playerLayers,
        angle: (context, { playerAngles }) => playerAngles,
      },

      uniforms: uniforms,
      count: (context, { playerOffsets }) => playerOffsets.length,
      depth: depth,
    });

    this.drawTiles = regl({
      frag: `
        precision mediump float;
        varying vec4 color;

        void main() {
          gl_FragColor = color;
        }`,

      vert: `
        precision mediump float;
        uniform float viewportWidth;
        uniform float viewportHeight;
        uniform float unit;
        uniform float perspective;
        uniform vec2 camera;

        attribute vec2 position;
        attribute vec2 offset;
        attribute float layer;

        varying vec4 color;

        void main() {
          vec2 translatedPosition = position + offset - camera;
          vec2 shiftedPosition = vec2(
            translatedPosition[0], 
            translatedPosition[1] + perspective * layer
          );
          vec2 scaledPosition = vec2(
            (shiftedPosition[0] * unit) / viewportWidth, 
            (shiftedPosition[1] * unit) / viewportHeight
          );
          gl_Position = vec4(scaledPosition, 0, 1);
          float shade = 0.0 + layer / 8.0;
          color = vec4(shade, shade, shade, 1.0);
        }`,

      attributes: {
        position: (context, { tilePositions }) => tilePositions,
        offset: (context, { tileOffsets }) => tileOffsets,
        layer: (context, { tileLayers }) => tileLayers,
      },

      uniforms: uniforms,
      count: (context, { tilePositions }) => tilePositions.length,
      depth: depth,
    });
  }

  componentWillUnmount() {
    this.props.renderer.unsubscribe(this.update);
  }

  update = (time, camera, scale) => {
    const tiles = this.state.tiles.map(({ tile, state, events }) => ({
      offset: positionAtTime(time, state, events),
      tile: tile,
    }));
    const tilePositions = [];
    const tileOffsets = [];
    const tileLayers = [];

    layers.forEach(layer =>
      tiles.forEach(({ tile, offset: { x, y } }) => {
        tilePositions.push(...tile);
        tile.forEach(vertex => {
          tileOffsets.push([x, y]);
          tileLayers.push(layer);
        });
      })
    );

    this.drawTiles({
      time,
      camera,
      scale,
      tilePositions,
      tileOffsets,
      tileLayers,
    });

    const players = this.state.entities.map(({ state, events }) =>
      positionAtTime(time, state, events)
    );
    const playerPositions = [];
    const playerOffsets = [];
    const playerLayers = [];
    const playerAngles = [];

    players.forEach(({ x, y, angle }) =>
      layers.forEach(layer => {
        playerPositions.push(triangle);
        triangle.forEach(vertex => {
          playerOffsets.push([x, y]);
          playerLayers.push(layer);
          playerAngles.push(angle);
        });
      })
    );

    this.drawPlayers({
      time,
      camera,
      scale,
      playerPositions,
      playerOffsets,
      playerLayers,
      playerAngles,
    });
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
