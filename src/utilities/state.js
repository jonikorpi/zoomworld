import bezier from "bezier-easing";
import { easeOut } from "../utilities/graphics";

const stateAtTime = (now, state, events) => {
  let result = events.reduce(
    (finalState, { type, time, data, endsAt }) => {
      switch (type) {
        case "impulse":
          return mergeImpulse(finalState, now, time, data, endsAt);
        case "thrust":
          return mergeThrust(finalState, now, time, data, endsAt);
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

const impulseEasing = [0.445, 0.05, 0.55, 0.95];
const thrustEasing = [0.455, 0.03, 0.355, 1];

const mergeImpulse = (
  finalState,
  now = 0,
  time = 0,
  { x = 0, y = 0, duration = 0 },
  endsAt = 0
) => {
  const elapsed = now - time;
  const completion = Math.max(0, Math.min(1, elapsed / duration));
  const ratio = Math.min(1, duration / 1000);
  const easing = bezier(
    impulseEasing[0] * ratio,
    impulseEasing[1] * ratio,
    1 - (1 - impulseEasing[2]) * ratio,
    1 - (1 - impulseEasing[3]) * ratio
  )(completion);

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
  const completion =
    Math.max(0, Math.min(1, elapsed / endedAfter)) * endingPoint;
  const ratio = Math.min(1, duration / 1000);
  const curve = bezier(
    thrustEasing[0] * ratio,
    thrustEasing[1] * ratio,
    1 - (1 - thrustEasing[2]) * ratio,
    1 - (1 - thrustEasing[3]) * ratio
  );
  const translation = curve(completion);

  const missedDuration = duration - endedAfter;
  const pastEnding = now - endsAt;
  const thrust = -Math.abs(translation - 0.5) + 0.5;
  const trailCompletion = endedEarly
    ? Math.max(0, Math.min(1, pastEnding / Math.max(1000, missedDuration)))
    : 0;
  const trailing = endedEarly ? easeOut(2)(trailCompletion) * thrust : 0;

  finalState.x += translation * x + trailing * x;
  finalState.y += translation * y + trailing * y;
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
      },
    })
    .events.reverse();
};

export { positionAtTime, stateAtTime, findLastEventEndingTime, precompute };
