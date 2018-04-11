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
    mass,
    drag,
    windX,
    windY,
    x,
    y,
    angle,
  } = stateObject;
  const time = (to - from) / 1000;

  // Throttle
  const force = (throttle > 0 ? 1 : 0.5) * throttle;
  stateObject.velocity += force / mass * time;
  stateObject.velocity -= stateObject.velocity * drag;
  const speed = Math.abs(stateObject.velocity / time);

  // Turn
  stateObject.turnVelocity += wheel / (mass / 100) * time;
  stateObject.turnVelocity -= stateObject.turnVelocity * drag;

  const distance = stateObject.velocity;
  const arcAngle = Math.abs(stateObject.turnVelocity);
  const radius = distance / arcAngle;

  let newY = isFinite(radius)
    ? stateObject.turnVelocity < 0
      ? radius - radius * Math.cos(arcAngle)
      : -radius + radius * Math.cos(arcAngle)
    : 0;
  let newX = isFinite(radius) ? radius * Math.sin(arcAngle) : distance;

  stateObject.x += newX * time;
  stateObject.y += newY * time;
  stateObject.angle = stateObject.turnVelocity < 0 ? arcAngle : -arcAngle;

  return stateObject;
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
