import { easeIn, easeOut, easeInOut } from "../utilities/graphics";
import { clamp } from "../utilities/helpers.js";

const eventBufferLength = 100;

const stateAtTime = (now, state, events) => {
  const stateObject = { ...state };
  simulate(
    stateObject,
    stateObject.time,
    events.length > 0 ? events[0].time : now
  );

  events.forEach(event => {
    if (event.time < now) {
      mergeEvent(stateObject, event);
      simulate(
        stateObject,
        event.time,
        Math.min(event.validUntil, now),
        event[".key"]
      );
    }
  });

  // delete stateObject.validUntil;
  return stateObject;
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

const simulate = (stateObject, from, to, id) => {
  const { throttlePower, wheelPower, mass, windX, windY } = stateObject;
  const time = (to - from) / 100;

  // Forces
  const weight = mass * 2;
  const drag = stateObject.drag / 20;
  const throttle = stateObject.throttle;
  const force = (throttle > 0 ? 1 : 0.5) * throttle * (throttlePower / 2);
  const thrust = force / weight;
  const momentum = stateObject.velocity;

  // Derivative calculations to figure out when momentum ends
  const momentumEndsAt = -(weight / Math.log(1 - drag));
  const momentumTime = Math.min(time, momentumEndsAt);
  // const momentumTurningVelocityTime =
  //   time > Math.log(1 - drag) * Math.pow(1 - drag, time / weight) / weight;

  const thrustVelocity = thrust * (1 - Math.pow(drag, time / weight));
  const momentumVelocity =
    Math.max(
      0,
      Math.abs(momentum) * Math.pow(1 - drag, time / weight) -
        Math.abs(momentum) * Math.pow(1 - drag, momentumEndsAt / weight)
    ) * Math.sign(momentum);
  const velocity = thrustVelocity + momentumVelocity;
  // const momentumTurningVelocity =
  //   momentum * Math.pow(1 - drag, momentumTime / weight);
  // const velocityForTurning = thrustVelocity + momentumTurningVelocity;

  const momentumDistance = momentum * Math.pow(1 - drag, momentumTime / weight);
  const distance = thrustVelocity * time + momentumDistance * momentumTime;

  // Turn
  const wheel = stateObject.wheel;
  const turnVelocity =
    wheelPower /
    5 *
    wheel /
    mass *
    Math.sign(velocity) *
    Math.max(
      0,
      Math.min(1, Math.abs(velocity) * mass * mass) - Math.abs(velocity)
    );
  const turnAngle = turnVelocity * time;
  const curveAngle = Math.abs(turnAngle);
  const length = distance / curveAngle;
  const curveSin = Math.sin(curveAngle);
  const curveCos = Math.cos(curveAngle);

  // Place
  const lengthIsFinite = isFinite(length);
  const curveX = lengthIsFinite ? length * curveSin : distance;
  const curveY = lengthIsFinite
    ? turnAngle < 0 ? length - length * curveCos : -length + length * curveCos
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
  stateAtTime,
  // findLastEventEndingTime,
  precompute,
  eventBufferLength,
};
