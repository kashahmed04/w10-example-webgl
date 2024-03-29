import './reset.css';
import './styles.css';

import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, 800 / 600, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(800, 600);
document.body.prepend(renderer.domElement);

const texture = new THREE.TextureLoader().load('./tiger.png');
texture.colorSpace = THREE.SRGBColorSpace;
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshPhysicalMaterial({
  map: texture,
  color: 0xffffff,
});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

const ambient = new THREE.AmbientLight(0xaaaaaa, 0.25);
scene.add(ambient);

const light = new THREE.PointLight(0xffffff, 50, 100);
light.position.set(1, 2, 3);
scene.add(light);

camera.position.z = 2.5;

const animate = () => {
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};

animate();
