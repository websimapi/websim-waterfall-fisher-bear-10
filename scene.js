import * as THREE from 'three';

export const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

export const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(0, 12, 9);
camera.lookAt(0, 2, 0);

// Create WebGL renderer with fallback error handling
let renderer;
try {
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
} catch (webglError) {
    console.error('WebGL not supported:', webglError);
    // Show error message to user
    document.body.innerHTML = `
        <div style="display: flex; justify-content: center; align-items: center; height: 100vh; background: #333; color: white; font-family: Arial, sans-serif; text-align: center; padding: 20px;">
            <div>
                <h1>Browser Not Supported</h1>
                <p>This game requires WebGL support.<br>Please try updating your browser or enabling hardware acceleration.</p>
            </div>
        </div>
    `;
    throw new Error('WebGL not supported');
}

export { renderer };

export function resizeRenderer() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

export function createLights(targetScene) {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    targetScene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 5);
    targetScene.add(directionalLight);
}

export function mountRenderer(container) {
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    container.appendChild(renderer.domElement);
    resizeRenderer();
}