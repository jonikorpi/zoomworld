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
        <div className="origo">
          <TestEntity>
            {({ state, events }) => (
              <Position
                state={state}
                events={events}
                inverse={true}
                rotate={false}
                use3D={true}
              >
                <World {...this.props} />

                <Position state={state} events={events}>
                  <div id="playerEntity">Player</div>
                </Position>
              </Position>
            )}
          </TestEntity>
        </div>
      </div>
    );
  }
}

export default Camera;
