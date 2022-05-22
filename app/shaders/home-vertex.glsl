#define PI 3.141592653589793238

attribute vec2 uv;
attribute vec3 position;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

varying vec2 vUv;

void main() {
  vUv = uv;

  vec4 newPosition = modelViewMatrix * vec4(position, 1.0);

  newPosition.z += cos(position.x * PI);

  gl_Position = projectionMatrix * newPosition;
}
