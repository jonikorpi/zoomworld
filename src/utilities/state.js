import { easeInOut } from "../utilities/graphics.js";

const positionAtTime = (now, state, events) =>
  events.reduce(
    (finalState, { type, time, data }) =>
      type === "impulse"
        ? mergeImpulse(finalState, now, type, time, data)
        : finalState,
    { ...state }
  );

const stateAtTime = (now, state, events) =>
  events.reduce(
    (finalState, { type, time, data }) => {
      switch (type) {
        case "impulse":
          return mergeImpulse(finalState, now, type, time, data);
        default:
          console.warn(`Not handling unrecognized event type: ${type}`);
          return finalState;
      }
    },
    { ...state }
  );

const findLastEventEndingTime = (end, { time, data: { duration } }) =>
  time + duration > end ? time + duration : end;

const mergeImpulse = (
  finalState,
  now,
  type,
  time,
  { x = 0, y = 0, speed = 0, duration = 0 }
) => {
  const elapsed = now - time;
  const endsAt = time + duration;
  const completion = endsAt < now ? 1 : elapsed / duration;

  finalState.x += easeInOut(2)(completion) * speed * x;
  finalState.y += easeInOut(2)(completion) * speed * y;

  return finalState;
};

export { positionAtTime, stateAtTime, findLastEventEndingTime };
