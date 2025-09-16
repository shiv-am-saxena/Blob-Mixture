import * as THREE from "three";
import vertexShader from "./shaders/vertex.glsl";
import gsap from "gsap";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import CustomShaderMaterial from "three-custom-shader-material/vanilla";
import { HDRLoader } from "three/examples/jsm/loaders/HDRLoader";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import {GUI} from "lil-gui"; // <-- Add this line

// Create scene
const scene = new THREE.Scene();

// Create camera
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    100
);
camera.position.z = 5;

// Create renderer
const canvas = document.querySelector('#canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.outputColorSpace = THREE.SRGBColorSpace;

//Load HDR environment map
const hdrLoader = new HDRLoader();
hdrLoader.loadAsync('https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/studio_small_08_2k.hdr').then((texture) => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture;
    // scene.background = texture;
});

const uniforms = {
    uTime: { value: 0 },
    uNoiseFrequency: { value: 1.5 },
    uNoiseStrength: { value: 0.4 },
    uTimeStrength: { value: 0.5 },
    uSmallNoiseFrequency: { value: 1.0 },
    uSmallNoiseStrength: { value: 1.0 },
    uSmallTimeStrength: { value: 1.0 },
};

// Add lil-gui for uniforms
const gui = new GUI();
gui.add(uniforms.uNoiseFrequency, "value", 0, 5).name("Noise Frequency");
gui.add(uniforms.uNoiseStrength, "value", 0, 2).name("Noise Strength");
gui.add(uniforms.uTimeStrength, "value", 0, 2).name("Time Strength");
gui.add(uniforms.uSmallNoiseFrequency, "value", 0, 10).name("Small Noise Freq");
gui.add(uniforms.uSmallNoiseStrength, "value", 0, 10).name("Small Noise Str");
gui.add(uniforms.uSmallTimeStrength, "value", 0, 10).name("Small Time Str");

// Create Blob Geometry
const geometry = new THREE.IcosahedronGeometry(2, 70, 70);
const material = new CustomShaderMaterial({
    baseMaterial: new THREE.MeshPhysicalMaterial,
    metalness: .5,
    roughness: 0,
    color: new THREE.Color(0xff0000),
    vertexShader,
    uniforms,
});

const mergedGeometry = mergeVertices(geometry);
mergedGeometry.computeTangents();
const blob = new THREE.Mesh(mergedGeometry, material);
scene.add(blob);

// Handle window resize and device pixel ratio
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
const controls = new OrbitControls(camera, document.querySelector('#canvas'));
controls.enableDamping = true;
controls.dampingFactor = 0.05;

//Clock
const clock = new THREE.Clock();
// Animation loop
function animate() {
    requestAnimationFrame(animate);
    uniforms.uTime.value = clock.getElapsedTime();
    controls.update();
    renderer.render(scene, camera);
}
animate();