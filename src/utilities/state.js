import { easing, angleLerp } from "../utilities/graphics.js";

const positionAtTime = (now, state, events) =>
  events.reduce(
    (finalState, { type, time, duration, data }) =>
      type === "impulse"
        ? mergeImpulse(finalState, now, type, time, duration, data)
        : finalState,
    { x: state.x, y: state.y, angle: 0 }
  );

const stateAtTime = (now, state, events) =>
  events.reduce(
    (finalState, { type, time, duration, data }) => {
      switch (type) {
        case "impulse":
          return mergeImpulse(finalState, now, type, time, duration, data);
        default:
          console.warn(`Not handling unrecognized event type: ${type}`);
          return finalState;
      }
    },
    { ...state, angle: 0 }
  );

const mergeImpulse = (finalState, now, type, time, duration, data) => {
  const { x, y, speed } = data;
  const elapsed = now - time;
  const endsAt = time + duration;
  const completion = endsAt < now ? 1 : elapsed / duration;

  return {
    x: finalState.x + easing(completion) * speed * x,
    y: finalState.y + easing(completion) * speed * y,
    angle: Math.atan2(y, x),
  };
};

export { positionAtTime, stateAtTime };