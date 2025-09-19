import { deflate } from "three/examples/jsm/libs/fflate.module.js"

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
]

export default blobs;