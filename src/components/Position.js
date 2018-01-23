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
    distanceCulling: true,
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
    const {
      state,
      events,
      onChange,
      distanceCulling,
      centered,
      translate,
    } = this.props;
    const now = Date.now() - 200;
    const end = events.reduce(findLastEventEndingTime, { end: now, now: now })
      .end;

    if (now >= end) {
      return;
    }

    const resolution = 100;
    const amountOfIntermediateStates = Math.round((end - now) / resolution) + 1;

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

    // let states = [];
    // for (let time = now; time < end; time + 100) {
    // states.push(positionAtTime(time, state, events));
    // }
    // states.push();
    //
    const keyframes = states.map(this.createKeyframe);

    if (keyframes.length > 1) {
      this.animations.forEach(animation => animation.cancel());

      const animation = this.element.animate(keyframes, {
        duration: end - now,
        easing: "linear",
        fill: "both",
      });

      animation.startTime = now - performance.timing.navigationStart;

      this.animations.push(animation);
    }
  }

  render() {
    const { state, events } = this.props;
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
