import React from "react";

import Loop from "../components/Loop";
import Zoomer from "../components/Zoomer";
import Positioner from "../components/Positioner";
import Layer from "../components/Layer";
import TestEntity from "../components/TestEntity";
import SVG from "../components/SVG";
import Graphic from "../components/Graphic";

import { config, getSeed, baseTile, random } from "../utilities/graphics.js";

const testTileRadius = 10;
const testEntityRadius = 10;
const testTileCount = 25;
const testEntityCount = 100;

const unit = 38.2;
const xUnitType = "vmin";
const yUnitType = "vmin";

const computeUnit = type => {
  switch (type) {
    case "vw":
      return window.innerWidth / 100;
    case "vh":
      return window.innerHeight / 100;
    case "vmax":
      return Math.max(window.innerWidth / 100, window.innerHeight / 100);
    case "vmin":
      return Math.min(window.innerWidth / 100, window.innerHeight / 100);
    default:
      return 1;
  }
};

class Camera extends React.Component {
  static defaultProps = {
    userID: null,
  };

  camera = {
    x: 0,
    y: 0,
    scale: 1,
    width: window.innerWidth,
    height: window.innerHeight,
    unit: unit,
    xUnitType: xUnitType,
    yUnitType: yUnitType,
    xPixelUnit: unit,
    yPixelUnit: unit,
  };

  counter = 123;

  componentDidMount() {
    this.updateViewport();
    window.addEventListener("resize", this.updateViewport);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateViewport);
  }

  updateViewport = () => {
    this.camera.width = window.innerWidth;
    this.camera.height = window.innerHeight;
    this.camera.xPixelUnit = computeUnit(xUnitType) * unit;
    this.camera.yPixelUnit = computeUnit(yUnitType) * unit;
  };

  updateCamera = (x, y) => {
    this.camera.x = x;
    this.camera.y = y;
  };

  updateScale = scale => {
    this.camera.scale = scale;
  };

  render() {
    return (
      <Loop>
        {loop => (
          <div
            className="camera"
            style={{
              "--xUnit": `${unit}${xUnitType}`,
              "--yUnit": `${unit}${yUnitType}`,
            }}
          >
            <Zoomer onChange={this.updateScale} loop={loop} />
            {[...new Array(testTileCount)].map((nada, index) => {
              const x =
                random(1, this.counter++) * testTileRadius - testTileRadius / 2;
              const y =
                random(1, this.counter++) * testTileRadius - testTileRadius / 2;

              return (
                <TestEntity
                  index={index + 134}
                  key={index}
                  x={x + 0.25}
                  y={y + 0.25}
                  moveAround={false}
                >
                  {({ state, events }) => (
                    <Positioner
                      state={state}
                      events={events}
                      camera={this.camera}
                      loop={loop}
                    >
                      {positioner => (
                        <React.Fragment>
                          <Layer positioner={positioner}>
                            <SVG>
                              <Graphic
                                type="waterLine"
                                points={baseTile(getSeed(x, y))
                                  .join(" ")
                                  .toString()}
                              />
                            </SVG>
                          </Layer>
                          <Layer positioner={positioner} z={3}>
                            <SVG>
                              <Graphic
                                type="ground"
                                fill="var(--ground)"
                                points={baseTile(getSeed(x, y))
                                  .join(" ")
                                  .toString()}
                              />
                            </SVG>
                          </Layer>
                        </React.Fragment>
                      )}
                    </Positioner>
                  )}
                </TestEntity>
              );
            })}

            {[...new Array(testEntityCount)].map((nada, index) => (
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
                  <Positioner
                    state={state}
                    events={events}
                    camera={this.camera}
                    loop={loop}
                  >
                    {positioner => (
                      <div>
                        <Layer positioner={positioner}>#{index}</Layer>
                        <Layer positioner={positioner} z={2}>
                          #{index}
                        </Layer>
                        <Layer positioner={positioner} z={3}>
                          #{index}
                        </Layer>
                      </div>
                    )}
                  </Positioner>
                )}
              </TestEntity>
            ))}

            <TestEntity>
              {({ state, events }) => (
                <Positioner
                  state={state}
                  events={events}
                  camera={this.camera}
                  onChange={this.updateCamera}
                  distanceCulling={false}
                  translate={false}
                  loop={loop}
                >
                  {positioner => (
                    <div id="playerEntity">
                      <Layer positioner={positioner}>Player</Layer>
                      <Layer positioner={positioner} z={2}>
                        Player
                      </Layer>
                      <Layer positioner={positioner} z={3}>
                        Player
                      </Layer>
                    </div>
                  )}
                </Positioner>
              )}
            </TestEntity>
          </div>
        )}
      </Loop>
    );
  }
}

export default Camera;
