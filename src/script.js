import "./style.css";
import * as THREE from "three";
import * as dat from "dat.gui";

//Texture Loader
const textureLoader = new THREE.TextureLoader();
const star = textureLoader.load("./star.png");

// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Objects
const geometry = new THREE.TorusGeometry(0.7, 0.2, 16, 100);

const particlesGeomatry = new THREE.BufferGeometry();
const particlesCount = 5000; //count of these particles

//xyz xyz xyz xyz xyz....
const positionArray = new Float32Array(particlesCount * 3); //will contain the x,y,z axis co-ordinates of every particle.

for (let i = 0; i < particlesCount * 3; i++) {
  positionArray[i] = (Math.random() - 0.5) * 5; //randomly position the x,y,z values.
}

//sets the position of this geometry as stored in "positionArray".
particlesGeomatry.setAttribute(
  "position",
  new THREE.BufferAttribute(positionArray, 3)
);

// Materials

const material = new THREE.PointsMaterial({
  size: 0.005,
});

const particlesMaterial = new THREE.PointsMaterial({
  size: 0.005,
  map: star,
  transparent: true,
  color: "#2658c7",
  blending: THREE.AdditiveBlending,
});

// Mesh
const sphere = new THREE.Points(geometry, material);
const particlesMesh = new THREE.Points(particlesGeomatry, particlesMaterial);
scene.add(sphere, particlesMesh);

// Lights

const pointLight = new THREE.PointLight(0xffffff, 0.1);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;
scene.add(pointLight);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 2;
scene.add(camera);

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(new THREE.Color("#030015"));

/**
 * Animate
 */

//Mouse

let mouseX = 0;
let mouseY = 0;

const handleMouseMovements = (event) => {
  mouseX = event.clientX;
  mouseY = event.clientY;
};

document.addEventListener("mousemove", handleMouseMovements);

const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  sphere.rotation.y = 0.5 * elapsedTime;

  //default behaviour
  particlesMesh.rotation.x = -0.1 * elapsedTime;
  particlesMesh.rotation.y = -0.1 * elapsedTime;

  if (mouseX > 0) {
    particlesMesh.rotation.x = mouseY * (elapsedTime * 0.00008);
    particlesMesh.rotation.y = mouseX * (elapsedTime * 0.00008);
  }

  // Update Orbital Controls
  // controls.update()

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
