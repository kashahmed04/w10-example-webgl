import './reset.css';
import './styles.css';

import * as THREE from 'three';

//go over all and what each part specificlly does**
//how can we move camera is it mouse or by key**

//so for three.js only we dont need a canvas HTML element and we can set canvas element up here**
//we still need canvas element for main branch and babylon though**
//is the main branch just webgl whereas three.js and babylon.js are webgl with libraries attached to webgl to make it easier to code (wrapper
//around main API are what libraries are)(are libraries only used for API's to make them easier to use)**
//why dont we say 'webgl' anywhere (like we did in babylon and main webgl when doing our get context)**
//in here how does it know we are working with webgl with this library then**
const scene = new THREE.Scene();
//tree of all the things that are part of the renderer or scene (like that type of scene with
//camera and add things to scene)

const camera = new THREE.PerspectiveCamera(50, 800 / 600, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
//does scene represent making a canvas (yes)
renderer.setSize(800, 600);
document.body.prepend(renderer.domElement);
//the renderer domelemnt is the canvas and we add the canvas to the body 

const texture = new THREE.TextureLoader().load('./tiger.png');
texture.colorSpace = THREE.SRGBColorSpace; //if we dont have this the whole canvas would look faded and this makes it look more cleaerer
//and colorful (we only need this in three.js right) (this is texture specific and in this case this was the color space
//for the texture and if we are in photoshop we can import our images and it wont require a SRGB indicator)
const material = new THREE.MeshPhysicalMaterial({
  map: texture,
  color: 0xffffff,
});
const geometry = new THREE.BoxGeometry(1, 1, 1);
const cube = new THREE.Mesh(geometry, material); //use the box geometry for the and material for the surface
//for the white and thats what we call our cube 
scene.add(cube);

const ambient = new THREE.AmbientLight(0xaaaaaa, 0.25);
scene.add(ambient);

const light = new THREE.PointLight(0xffffff, 50, 100);
light.position.set(1, 2, 3);
scene.add(light);

camera.position.z = 2.5;

//why did we use z-axis here (we move the camera back because the camera would have started off right at the cube)

const animate = () => {
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  //change our scene and camera for adjustments and keep doing that over and over again
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};

//calls animate initially to start the animation off then it loops from the requestanimationframe inside the animate method
animate();
