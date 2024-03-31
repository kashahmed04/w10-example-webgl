import './reset.css';
import './styles.css';

import { FreeCamera } from '@babylonjs/core/Cameras/freeCamera';
import { Engine } from '@babylonjs/core/Engines/engine';
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { CreateBox } from '@babylonjs/core/Meshes/Builders/boxBuilder';
import { Scene } from '@babylonjs/core/scene';

import { StandardMaterial, Texture } from '@babylonjs/core';

//go over all**

// Get the canvas element from the DOM.
// dont need canvas HTML element for three.js and we create canvas in JS but we need it for babylon and just using webgl like
// we did in our main branch**
// why did we not do a get context 'webgl' but we did in the main branch arent we still using webgl**
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
canvas.width = 800;
canvas.height = 600;

// Associate a Babylon Engine to it.
// does this allow everything we apply from babylon.js library to apply in the scene only rather than the whole browser why did
// we not do this in three.js or main branch**
const engine = new Engine(canvas);

// Create our first scene.
const scene = new Scene(engine);

// This creates and positions a free camera (non-mesh)
// what does it mean a free camera and non-mesh**
const camera = new FreeCamera('camera1', new Vector3(0, 0, -5), scene);

// This targets the camera to scene origin
// is the origin the middle of the screen or top left because we have canvas and canvas and JS are top left by default for origin**
// where is origin in babylon.js and three.js and just webgl by default since they use canvas** 
camera.setTarget(Vector3.Zero());

// This attaches the camera to the canvas
// what does the true do**
camera.attachControl(canvas, true);

// This creates a light, aiming 0,1,0 - to the sky (non-mesh)
// what does the coorindates say because it says 1,1,0 instead**
const light = new HemisphericLight('light1', new Vector3(1, 1, 0), scene);

// Default intensity is 1. Let's dim the light a small amount
// we still set it as 1 so how is it dimmed**
light.intensity = 1;

// Create a grid material
const material = new StandardMaterial('mat');
const texture = new Texture('./tiger.png');
material.diffuseTexture = texture;
//is diffuseTexture built in**

// Our built-in 'cube' shape.
const cube = CreateBox('cube1', { size: 2 }, scene);

// Move the cube upward 1/2 its height
cube.position.y = 0;
//how did we know to make it 0 for the 1/2 of the height**

// Affect a material
cube.material = material;

// Render every frame
engine.runRenderLoop(() => {
  cube.rotation.x += 0.01;
  cube.rotation.z += 0.01;
  scene.render();
});

//we dont have to do request animation frame because**
//is this method built into babylon to run each frame (or is it the .render() that does the looping)**
//does this work the same way as request animation frame**
