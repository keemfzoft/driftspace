import * as THREE from "three";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0);

renderer.shadowMap.enabled = true;

document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);

cube.castShadow = true;

scene.add(cube);

const light = new THREE.DirectionalLight(0xffffff, 1);

light.position.set(3, 5, 2);
light.castShadow = true;

scene.add(light);

scene.add(new THREE.AmbientLight(0x404040, 0.5));

function animate(time) {
    cube.rotation.x = time / 2000;
    cube.rotation.y = time / 1000;

    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
