import React from "react";

import SVG from "./SVG";
import Graphic from "./Graphic";
import { config } from "./graphics.js";

const TileType = ({ type, baseTile, seed, shoreVisible }) => {
  let key = 0;

  switch (type) {
    default:
    case "plains":
      return [
        shoreVisible && (
          <SVG
            key={key++}
            className="waterLine"
            z={config.waterLevel}
            scale={4}
            zIndex={config.waterLevel - 1}
          >
            <Graphic type="waterLine" points={baseTile} />
          </SVG>
        ),

        shoreVisible && (
          <SVG key={key++} z={config.waterLevel} scale={2}>
            <Graphic type="ground" fill="var(--ground3)" points={baseTile} />
          </SVG>
        ),

        shoreVisible && (
          <SVG key={key++} z={config.waterLevel + 1} scale={1}>
            <Graphic type="ground" fill="var(--ground2)" points={baseTile} />
          </SVG>
        ),

        !shoreVisible && (
          <SVG
            key={key++}
            z={config.waterLevel}
            zIndex={config.groundLevel}
            scale={1}
          >
            <Graphic type="ground" fill="var(--ground)" points={baseTile} />
          </SVG>
        ),

        <SVG key={key++} z={config.groundLevel}>
          <Graphic type="ground" fill="var(--ground)" points={baseTile} />
        </SVG>,
      ];

    case "water":
      return (
        <SVG zIndex={config.waterLevel - 2} scale={10}>
          <Graphic type="water" points={baseTile} />
        </SVG>
      );
  }
};

export default TileType;
