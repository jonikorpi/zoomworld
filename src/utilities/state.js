import { easeIn, easeOut, easeInOut } from "../utilities/graphics";

const eventBufferLength = 5000;

const stateAtTime = (now, state, events) => {
  let result = events.reduce(
    (finalState, { type, time, data, endsAt }) => {
      if (now < time) {
        return finalState;
      }

      switch (type) {
        case "run":
          return mergeWalk(finalState, now, time, data, endsAt);
        case "stop":
          return mergeStop(finalState, now, time);
        case "impulse":
          return mergeImpulse(finalState, now, time, data, endsAt);
        default:
          return finalState;
      }
    },
    { ...state, momentumX: 0, momentumY: 0, lastAngle: 0 }
  );

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
  now = 0,
  time = 0,
  { x = 0, y = 0, duration = 0 },
  endsAt = 0
) => {
  // const hasEnded = endsAt !== Infinity;
  // const endedAfter = hasEnded ? endsAt - time : 0;
  const timeSinceStart = now - time;
  const elapsed = Math.min(timeSinceStart, endsAt - time);

  const completion =
    easeOut(2)(Math.min(1, elapsed / duration)) * (duration / 1000);

  finalState.x += completion * x;
  finalState.y += completion * y;

  return finalState;
};

const mergeWalk = (
  finalState,
  now = 0,
  time = 0,
  { x = 0, y = 0, speed = 0 },
  endsAt = Infinity
) => {
  const timeSinceStart = now - time;
  const elapsed = Math.min(timeSinceStart, endsAt - time);

  const distance = Math.sqrt(x * x + y * y);
  const unitsPerSecond = speed / 8;
  const duration = distance / unitsPerSecond * 1000;
  const completion = Math.min(1, elapsed / duration);
  const hasEnded = endsAt !== Infinity || completion === 1;
  const endedAfter = Math.min(endsAt - time, duration);

  finalState.x += completion * x;
  finalState.y += completion * y;
  finalState.angle = Math.atan2(y, x);

  const ramp = 1000 * speed;
  const onRamp = easeIn(2)(
    Math.max(0, Math.min(1, (hasEnded ? endedAfter : timeSinceStart) / ramp))
  );
  const offRamp = hasEnded
    ? easeIn(2)(Math.max(0, Math.min(1, (timeSinceStart - endedAfter) / ramp)))
    : 0;
  const momentum = onRamp - onRamp * offRamp;
  finalState.momentumX += momentum * x / distance;
  finalState.momentumY += momentum * y / distance;

  return finalState;
};

const mergeStop = (finalState, now = 0, time = 0) => {
  return finalState;
};

const sortByTime = (a, b) => (a.time > b.time ? 1 : -1);

const addEndingTime = (event, index, events) => ({
  ...event,
  validUntil: events[index - 1] ? events[index - 1].time : Infinity,
});

const precompute = events => {
  return [...events]
    .sort(sortByTime)
    .reverse()
    .map(addEndingTime)
    .reverse();
};

export {
  positionAtTime,
  stateAtTime,
  findLastEventEndingTime,
  precompute,
  eventBufferLength,
};
