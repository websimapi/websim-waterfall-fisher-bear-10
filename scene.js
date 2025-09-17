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
} catch (e) {
    console.error("Error creating WebGL Renderer:", e);
    // Fallback or error message display
    document.body.innerHTML = `
        <div style="display: flex; justify-content: center; align-items: center; height: 100vh; background: #333; color: white; font-family: Arial, sans-serif; text-align: center; padding: 20px;">
            <div>
                <h1>Browser Not Supported</h1>
                <p>This game requires WebGL, which is not available or enabled in your browser.<br>Please try updating your browser or using a different one like Chrome or Firefox.</p>
            </div>
        </div>
    `;
    throw new Error('No supported renderer available');
}
renderer.outputColorSpace = THREE.SRGBColorSpace;

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