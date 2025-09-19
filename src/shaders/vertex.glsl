#include simplexNoise4D.glsl
attribute vec3 tangent;
uniform float uTime;
uniform float uPositionFrequency;
uniform float uPositionStrength;
uniform float uTimeFrequency;

uniform float uSmallWavePositionFrequency;
uniform float uSmallWavePositionStrength;
uniform float uSmallWaveTimeFrequency;


float getBlob(vec3 pos) {
    vec3 wrappedPos = pos;
    wrappedPos += simplexNoise4d(vec4(position * uPositionFrequency, uTime * uTimeFrequency)) * uPositionStrength;

    return simplexNoise4d(vec4(wrappedPos * uSmallWavePositionFrequency, uTime * uSmallWaveTimeFrequency)) * uSmallWavePositionStrength;
}
void main() {
    vec3 bitangent = cross(tangent.xyz, normal);
    float noiseScale = 0.07;
    vec3 extrude = csm_Position + noiseScale * tangent.xyz;
    vec3 intrude = csm_Position + noiseScale * bitangent;

    float blob = getBlob(csm_Position);
    csm_Position += blob * normal;

    extrude += getBlob(extrude) * normal;
    intrude += getBlob(intrude) * normal;

    vec3 intrusionShadow = normalize(intrude - csm_Position);
    vec3 extrusionShadow = normalize(extrude - csm_Position);

    csm_Normal = -cross(extrusionShadow, intrusionShadow);
}