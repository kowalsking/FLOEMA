#define PI 3.141592653589793238

attribute vec2 uv;
attribute vec3 position;

uniform vec2 uViewportSizes;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

varying vec2 vUv;

void main() {
  vUv = uv;

  vec4 newPosition = modelViewMatrix * vec4(position, 1.0);

  // newPosition.z += sin(position.y / uViewportSizes.y * PI + PI / 2.0) * abs(uStrength);
  newPosition.z *= sin((newPosition.y / uViewportSizes.y) * (newPosition.x / uViewportSizes.x) * PI + PI / 2.0) * 2.0;

  gl_Position = projectionMatrix * newPosition;
}
