import React from "react";

import TileType from "../components/TileType";
import { getSeed, baseTile, random } from "../utilities/graphics.js";

export default class Tile extends React.Component {
  constructor(props) {
    super(props);

    const { x, y } = props;

    this.seed = getSeed(x, y);
    this.baseTile = baseTile(this.seed++)
      .join(" ")
      .toString();
    this.random = random(1, this.seed++);
  }

  render() {
    const { x, y, shoreVisible, tile } = this.props;

    return (
      <TileType
        {...tile}
        baseTile={this.baseTile}
        seed={this.seed}
        shoreVisible={true}
      />
    );
  }
}
