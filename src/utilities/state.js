import { easeOut } from "../utilities/graphics.js";

const sortByTime = (a, b) => (a.time > b.time ? 1 : -1);

const stateAtTime = (now, state, events) => {
  const stateAfterVelocity = mergeImpulse(
    { ...state, velocityX: 0, velocityY: 0 },
    now,
    "impulse",
    state.time,
    { x: state.velocityX, y: state.velocityY }
  );

  return [...events]
    .sort(sortByTime)
    .reduce((finalState, { type, time, data }) => {
      switch (type) {
        case "impulse":
          return mergeImpulse(finalState, now, type, time, data);
        case "brake":
        default:
          return finalState;
      }
    }, stateAfterVelocity);
};

const positionAtTime = (now, state, events) => {
  const { x, y, angle } = stateAtTime(now, state, events);
  return [x, y, angle];
};

const findLastEventEndingTime = (end, { time, data: { duration } }) =>
  time + duration > end ? time + duration : end;

const mergeImpulse = (
  state,
  now,
  type,
  time,
  { x = 0, y = 0, force = 1, duration = 0 }
) => {
  const elapsed = now - time;
  const completion = Math.min(1, elapsed / (duration || 1));
  const easing = easeOut(5)(completion);
  const adjustedForce = force / 10;

  const translateX = elapsed / 1000 * easing * adjustedForce * x;
  const translateY = elapsed / 1000 * easing * adjustedForce * y;

  state.x += translateX;
  state.y += translateY;
  state.velocityX += adjustedForce * x;
  state.velocityY += adjustedForce * y;
  state.angle = Math.atan2(y, x);
  state.time = now;

  return state;
};

export { positionAtTime, stateAtTime, findLastEventEndingTime };
