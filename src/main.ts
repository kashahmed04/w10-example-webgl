import './reset.css';
import './styles.css';

import * as THREE from 'three';

//go over all and what each part specificlly does**
//how can we move camera is it mouse or by key**

//so for three.js only we dont need a canvas HTML element and we can set canvas element up here**
//we still need canvas element for main branch and babylon though**
//is the main branch just webgl whereas three.js and babylon.js are webgl with libraries attached to webgl to make it easier to code**
//why dont we say 'webgl' anywhere in here how does it know we are working with webgl with this library then**
const scene = new THREE.Scene();
//does scene represent making a canvas**

const camera = new THREE.PerspectiveCamera(50, 800 / 600, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(800, 600);
document.body.prepend(renderer.domElement);
//we never defined DOM element**

const texture = new THREE.TextureLoader().load('./tiger.png');
texture.colorSpace = THREE.SRGBColorSpace; //if we dont have this the whole canvas would look faded and this makes it look more cleaerer
//and colorful**
const material = new THREE.MeshPhysicalMaterial({
  map: texture,
  color: 0xffffff,
});
const geometry = new THREE.BoxGeometry(1, 1, 1);
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

const ambient = new THREE.AmbientLight(0xaaaaaa, 0.25);
scene.add(ambient);

const light = new THREE.PointLight(0xffffff, 50, 100);
light.position.set(1, 2, 3);
scene.add(light);

//why did we define two lights here what does each do**

camera.position.z = 2.5;

const animate = () => {
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};

animate();
