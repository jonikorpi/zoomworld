import { easeIn, easeOut, easeInOut } from "../utilities/graphics";
import { clamp } from "../utilities/helpers.js";

// const eventBufferLength = 5000;

const stateAtTime = (now, state, events) => {
  const stateObject = { ...state };
  simulate(
    stateObject,
    Math.min(stateObject.time, now),
    events[0] ? Math.min(events[0].time, now) : now
  );

  events.forEach(event => {
    if (event.time < now) {
      mergeEvent(stateObject, event);
      simulate(stateObject, event.time, Math.min(event.validUntil, now));
    }
  });

  delete stateObject.validUntil;
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

const simulate = (stateObject, from, to) => {
  const { throttlePower, wheelPower, mass, windX, windY } = stateObject;
  const time = (to - from) / 100;
  const weight = mass * 2;
  const drag = stateObject.drag / 20;

  // Throttle
  const throttle = stateObject.throttle;
  const force = (throttle > 0 ? 1 : 0.5) * throttle * (throttlePower / 2);
  const acceleration = force / weight;
  const thrustVelocity = acceleration * (1 - Math.pow(drag, time / weight));

  const momentum = stateObject.velocity;
  const momentumEndsAt = -(weight / Math.log(1 - drag));
  const momentumDistanceTime = Math.min(time, momentumEndsAt);
  // const momentumTurningVelocityTime =
  //   time > Math.log(1 - drag) * Math.pow(1 - drag, time / weight) / weight;

  const momentumVelocity =
    Math.max(
      0,
      Math.abs(momentum) * Math.pow(1 - drag, time / weight) -
        Math.abs(momentum) * Math.pow(1 - drag, momentumEndsAt / weight)
    ) * Math.sign(momentum);
  // const momentumTurningVelocity =
  //   momentum * Math.pow(1 - drag, momentumDistanceTime / weight);
  const velocity = thrustVelocity + momentumVelocity;
  // const velocityForTurning = thrustVelocity + momentumTurningVelocity;

  const momentumDistance =
    momentum * Math.pow(1 - drag, momentumDistanceTime / weight);
  const distance =
    thrustVelocity * time + momentumDistance * momentumDistanceTime;

  // Turn
  const wheel = stateObject.wheel;
  const turnVelocityFromThrust =
    wheelPower /
    5 *
    wheel /
    mass *
    Math.sign(thrustVelocity) *
    Math.max(
      0,
      Math.min(1, Math.abs(thrustVelocity) * mass * mass) -
        Math.abs(thrustVelocity)
    );
  const turnVelocityFromMomentum =
    wheelPower /
    5 *
    wheel /
    mass *
    Math.sign(momentumVelocity) *
    Math.max(
      0,
      Math.min(1, Math.abs(momentumVelocity) * mass * mass) -
        Math.abs(momentumVelocity)
    );
  const turnAngle =
    turnVelocityFromThrust * time +
    turnVelocityFromMomentum * momentumDistanceTime;
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
  // eventBufferLength,
};
