import React from "react";

import World from "../components/World";
import Position from "../components/Position";
import TestEntity from "../components/TestEntity";

class Camera extends React.Component {
  static defaultProps = {
    userID: null,
  };

  counter = 123;
  scrollFrame = null;

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
    this.zoom();
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  handleScroll = event => {
    this.scrollFrame = this.scrollFrame || requestAnimationFrame(this.zoom);
  };

  zoom = () => {
    const pageHeight = document.body.clientHeight;
    const scrollAmount = window.scrollY;
    const scrolled = 1 - scrollAmount / pageHeight;

    this.origo.style.setProperty(
      "transform",
      `scale3d(${scrolled},${scrolled},${scrolled})`
    );
    this.scrollFrame = null;
  };

  render() {
    return (
      <div className="camera">
        <div className="origo" ref={origo => (this.origo = origo)}>
          <TestEntity moveAround={true}>
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
