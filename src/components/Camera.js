import React from "react";

import World from "../components/World";
import Position from "../components/Position";
import TestEntity from "../components/TestEntity";

class Camera extends React.Component {
  static defaultProps = {
    userID: null,
  };

  counter = 123;

  render() {
    return (
      <div className="camera">
        <World {...this.props} />

        <TestEntity moveAround={true}>
          {({ state, events }) => (
            <Position state={state} events={events}>
              <div id="playerEntity">Player</div>
            </Position>
          )}
        </TestEntity>
      </div>
    );
  }
}

export default Camera;
