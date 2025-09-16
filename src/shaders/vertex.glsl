#include simplexNoise4D.glsl
attribute vec3 tangent;
uniform float uTime;
uniform float uNoiseFrequency;
uniform float uNoiseStrength;
uniform float uTimeStrength;
uniform float uSmallNoiseFrequency;
uniform float uSmallNoiseStrength;
uniform float uSmallTimeStrength;



float getBlob(vec3 pos) {
    vec3 wrappedPos = pos;
    wrappedPos += simplexNoise4d(vec4(pos * uNoiseFrequency, uTime * uTimeStrength)) * uNoiseStrength;
    return simplexNoise4d(vec4(wrappedPos * uSmallNoiseFrequency, uTime * uSmallTimeStrength)) * uSmallNoiseStrength;
}
void main() {
    vec3 bitangent = cross(tangent.xyz, normal);
    float noiseScale = 0.07;
    vec3 extrude = csm_Position + noiseScale * bitangent;
    vec3 intrude = csm_Position - noiseScale * bitangent;

    float blob = getBlob(csm_Position);
    csm_Position += blob * normal;


    extrude += getBlob(extrude) * normal;
    intrude += getBlob(intrude) * normal;

    vec3 intrusionShadow = normalize(intrude - csm_Position);
    vec3 extrusionShadow = normalize(extrude - csm_Position);

    csm_Normal = -cross(intrusionShadow, extrusionShadow);
}