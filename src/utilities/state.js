import { easeIn, easeOut, easeInOut } from "../utilities/graphics";

const eventBufferLength = 5000;

let stateObject = {};
const stateAtTime = (now, state, events) => {
  stateObject = { ...state };
  simulate(stateObject, stateObject.time, events[0] ? events[0].time : now);

  events.forEach(event => {
    if (event.time < now) {
      mergeEvent(stateObject, event);
      simulate(stateObject, event.time, Math.min(event.validUntil, now));
    }
  });

  return stateObject;
};

let positionArray = [];
const positionAtTime = (now, state, events) => {
  const { x, y, angle } = stateAtTime(now, state, events);
  positionArray[0] = x;
  positionArray[1] = y;
  positionArray[2] = angle;
  return positionArray;
};

// const findLastEventEndingTime = (end, { time, data: { duration } }) =>
//   time + duration > end ? time + duration : end;

const mergeEvent = (stateObject, { data }) => {
  Object.keys(data).forEach(stat => {
    const operation = Object.keys(data[stat])[0];
    const value = data[stat][operation];

    switch (operation) {
      case "set":
      default:
        stateObject[stat] = value;
    }
  });

  return stateObject;
};

const simulate = (stateObject, from, to) => {
  const {
    throttle,
    wheel,
    velocity,
    turnVelocity,
    weight,
    drag,
    windX,
    windY,
    x,
    y,
    angle,
  } = stateObject;
  const time = (to - from) / 1000;
  // Probably good:
  // drag = -velocity * dragConstant
  // velocity += acceleration
  // velocity += drag

  // Probably bad:
  // 1- ((drag*v*v*time)/weight)

  // throttle: 0,
  // wheel: 0,
  // velocity: 0,
  // turnVelocity: 0,
  // weight: 0.1,
  // drag: 0.5,
  // windX: 0,
  // windY: 0,
  // x: 0,
  // y: 0,
  // angle: 0,

  // Throttle
  const dragVelocity = -velocity * drag;
  stateObject.velocity += throttle / (weight * 100);
  stateObject.velocity += dragVelocity;

  // Turn
  const dragTurnVelocity = -turnVelocity * drag;
  stateObject.turnVelocity += wheel / (weight * 41.4);
  stateObject.turnVelocity += dragTurnVelocity;

  const distance = stateObject.velocity * time;
  const arcAngle = Math.abs(stateObject.turnVelocity) * time;
  const radius = distance / arcAngle;

  let newX = isFinite(radius)
    ? stateObject.turnVelocity < 0
      ? -radius + radius * Math.cos(arcAngle)
      : radius - radius * Math.cos(arcAngle)
    : 0;
  let newY = isFinite(radius) ? radius * Math.sin(arcAngle) : distance;

  stateObject.x += newX;
  stateObject.y += newY;
  stateObject.angle = Math.atan2(newY, newX);

  return stateObject;
};

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
  // findLastEventEndingTime,
  precompute,
  eventBufferLength,
};
