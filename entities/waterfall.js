import * as THREE from 'three';

const waterMat = new THREE.MeshLambertMaterial({ color: 0x1e90ff, transparent: true, opacity: 0.8 });
const foamMat = new THREE.MeshLambertMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 });
const particleMat = new THREE.MeshBasicMaterial({ color: 0x967969, transparent: true, opacity: 0.6 });
const groundMat = new THREE.MeshLambertMaterial({ color: 0x8b7355 }); // Brown ground material

export function createWaterfall() {
    const group = new THREE.Group();
    group.name = "waterfall";
    const waterWidth = 6.8; // Slightly narrower to prevent clipping with mountains
    const cliffEdgeZ = 2.5;
    const cliffTopY = 2;
    const fallHeight = 20;
    const riverLength = 18; // Reduced from 30 to prevent extending too far

    // Static ground under river - positioned lower and back
    const groundRiverGeo = new THREE.PlaneGeometry(waterWidth, riverLength);
    const groundRiver = new THREE.Mesh(groundRiverGeo, groundMat);
    groundRiver.rotation.x = -Math.PI / 2;
    groundRiver.position.set(0, cliffTopY - 0.5, cliffEdgeZ - riverLength / 2 - 1);
    group.add(groundRiver);

    // Static ground behind waterfall - positioned back and matching fall dimensions
    const groundFallGeo = new THREE.PlaneGeometry(waterWidth, fallHeight);
    const groundFall = new THREE.Mesh(groundFallGeo, groundMat);
    groundFall.position.set(0, cliffTopY - fallHeight / 2, cliffEdgeZ - 1.5);
    group.add(groundFall);

    // Static ground below log area - positioned lower and back
    const groundBelowLength = 4;
    const groundBelowGeo = new THREE.PlaneGeometry(waterWidth, groundBelowLength);
    const groundBelow = new THREE.Mesh(groundBelowGeo, groundMat);
    groundBelow.rotation.x = -Math.PI / 2;
    groundBelow.position.set(0, cliffTopY - 0.5, cliffEdgeZ + groundBelowLength / 2 - 1);
    group.add(groundBelow);

    const riverGeo = new THREE.PlaneGeometry(waterWidth, riverLength);
    const river = new THREE.Mesh(riverGeo, waterMat);
    river.rotation.x = -Math.PI / 2;
    river.position.set(0, cliffTopY, cliffEdgeZ - riverLength / 2);
    group.add(river);
    
    const fallGeo = new THREE.PlaneGeometry(waterWidth, fallHeight);
    const fall = new THREE.Mesh(fallGeo, waterMat);
    fall.position.set(0, cliffTopY - fallHeight / 2, cliffEdgeZ);
    group.add(fall);
    
    for (let i = 0; i < 50; i++) {
        const foam = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), foamMat);
        const onRiver = Math.random() > 0.4;
        foam.userData.onRiver = onRiver;
        if (onRiver) {
            foam.position.set((Math.random() - 0.5) * (waterWidth - 1), cliffTopY + 0.1, cliffEdgeZ - (Math.random() * riverLength));
            foam.userData.velocity = new THREE.Vector3(0, 0, Math.random() * 0.05 + 0.05);
        } else {
            foam.position.set((Math.random() - 0.5) * (waterWidth - 1), cliffTopY - (Math.random() * fallHeight), cliffEdgeZ);
            foam.userData.velocity = new THREE.Vector3(0, -(Math.random() * 0.1 + 0.1), 0);
        }
        group.add(foam);
    }

    // Underwater particles
    for (let i = 0; i < 100; i++) {
        const particleSize = 0.05 + Math.random() * 0.1;
        const particleGeo = new THREE.BoxGeometry(particleSize, particleSize, particleSize);
        const particle = new THREE.Mesh(particleGeo, particleMat);
        
        particle.position.set(
            (Math.random() - 0.5) * (waterWidth - 1),
            Math.random() * cliffTopY, // from riverbed to surface
            cliffEdgeZ - (Math.random() * riverLength)
        );
        particle.userData.velocity = new THREE.Vector3(
            (Math.random() - 0.5) * 0.01,
            (Math.random() - 0.5) * 0.01,
            (Math.random() * 0.03 + 0.02)
        );
        particle.userData.isUnderwaterParticle = true;
        group.add(particle);
    }
    
    return group;
}

export function updateWaterfall(waterfallGroup) {
    if (!waterfallGroup) return;
    const cliffEdgeZ = 2.5;
    const cliffTopY = 2;
    const fallHeight = 20;
    const riverLength = 30;
    waterfallGroup.children.forEach(child => {
        if (child.userData.velocity) {
            child.position.add(child.userData.velocity);
            if (child.userData.isUnderwaterParticle) {
                 if (child.position.z > cliffEdgeZ) {
                    child.position.z = cliffEdgeZ - riverLength; // reset to back
                }
                if (child.position.y > cliffTopY || child.position.y < 0) {
                    child.userData.velocity.y *= -1; // bounce off top/bottom
                }
            } else if (child.userData.onRiver && child.position.z > cliffEdgeZ) {
                child.position.z = cliffEdgeZ - riverLength;
            } else if (!child.userData.onRiver && child.position.y < cliffTopY - fallHeight) {
                child.position.y = cliffTopY;
            }
        }
    });
}