import React from "react";

import Loop from "../components/Loop";
import Zoomer from "../components/Zoomer";
import Positioner from "../components/Positioner";
import Layer from "../components/Layer";
import TestEntity from "../components/TestEntity";
import SVG from "../components/SVG";
import Graphic from "../components/Graphic";

import { config, getSeed, baseTile } from "../utilities/graphics.js";

const unit = 10;
const xUnitType = "vw";
const yUnitType = "vmin";

const computeUnit = type => {
  switch (type) {
    case "vw":
      return window.innerWidth / 100;
    case "vh":
      return window.innerHeight / 100;
    case "vmax":
      return Math.max(window.innerWidth / 100, window.innerHeight / 100);
    default:
    case "vmin":
      return Math.min(window.innerWidth / 100, window.innerHeight / 100);
  }
};
const randomPosition = () => Math.random() * unit * 2 - unit;

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

            <div
              className="camera"
              ref={element => {
                this.world = element;
              }}
            >
              {[...new Array(100)].map((nada, index) => {
                const x = randomPosition();
                const y = randomPosition();

                return (
                  <TestEntity key={index} x={x} y={y}>
                    {({ state, events }) => (
                      <Positioner
                        state={state}
                        events={events}
                        camera={this.camera}
                        loop={loop}
                      >
                        {positioner => {
                          const tile = baseTile(getSeed(x, y))
                            .join(" ")
                            .toString();

                          return (
                            <React.Fragment>
                              <Layer positioner={positioner}>
                                <SVG>
                                  <Graphic type="waterLine" points={tile} />
                                </SVG>
                              </Layer>
                              <Layer positioner={positioner} z={1}>
                                <SVG>
                                  <Graphic
                                    type="ground"
                                    fill="var(--ground3)"
                                    points={tile}
                                  />
                                </SVG>
                              </Layer>
                              <Layer positioner={positioner} z={2}>
                                <SVG>
                                  <Graphic
                                    type="ground"
                                    fill="var(--ground2)"
                                    points={tile}
                                  />
                                </SVG>
                              </Layer>
                              <Layer positioner={positioner} z={3}>
                                <SVG z={config.groundLevel}>
                                  <Graphic
                                    type="ground"
                                    fill="var(--ground)"
                                    points={tile}
                                  />
                                </SVG>
                              </Layer>
                            </React.Fragment>
                          );
                        }}
                      </Positioner>
                    )}
                  </TestEntity>
                );
              })}

              <TestEntity>
                {({ state, events }) => (
                  <Positioner
                    state={state}
                    events={events}
                    camera={this.camera}
                    onChange={this.updateCamera}
                    distanceCulling={false}
                    translation={false}
                    loop={loop}
                  >
                    {positioner => (
                      <div id="playerEntity">
                        <Layer positioner={positioner}>Player</Layer>
                      </div>
                    )}
                  </Positioner>
                )}
              </TestEntity>
            </div>
          </div>
        )}
      </Loop>
    );
  }
}

export default Camera;
