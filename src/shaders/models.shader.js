const fragmentShader = `
  precision mediump float;

  varying vec4 outputColor;

  void main() {
    gl_FragColor = outputColor;
  }
`;

const vertexShader = `
  precision mediump float;
  uniform float viewportWidth;
  uniform float viewportHeight;
  uniform float unit;
  uniform float perspective;
  uniform vec3 camera;
  uniform vec4 color;
  uniform float z;
  uniform float randomness;

  attribute vec2 position;
  attribute vec4 offset;

  varying vec4 outputColor;

  vec2 cameraTranslation = vec2(camera[0], camera[1]);
  float cameraAngle = camera[2];

  // http://byteblacksmith.com/improvements-to-the-canonical-one-liner-glsl-rand-for-opengl-es-2-0/
  highp float rand(vec2 co) {
    highp float a = 12.9898;
    highp float b = 78.233;
    highp float c = 43758.5453;
    highp float dt= dot(co.xy ,vec2(a,b));
    highp float sn= mod(dt,3.14);
    return fract(sin(sn) * c);
  }

  void main() {
    vec2 translation = vec2(offset[0], offset[1]);
    float angle = offset[2];
    float modelScale = offset[3];

    vec2 scaledPosition = vec2(
      position[0] * modelScale,
      position[1] * modelScale
    );
    vec2 randomizedPosition = vec2(
      scaledPosition[0] + randomness * rand(position - translation),
      scaledPosition[1] + randomness * rand(position + translation)
    );
    vec2 rotatedPosition = vec2(
      randomizedPosition[0] * cos(angle) - randomizedPosition[1] * sin(angle),
      randomizedPosition[1] * cos(angle) + randomizedPosition[0] * sin(angle)
    );
    vec2 translatedPosition = rotatedPosition + translation - cameraTranslation;
    vec2 shiftedPosition = vec2(
      translatedPosition[0],
      translatedPosition[1] + perspective * z
    );
    vec2 cameraScaledPosition = vec2(
      unit / viewportWidth * shiftedPosition[0],
      unit / viewportHeight * shiftedPosition[1]
    );

    gl_Position = vec4(cameraScaledPosition, 0, 1);
    outputColor = color;
  }
`;

export { fragmentShader, vertexShader };
