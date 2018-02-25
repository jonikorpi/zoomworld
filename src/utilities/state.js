import { easeInOut } from "../utilities/graphics.js";

const positionAtTime = (now, state, events) =>
  events.reduce(
    (finalState, { type, time, duration, data }) =>
      type === "impulse"
        ? mergeImpulse(finalState, now, type, time, duration, data)
        : finalState,
    { x: state.x, y: state.y }
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
    { ...state }
  );

const findLastEventEndingTime = (end, { time, duration }) =>
  time + duration > end ? time + duration : end;

const mergeImpulse = (finalState, now, type, time, duration, data) => {
  const { x, y, speed } = data;
  const elapsed = now - time;
  const endsAt = time + duration;
  const completion = endsAt < now ? 1 : elapsed / duration;

  return {
    x: finalState.x + easeInOut(2)(completion) * speed * x,
    y: finalState.y + easeInOut(2)(completion) * speed * y,
  };
};

export { positionAtTime, stateAtTime, findLastEventEndingTime };
