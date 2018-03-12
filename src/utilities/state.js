import { easeInOut } from "../utilities/graphics.js";

const sortByTime = (a, b) => (a.time > b.time ? 1 : -1);

const stateAtTime = (now, state, events) => {
  let result = [...events].sort(sortByTime).reduce(
    (finalState, { type, time, data }) => {
      switch (type) {
        case "impulse":
          return mergeImpulse(finalState, now, type, time, data);
        default:
          console.warn(`Not handling unrecognized event type: ${type}`);
          return finalState;
      }
    },
    { ...state, velocityX: 0, velocityY: 0, lastAngle: 0 }
  );

  result.angle =
    Math.abs(result.velocityY) + Math.abs(result.velocityX) > 0
      ? Math.atan2(result.velocityY, result.velocityX)
      : result.lastAngle;

  return result;
};

const positionAtTime = (now, state, events) => {
  const { x, y, angle } = stateAtTime(now, state, events);
  return [x, y, angle];
};

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
