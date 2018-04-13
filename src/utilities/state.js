import { easeIn, easeOut, easeInOut } from "../utilities/graphics";

// const eventBufferLength = 5000;

const stateAtTime = (now, state, events) => {
  const stateObject = { ...state };
  simulate(stateObject, stateObject.time, events[0] ? events[0].time : now);

  events.forEach(event => {
    if (event.time < now) {
      mergeEvent(stateObject, event);
      simulate(stateObject, event.time, Math.min(event.validUntil, now));
    }
  });

  delete stateObject.validUntil;
  return stateObject;
};

const positionAtTime = (now, state, events) => {
  const { x, y, angle } = stateAtTime(now, state, events);
  return [x, y, angle];
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
        if (stateObject[stat] !== undefined) {
          stateObject[stat] = value;
        }
    }
  });

  return stateObject;
};

const simulate = (stateObject, from, to) => {
  const { throttle, wheel, mass, drag, windX, windY } = stateObject;
  const time = (to - from) / 1000;
  const weight = mass * 2;

  // Throttle
  const force = (throttle > 0 ? 1 : 0.5) * throttle;
  const acceleration = force / weight;
  const dragImpact = Math.pow(drag, time / weight);
  const velocity =
    acceleration -
    acceleration * dragImpact +
    stateObject.velocity * dragImpact;
  const distance = velocity * time;

  // Turn
  const turnVelocity =
    2 *
    wheel /
    mass *
    Math.sign(velocity) *
    Math.max(
      0,
      Math.min(1, Math.abs(velocity) * mass * mass) - Math.abs(velocity)
    );
  const turnAngle = turnVelocity * time;
  const curveAngle = Math.abs(turnAngle);
  const radius = distance / curveAngle;
  const curveSin = Math.sin(curveAngle);
  const curveCos = Math.cos(curveAngle);

  // Place
  const radiusIsFinite = isFinite(radius);
  const curveX = radiusIsFinite ? radius * curveSin : distance;
  const curveY = radiusIsFinite
    ? turnVelocity < 0
      ? radius - radius * curveCos
      : -radius + radius * curveCos
    : 0;

  // Transform
  const angleSin = Math.sin(stateObject.angle);
  const angleCos = Math.cos(stateObject.angle);
  const newX = angleCos * curveX - angleSin * curveY;
  const newY = angleCos * curveY + angleSin * curveX;

  // Save
  stateObject.x += newX;
  stateObject.y += newY;
  stateObject.angle = (stateObject.angle - turnAngle) % (2 * Math.PI);
  stateObject.velocity = velocity;
  stateObject.time = to;

  return stateObject;
};

const sortByTime = (a, b) => (a.time > b.time ? 1 : -1);

const addEndingTime = (event, index, events) => {
  event.validUntil = events[index + 1] ? events[index + 1].time : Infinity;
  return event;
};

const precompute = events => {
  return [...events].sort(sortByTime).map(addEndingTime);
};

export {
  positionAtTime,
  stateAtTime,
  // findLastEventEndingTime,
  precompute,
  // eventBufferLength,
};
