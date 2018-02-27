import React from "react";

import Renderer from "./Renderer";
import World from "../components/World";
import Position from "../components/Position";
// import Scroller from "../components/Scroller";
import TestEntity from "../components/TestEntity";

import { config } from "../utilities/graphics.js";

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
            {renderer => <World {...this.props} renderer={renderer} />}
            {/* {renderer => (
              <div
                className="camera"
                style={{
                  "--unit": `${config.unitSize}${config.unitType}`,
                }}
              >
                <Position
                  state={state}
                  events={events}
                  rotate={false}
                  inverse={true}
                >
                  <World {...this.props} renderer={renderer} />

                  <Position state={state} events={events}>
                    <b>Player</b>
                  </Position>
                  <Position state={state} events={events} z={1}>
                    <b>Player</b>
                  </Position>
                  <Position state={state} events={events} z={2}>
                    <b>Player</b>
                  </Position>
                  <Position state={state} events={events} z={3}>
                    <b>Player</b>
                  </Position>
                  <Position state={state} events={events} z={4}>
                    <b>Player</b>
                  </Position>
                </Position>
              </div>
            )} */}
          </Renderer>
        )}
      </TestEntity>
    );
  }
}

export default WorldUI;
