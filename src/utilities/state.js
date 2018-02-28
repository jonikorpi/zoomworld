import { easeInOut } from "../utilities/graphics.js";

const positionAtTime = (now, state, events) => {
  const result = events.reduce(
    (finalState, { type, time, data }) =>
      type === "impulse"
        ? mergeImpulse(finalState, now, type, time, data)
        : finalState,
    { ...state, velocityX: 0, velocityY: 0 }
  );

  return {
    x: result.x,
    y: result.y,
    angle: Math.atan2(result.velocityY, result.velocityX),
  };
};

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
    { ...state, velocityX: 0, velocityY: 0 }
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
  const easing = easeInOut(3)(completion);
  const thrust = -Math.abs(easing - 0.5) + 0.5;

  finalState.x += easing * speed * x;
  finalState.y += easing * speed * y;
  finalState.velocityX += thrust * speed * x;
  finalState.velocityY += thrust * speed * y;

  return finalState;
};

export { positionAtTime, stateAtTime, findLastEventEndingTime };
