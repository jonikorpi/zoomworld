import { easeIn, easeOut, easeInOut } from "../utilities/graphics";

const stateAtTime = (now, state, events) => {
  let result = events.reduce(
    (finalState, { type, time, data, endsAt }) => {
      switch (type) {
        case "impulse":
          return mergeImpulse(finalState, now, time, data, endsAt);
        case "thrust":
          return mergeThrust(finalState, now, time, data, endsAt);
        case "walk":
          return mergeWalk(finalState, now, time, data, endsAt);
        default:
          return finalState;
      }
    },
    { ...state, lastAngle: 0 }
  );

  result.angle = result.lastAngle;

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
  const elapsed = now - time;
  const completion = Math.max(0, Math.min(1, elapsed / duration));
  const easing = easeInOut(2)(completion);

  finalState.x += easing * x;
  finalState.y += easing * y;

  return finalState;
};

const mergeThrust = (
  finalState,
  now = 0,
  time = 0,
  { x = 0, y = 0, duration = 0 },
  endsAt = 0
) => {
  const elapsed = now - time;
  const endedEarly = endsAt < time + duration;
  const endedAfter = endedEarly ? endsAt - time : duration;
  const endingPoint = endedAfter / duration;

  const onRampDuration = Math.min(1000, duration / 2.618);
  const offRampDuration = Math.min(1000, duration / 2.618);
  const middleDuration = duration - onRampDuration - offRampDuration;

  const onRampCompletion = easeIn(2)(
    Math.min(1, Math.max(0, elapsed / onRampDuration))
  );
  const middleCompletion = Math.max(
    0,
    Math.min(1, elapsed / (onRampDuration + middleDuration))
  );
  const offRampCompletion = easeOut(2)(
    Math.min(
      1,
      Math.max(0, (elapsed - onRampDuration - middleDuration) / offRampDuration)
    )
  );

  const onRamp = onRampCompletion * (onRampDuration / duration);
  const middle = middleCompletion * (middleDuration / duration);
  const offRamp = offRampCompletion * (offRampDuration / duration);

  finalState.x += onRamp * x + middle * x + offRamp * x;
  finalState.y += onRamp * y + middle * y + offRamp * y;
  finalState.lastAngle = Math.atan2(y, x);

  return finalState;
};

const mergeWalk = (
  finalState,
  now = 0,
  time = 0,
  { x = 0, y = 0, speed = 0 },
  endsAt = Infinity
) => {
  const elapsed = Math.min(now - time, endsAt - time);
  const translation = elapsed / 1000 * (speed / 8);

  finalState.x += translation * x;
  finalState.y += translation * y;
  finalState.lastAngle = Math.atan2(y, x);

  return finalState;
};

const sortByTime = (a, b) => (a.time > b.time ? 1 : -1);

const addEndingTime = (results, event) => {
  const { time, data, type } = event;
  const { duration } = data;
  const { unstackableStartingTimes } = results;
  const shouldStack = typeof unstackableStartingTimes[type] === "undefined";
  const naturallyEndsAt = duration ? time + duration : Infinity;

  if (shouldStack) {
    event.endsAt = naturallyEndsAt;
  } else {
    event.endsAt = Math.min(unstackableStartingTimes[type], naturallyEndsAt);
    unstackableStartingTimes[type] = Math.min(
      unstackableStartingTimes[type],
      time
    );
  }

  results.events.push(event);
  return results;
};

const precompute = events => {
  return [...events]
    .sort(sortByTime)
    .reduceRight(addEndingTime, {
      events: [],
      unstackableStartingTimes: {
        thrust: Infinity,
        walk: Infinity,
      },
    })
    .events.reverse();
};

export { positionAtTime, stateAtTime, findLastEventEndingTime, precompute };
