import { easing } from "../utilities/graphics.js";

const positionAtTime = (now, state, events) =>
  events.reduce(
    (finalState, { type, time, duration, data }) =>
      type === "impulse"
        ? mergeImpulse(finalState, now, type, time, duration, data)
        : finalState,
    { x: state.x, y: state.y, velocityX: 0, velocityY: 0 }
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
    { ...state, velocityX: 0, velocityY: 0 }
  );

const mergeImpulse = (finalState, now, type, time, duration, data) => {
  const { x, y, speed } = data;
  const elapsed = now - time;
  const endsAt = time + duration;
  const completion = endsAt < now ? 1 : elapsed / duration;
  const completed = completion === 1;

  return {
    x: finalState.x + easing(completion) * speed * x,
    y: finalState.y + easing(completion) * speed * y,
    velocityX: finalState.velocityX + (completed ? 0 : speed * x),
    velocityY: finalState.velocityY + (completed ? 0 : speed * y),
  };
};

export { positionAtTime, stateAtTime };
