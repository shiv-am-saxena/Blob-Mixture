import * as THREE from "three";
import vertexShader from "./shaders/vertex.glsl";
import gsap from "gsap";
import CustomShaderMaterial from "three-custom-shader-material/vanilla";
import { HDRLoader } from "three/examples/jsm/loaders/HDRLoader";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { Text } from 'troika-three-text'
import textVertex from './shaders/textVertex.glsl';

const blobs = [
    {
        name: 'Color Fusion',
        background: '#9D73F7',
        config: { "uPositionFrequency": 1, "uPositionStrength": 0.3, "uSmallWavePositionFrequency": 0.5, "uSmallWavePositionStrength": 0.7, "roughness": 1, "metalness": 0, "envMapIntensity": 0.5, "clearcoat": 0, "clearcoatRoughness": 0, "transmission": 0, "flatShading": false, "wireframe": false, "map": "cosmic-fusion" },
    },
    {
        name: 'Discobrain',
        background: '#99aae6',
        config: { "uPositionFrequency": .5, "uPositionStrength": 0.3, "uSmallWavePositionFrequency": 2.3, "uSmallWavePositionStrength": 0.1, "roughness": 0, "metalness": 0, "envMapIntensity": 2, "clearcoat": 1, "clearcoatRoughness": 0, "transmission": 0, "flatShading": false, "wireframe": false, "map": "rainbow" },
    },
    {
        name: 'Purple Mirror',
        background: '#5300B1',
        config: { "uPositionFrequency": 0.584, "uPositionStrength": 0.276, "uSmallWavePositionFrequency": 0.899, "uSmallWavePositionStrength": 1.266, "roughness": 0, "metalness": 1, "envMapIntensity": 2, "clearcoat": 0, "clearcoatRoughness": 0, "transmission": 0, "flatShading": false, "wireframe": false, "map": "purple-rain" },
    },
    {
        name: 'Firefly',
        background: '#380b16',
        config: { "uPositionFrequency": 1, "uPositionStrength": 1, "uSmallWavePositionFrequency": 2.3, "uSmallWavePositionStrength": 0.1, "roughness": 1, "metalness": 0, "envMapIntensity": 0.5, "clearcoat": 0, "clearcoatRoughness": 0, "transmission": 0, "flatShading": false, "wireframe": false, "map": "passion" },
    },
    {
        name: 'Alien Goo',
        background: '#45ACD8',
        config: { "uPositionFrequency": 1.022, "uPositionStrength": 0.99, "uSmallWavePositionFrequency": 0.378, "uSmallWavePositionStrength": 0.341, "roughness": 0.292, "metalness": 0.73, "envMapIntensity": 0.86, "clearcoat": 1, "clearcoatRoughness": 0, "transmission": 0, "flatShading": false, "wireframe": false, "map": "lucky-day" },
    },
    {
        name: 'Metagum',
        background: '#99aae6',
        config: { "uPositionFrequency": .9, "uPositionStrength": .8, "uSmallWavePositionFrequency": 1.8, "uSmallWavePositionStrength": 0.09, "roughness": 1, "metalness": 0, "envMapIntensity": 0.5, "clearcoat": 0, "clearcoatRoughness": 0, "transmission": 0, "flatShading": false, "wireframe": false, "map": "imaginarium" },
    },
    {
        name: 'Genesys',
        background: '#99aae6',
        config: { "uPositionFrequency": 0.584, "uPositionStrength": 0.3, "uSmallWavePositionFrequency": 1., "uSmallWavePositionStrength": 0.266, "roughness": 0, "metalness": 0, "envMapIntensity": 2, "clearcoat": 1, "clearcoatRoughness": 0, "transmission": 0, "flatShading": false, "wireframe": false, "map": "synthwave" },
    },
];

let currentIndex = 0;
let isAnimating = false;
const loadingManager = new THREE.LoadingManager();

const textureLoader = new THREE.TextureLoader(loadingManager);

const hdrLoader = new HDRLoader(loadingManager);

// Create scene
const scene = new THREE.Scene();
scene.background = new THREE.Color('#9D73F7');
// Create camera
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    100
);
camera.position.z = 3;

// Create renderer
const canvas = document.querySelector('#canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.outputColorSpace = THREE.SRGBColorSpace;

//Load HDR environment map
hdrLoader.loadAsync('https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/studio_small_08_2k.hdr').then((texture) => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture;
    // scene.background = texture;
});

const uniforms = {
    uTime: { value: 0 },
    uPositionFrequency: { value: blobs[currentIndex].config.uPositionFrequency },
    uPositionStrength: { value: blobs[currentIndex].config.uPositionStrength },
    uTimeFrequency: { value: .3 },
    uSmallWavePositionFrequency: { value: blobs[currentIndex].config.uSmallWavePositionFrequency },
    uSmallWavePositionStrength: { value: blobs[currentIndex].config.uSmallWavePositionStrength },
    uSmallWaveTimeFrequency: { value: .3 },
};


// Create Blob Geometry
const material = new CustomShaderMaterial({
    baseMaterial: THREE.MeshPhysicalMaterial,
    vertexShader,
    map: textureLoader.load(`./gradients/${blobs[currentIndex].config.map}.png`),
    metalness: blobs[currentIndex].config.metalness,
    roughness: blobs[currentIndex].config.roughness,
    envMapIntensity: blobs[currentIndex].config.envMapIntensity,
    clearcoat: blobs[currentIndex].config.clearcoat,
    clearcoatRoughness: blobs[currentIndex].config.clearcoatRoughness,
    transmission: blobs[currentIndex].config.transmission,
    flatShading: blobs[currentIndex].config.flatShading,
    wireframe: blobs[currentIndex].config.wireframe,
    uniforms,
});

const mergedGeometry = mergeVertices(new THREE.IcosahedronGeometry(1, 70));
mergedGeometry.computeTangents();
const blob = new THREE.Mesh(mergedGeometry, material);
scene.add(blob);

// Handle window resize and device pixel ratio
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});


function updateBlob(config) {
    if (config.uPositionFrequency !== undefined) gsap.to(material.uniforms.uPositionFrequency, { value: config.uPositionFrequency, duration: 1, ease: 'power2.inOut' });
    if (config.uPositionStrength !== undefined) gsap.to(material.uniforms.uPositionStrength, { value: config.uPositionStrength, duration: 1, ease: 'power2.inOut' });
    if (config.uSmallWavePositionFrequency !== undefined) gsap.to(material.uniforms.uSmallWavePositionFrequency, { value: config.uSmallWavePositionFrequency, duration: 1, ease: 'power2.inOut' });
    if (config.uSmallWavePositionStrength !== undefined) gsap.to(material.uniforms.uSmallWavePositionStrength, { value: config.uSmallWavePositionStrength, duration: 1, ease: 'power2.inOut' });
    if (config.uSmallWaveTimeFrequency !== undefined) gsap.to(material.uniforms.uSmallWaveTimeFrequency, { value: config.uSmallWaveTimeFrequency, duration: 1, ease: 'power2.inOut' });
    if (config.map !== undefined) {
        setTimeout(() => {
            const texture = textureLoader.load(`./gradients/${config.map}.png`);
            texture.colorSpace = THREE.SRGBColorSpace;
            material.map = texture;
        }, 500);
    }
    if (config.roughness !== undefined) gsap.to(material, { roughness: config.roughness, duration: 1, ease: 'power2.inOut' });
    if (config.metalness !== undefined) gsap.to(material, { metalness: config.metalness, duration: 1, ease: 'power2.inOut' });
    if (config.envMapIntensity !== undefined) gsap.to(material, { envMapIntensity: config.envMapIntensity, duration: 1, ease: 'power2.inOut' });
    if (config.clearcoat !== undefined) gsap.to(material, { clearcoat: config.clearcoat, duration: 1, ease: 'power2.inOut' });
    if (config.clearcoatRoughness !== undefined) gsap.to(material, { clearcoatRoughness: config.clearcoatRoughness, duration: 1, ease: 'power2.inOut' });
    if (config.transmission !== undefined) gsap.to(material, { transmission: config.transmission, duration: 1, ease: 'power2.inOut' });
    if (config.flatShading !== undefined) gsap.to(material, { flatShading: config.flatShading, duration: 1, ease: 'power2.inOut' });
    if (config.wireframe !== undefined) gsap.to(material, { wireframe: config.wireframe, duration: 1, ease: 'power2.inOut' });
}
const textMaterial = new THREE.ShaderMaterial({
    vertexShader: textVertex,
    fragmentShader: `void main() {
        gl_FragColor = vec4(1.0);
    }`,
    uniforms: {
        progress: { value: 0 },
        direction: { value: 1 }
    },
    side: THREE.DoubleSide,
});


//Clock
const clock = new THREE.Clock();

const text = blobs.map((blob, index) => {
    const myText = new Text();
    myText.text = blob.name;
    myText.font = './aften_screen.woff';
    myText.fontSize = window.innerWidth / 6000;
    myText.anchorX = 'center';
    myText.anchorY = 'middle';
    if (index !== 0) {
        myText.scale.set(0, 0, 0);
    }
    myText.material = textMaterial;
    myText.position.set(0, 0, 2);
    myText.letterSpacing = -0.05;
    myText.glyphGeometryDetail = 20;
    myText.sync();
    scene.add(myText);
    return myText;
});

window.addEventListener('wheel', (e) => {
    if (isAnimating) return;
    isAnimating = true;

    let direction = Math.sign(e.deltaY);
    let newIndex = (currentIndex + direction + blobs.length) % blobs.length;
    text[newIndex].scale.set(1, 1, 1);
    text[newIndex].position.x = direction * 7;

    gsap.to(textMaterial.uniforms.progress, {
        value: .5,
        duration: 2,
        ease: 'linear',
        onComplete: () => {
            // textMaterial.uniforms.progress.value = 0;
            textMaterial.uniforms.progress.value = 0;
            currentIndex = newIndex;
            isAnimating = false;
        }
    })

    gsap.to(text[currentIndex].position, {
        x: -direction * 7,
        duration: 1,
        ease: 'linear',
    });
    gsap.to(text[newIndex].position, {
        x: -direction * 0,
        duration: 1,
        ease: 'linear',
    });

    gsap.to(blob.rotation, {
        y: Math.PI * 3 * -direction + blob.rotation.y,
        duration: 2,
        ease: 'power2.inOut'
    });

    const bg = new THREE.Color(blobs[newIndex].background);
    gsap.to(scene.background, {
        r: bg.r,
        g: bg.g,
        b: bg.b,
        duration: 1,
        ease: 'linear'
    });


    updateBlob(blobs[newIndex].config);
});

loadingManager.onLoad = () => {

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        uniforms.uTime.value = clock.getElapsedTime();
        renderer.render(scene, camera);
    }
    const bg = new THREE.Color(blobs[currentIndex+1].background);
    gsap.to(scene.background, {
        r: bg.r,
        g: bg.g,
        b: bg.b,
        duration: 1,
        ease: 'linear'
    });
    animate();

}