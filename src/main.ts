import './reset.css';
import './styles.css';

import { FreeCamera } from '@babylonjs/core/Cameras/freeCamera';
import { Engine } from '@babylonjs/core/Engines/engine';
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { CreateBox } from '@babylonjs/core/Meshes/Builders/boxBuilder';
import { Scene } from '@babylonjs/core/scene';

import { StandardMaterial, Texture } from '@babylonjs/core';

// Get the canvas element from the DOM.
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
canvas.width = 800;
canvas.height = 600;

// Associate a Babylon Engine to it.
const engine = new Engine(canvas);

// Create our first scene.
const scene = new Scene(engine);

// This creates and positions a free camera (non-mesh)
const camera = new FreeCamera('camera1', new Vector3(0, 0, -5), scene);

// This targets the camera to scene origin
camera.setTarget(Vector3.Zero());

// This attaches the camera to the canvas
camera.attachControl(canvas, true);

// This creates a light, aiming 0,1,0 - to the sky (non-mesh)
const light = new HemisphericLight('light1', new Vector3(1, 1, 0), scene);

// Default intensity is 1. Let's dim the light a small amount
light.intensity = 1;

// Create a grid material
const material = new StandardMaterial('mat');
const texture = new Texture('./tiger.png');
material.diffuseTexture = texture;

// Our built-in 'cube' shape.
const cube = CreateBox('cube1', { size: 2 }, scene);

// Move the cube upward 1/2 its height
cube.position.y = 0;

// Affect a material
cube.material = material;

// Render every frame
engine.runRenderLoop(() => {
  cube.rotation.x += 0.01;
  cube.rotation.z += 0.01;
  scene.render();
});
