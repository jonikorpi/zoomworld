import { easeInOut } from "../utilities/graphics.js";

const positionAtTime = (now, state, events) => {
  const result = events.reduce(
    (finalState, { type, time, data }) =>
      type === "impulse"
        ? mergeImpulse(finalState, now, type, time, data)
        : finalState,
    { ...state, velocityX: 0, velocityY: 0, lastAngle: 0 }
  );

  const velocity = Math.abs(result.velocityY) + Math.abs(result.velocityX);

  return [
    result.x,
    result.y,
    velocity > 0
      ? Math.atan2(result.velocityY, result.velocityX)
      : result.lastAngle,
  ];
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
  const hasEnded = endsAt < now;
  const completion = hasEnded ? 1 : elapsed / duration;
  const easing = easeInOut(2)(completion);
  const thrust = -Math.abs(easing - 0.5) + 0.5;
  const velocityX = finalState.velocityX + thrust * speed * x;
  const velocityY = finalState.velocityY + thrust * speed * y;

  finalState.x += easing * speed * x;
  finalState.y += easing * speed * y;
  finalState.velocityX = velocityX;
  finalState.velocityY = velocityY;
  finalState.lastAngle = Math.atan2(y, x);

  return finalState;
};

export { positionAtTime, stateAtTime, findLastEventEndingTime };
