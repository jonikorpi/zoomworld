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

  componentDidUpdate() {
    const { state, events } = this.props;

    // Game logic happens slightly in the past to hide lag
    const now = Date.now() - 200;

    // Find when the animation should end
    const end = events.reduce(findLastEventEndingTime, { end: now, now: now })
      .end;

    // If there are no current or future events to animate, stop
    if (now >= end) {
      return;
    }

    // Determine how many keyframes are needed
    const resolution = 100;
    const amountOfIntermediateStates = Math.round((end - now) / resolution) + 1;

    // Calculate entity position at each keyframe
    const states = [
      positionAtTime(now, state, events),
      ...[...Array(amountOfIntermediateStates)].map(
        (nada, index) =>
          positionAtTime(now + index * resolution, state, events),
        state,
        events
      ),
      positionAtTime(end, state, events),
    ];

    const keyframes = states.map(this.createKeyframe);

    if (keyframes.length > 1) {
      // Cancel all current animations since we're starting anew
      this.animations.forEach(animation => animation.cancel());

      const animation = this.element.animate(keyframes, {
        duration: end - now,
        easing: "linear",
        fill: "both",
      });

      // Important: set a starting time for the animation
      // otherwise it'll go out of sync with game logic
      animation.startTime = now - performance.timing.navigationStart;

      // Save animation so it can be cancelled later
      this.animations.push(animation);
    }
  }

  render() {
    const { state, events } = this.props;

    // Create initial position
    const now = Date.now() - 200;
    const transform = this.createKeyframe(positionAtTime(now, state, events))
      .transform;

    return (
      <div
        className="position"
        style={{
          transform: transform,
        }}
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
