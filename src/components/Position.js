import React from "react";

import { angleLerp } from "../utilities/graphics.js";
import { positionAtTime, findLastEventEndingTime } from "../utilities/state.js";

class Position extends React.Component {
  static defaultProps = {
    state: { x: 0, y: 0, angle: 0 },
    events: [],
    centered: true,
    translate: true,
    rotate: true,
    inverse: false,
  };

  animations = [];

  createTransform = keyframe => {
    const { centered, translate, rotate, inverse } = this.props;
    const x = `${(inverse ? -1 : 1) * keyframe.x * 9}vmax`;
    const y = `${(inverse ? -1 : 1) * keyframe.y * 9}vmax`;
    const angle = `${keyframe.angle}rad`;

    const centering = centered ? "translate(-50%, -50%)" : "";
    const transform = translate ? `translate3d(${x}, ${y}, 0)` : "";
    const rotation = rotate ? `rotate(${angle})` : "";

    return `${centering}${transform}${rotation}`;
  };

  addAnimations = () => {
    const { state, events } = this.props;

    // Game logic happens slightly in the past to hide lag
    const now = Date.now() - 200;

    // Find when the animation should end
    const end = events.reduce(findLastEventEndingTime, now);

    // Determine how many keyframes are needed
    const resolution = 200;
    const amountOfIntermediateStates = Math.ceil((end - now) / resolution);

    // Calculate entity position at each keyframe
    let intermediateStates = [];

    for (let index = 1; index < amountOfIntermediateStates; index++) {
      intermediateStates.push(
        positionAtTime(now + index * resolution, state, events)
      );
    }

    const states = [
      positionAtTime(now, state, events),
      ...intermediateStates,
      positionAtTime(end, state, events),
    ];

    const transforms = states.map(this.createTransform);

    // Cancel all current animations since we're starting anew
    this.animations.forEach(animation => animation.cancel());
    this.animations = [];

    if (end === now) {
      // Set an inline style for things that aren't moving
      this.element.style.setProperty("transform", transforms[0]);
    } else {
      // And animate things that are
      const animation = this.element.animate(
        {
          transform: transforms,
        },
        {
          duration: end - now,
          easing: "linear",
          fill: "both",
        }
      );

      // Important: set a starting time for the animation.
      // Otherwise it'll go out of sync with game logic.
      animation.startTime = now - performance.timing.navigationStart;

      // Save animation so it can be cancelled later
      this.animations.push(animation);
    }
  };

  componentDidMount() {
    this.addAnimations();
  }

  componentDidUpdate() {
    this.addAnimations();
  }

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
