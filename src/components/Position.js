import React from "react";

import { angleLerp } from "../utilities/graphics.js";
import { positionAtTime } from "../utilities/state.js";

const findLastEventEndingTime = ({ now, end }, { time, duration }) => ({
  now: now,
  end: time + duration > end ? time + duration : end,
});

class Position extends React.Component {
  static defaultProps = {
    state: { x: 0, y: 0 },
    events: [],
    centered: true,
    translate: true,
  };

  animations = [];

  createKeyframe = keyframe => {
    const { centered, translate } = this.props;

    return {
      transform: `
        ${centered ? "translate3d(-50%, -50%, 0)" : ""}
        ${
          translate
            ? `translate3d(${keyframe.x}vmin, ${keyframe.y}vmin, 0)`
            : ""
        }
        rotate(${keyframe.angle}rad)
      `,
    };
  };

  componentDidMount() {
    this.addAnimations();
  }

  componentDidUpdate() {
    this.addAnimations();
  }

  addAnimations = () => {
    const { state, events } = this.props;

    // Game logic happens slightly in the past to hide lag
    const now = Date.now() - 200;

    // Find when the animation should end
    const end = events.reduce(findLastEventEndingTime, { end: now, now: now })
      .end;

    // Determine how many keyframes are needed
    const resolution = 200;
    const amountOfIntermediateStates = Math.ceil((end - now) / resolution);

    // Calculate entity position at each keyframe
    let intermediateStates = [];

    for (let index = 0; index < amountOfIntermediateStates; index++) {
      intermediateStates.push(
        positionAtTime(now + index * resolution, state, events)
      );
    }

    const states = [
      positionAtTime(now, state, events),
      ...intermediateStates,
      positionAtTime(end, state, events),
    ];

    const keyframes = states.map(this.createKeyframe);

    // Cancel all current animations since we're starting anew
    this.animations.forEach(animation => animation.cancel());

    const animation = this.element.animate(keyframes, {
      duration: end - now,
      easing: "linear",
      fill: "both",
    });

    // Important: set a starting time for the animation.
    // Otherwise it'll go out of sync with game logic.
    animation.startTime = now - performance.timing.navigationStart;

    // Save animation so it can be cancelled later
    this.animations.push(animation);
  };

  render() {
    return (
      <div
        className="position"
        ref={element => {
          this.element = element;
        }}
      >
        {this.props.children}
      </div>
    );
  }
}

export default Position;
