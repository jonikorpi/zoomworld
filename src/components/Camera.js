import React from "react";

import World from "../components/World";
import Position from "../components/Position";
import Scroller from "../components/Scroller";
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
            <React.Fragment>
              <div id="playerEntity">
                <Position state={state} events={events} translate={false}>
                  Player
                </Position>
              </div>
              <Scroller state={state} events={events} />
            </React.Fragment>
          )}
        </TestEntity>
      </div>
    );
  }
}

export default Camera;
