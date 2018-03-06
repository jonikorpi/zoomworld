import React from "react";

export default class PlayerUI extends React.Component {
  state = {
    currentTile: [0, 0],
  };

  updateCurrentTile = position => {
    const [x, y] = this.state.currentTile;
    const newX = Math.floor(position[0]);
    const newY = Math.floor(position[1]);

    if (newX !== x || newY !== y) {
      this.setState({ currentTile: [newX, newY] });
      const wind = Math.sin(newX + newY) * Math.PI * 2;
      this.props.addEvent({
        x: Math.cos(wind),
        y: Math.sin(wind),
        speed: 0.5,
        duration: 3000,
      });
    }
  };

  render() {
    return this.props.children(this.state, this.updateCurrentTile);
  }
}
