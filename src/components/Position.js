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
    camera: {
      x: 0,
      y: 0,
      scale: 1,
    },
    distanceCulling: true,
    centered: true,
    translate: true,
  };

  animations = [];

  // componentDidMount() {
  //   this.props.loop.subscribe(this.update);
  // }
  //
  // componentWillUnmount() {
  //   this.props.loop.unsubscribe(this.update);
  // }

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
      camera,
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

    // // Reduce events
    // const actualState = positionAtTime(now, state, events);
    //
    // // New values
    // const newX = actualState.x - camera.x;
    // const newY = actualState.y - camera.y;
    // const newScale = camera.scale;
    //
    // // Distance culling
    // if (distanceCulling) {
    //   const outsideX =
    //     (Math.abs(newX) - 2) * camera.unit > camera.width / 2 / newScale;
    //   const outsideY =
    //     (Math.abs(newY) - 2) * camera.unit > camera.height / 2 / newScale;
    //
    //   if (outsideX || outsideY) {
    //     if (this.currentScale !== 0) {
    //       this.currentScale = 0;
    //       this.element.style.setProperty("--scale", 0);
    //     }
    //
    //     return;
    //   }
    // }
    //
    // // Calculate angle
    // const nextAngle = Math.atan2(actualState.velocityY, actualState.velocityX);
    // // const newAngle = nextAngle;
    // const newAngle = angleLerp(this.currentAngle, nextAngle, 0.146);
    //
    // // Callback
    // if (onChange !== undefined && changed) {
    //   onChange({ x: actualState.x, y: actualState.y });
    // }
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
