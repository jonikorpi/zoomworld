import React from "react";

const Graphic = ({
  type,
  points,
  fill,
  stroke,
  strokeWidth,
  strokeLinejoin,
  strokeLinecap,
  x,
  y,
}) => {
  const defaults = {
    x: x,
    y: y,
    fill: fill || "var(--white)",
  };

  const rounding = {
    stroke: stroke || fill,
    strokeWidth: strokeWidth || "2%",
    strokeLinejoin: strokeLinejoin || "round",
    strokeLinecap: strokeLinecap || "round",
  };

  switch (type) {
    default:
    case "ground":
      return <polygon points={points} {...defaults} {...rounding} />;

    case "waterLine":
      return (
        <polygon
          points={points}
          {...defaults}
          fill={fill || "none"}
          stroke={stroke || "var(--wave)"}
          strokeWidth={strokeWidth || "5%"}
        />
      );

    case "water":
      return (
        <polygon points={points} {...defaults} fill={fill || "var(--water)"} />
      );

    case "shroud":
      return (
        <polygon
          points={points}
          {...defaults}
          {...rounding}
          fill="var(--shroud)"
          stroke="var(--shroud)"
          strokeWidth="4%"
        />
      );
  }
};

export default Graphic;
