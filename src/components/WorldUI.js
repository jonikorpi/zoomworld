import React from "react";

import Renderer from "./Renderer";
import World from "../components/World";
// import Position from "../components/Position";
// import Scroller from "../components/Scroller";
import TestEntity from "../components/TestEntity";

// import { config } from "../utilities/graphics.js";

class WorldUI extends React.Component {
  static defaultProps = {
    userID: null,
  };

  counter = 123;

  render() {
    return (
      <TestEntity moveAround={true}>
        {({ state, events }) => (
          <Renderer state={state} events={events}>
            {({ subscribe, unsubscribe }) => (
              <World
                {...this.props}
                subscribe={subscribe}
                unsubscribe={unsubscribe}
              />
            )}
          </Renderer>
        )}
      </TestEntity>
    );
  }
}

export default WorldUI;
