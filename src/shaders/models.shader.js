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

  attribute vec2 position;
  attribute vec4 offset;
  attribute float seed;

  varying vec4 outputColor;

  vec2 cameraTranslation = vec2(camera[0], camera[1]);
  float cameraAngle = camera[2];

  void main() {
    vec2 translation = vec2(offset[0], offset[1]);
    float angle = offset[2];
    float modelScale = offset[3];

    vec2 scaledPosition = vec2(
      position[0] * modelScale,
      position[1] * modelScale
    );
    vec2 rotatedPosition = vec2(
      scaledPosition[0] * cos(angle) - scaledPosition[1] * sin(angle),
      scaledPosition[1] * cos(angle) + scaledPosition[0] * sin(angle)
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
