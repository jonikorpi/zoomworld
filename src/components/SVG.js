import React from "react";

import { config } from "../utilities/graphics.js";

const tileWidth = config.tileSize * config.tileCanvasMultiplier;
const viewBox = `-${tileWidth / 2} -${tileWidth / 2} ${tileWidth} ${tileWidth}`;

const SVG = ({ children }) => {
  return (
    <div
      className="svgContainer"
      style={{
        "--tileCanvasMultiplier": config.tileCanvasMultiplier,
        "--width": 1,
        "--height": 1,
      }}
    >
      <svg
        className="svg"
        shapeRendering="optimizeSpeed"
        preserveAspectRatio="none"
        viewBox={viewBox}
      >
        {children}
      </svg>
    </div>
  );
};

export default SVG;
