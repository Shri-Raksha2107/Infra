"use client";

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useScroll, MeshDistortMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';

export function ServerModel() {
    const scroll = useScroll();
    const groupRef = useRef<THREE.Group>(null);
    const meshRefs = useRef<(THREE.Mesh | null)[]>([]);

    // Procedural components of the server
    const components = [
        { pos: [0, 1, 0], size: [2, 0.4, 3], color: "#1a1a1a" }, // Top Panel
        { pos: [0, 0.5, 0], size: [1.8, 0.2, 2.8], color: "#333333" }, // PCB 1
        { pos: [0.5, 0.3, 0.5], size: [0.4, 0.4, 0.4], color: "#0066FF" }, // Component A
        { pos: [-0.5, 0.3, -0.5], size: [0.3, 0.5, 0.3], color: "#10b981" }, // Component B
        { pos: [0, 0, 0], size: [1.8, 0.2, 2.8], color: "#333333" }, // PCB 2
        { pos: [0, -0.5, 0], size: [1.8, 0.2, 2.8], color: "#333333" }, // PCB 3
        { pos: [0, -1, 0], size: [2, 0.4, 3], color: "#1a1a1a" }, // Bottom Panel
    ];

    useFrame((state) => {
        const offset = scroll.offset; // 0 to 1

        if (groupRef.current) {
            // Rotate the whole unit slightly
            groupRef.current.rotation.y = THREE.MathUtils.lerp(
                state.clock.elapsedTime * 0.1,
                state.clock.elapsedTime * 0.5,
                offset
            );
        }

        // Explosion logic
        meshRefs.current.forEach((mesh, i) => {
            if (!mesh) return;

            const component = components[i];
            const initialPos = new THREE.Vector3(...component.pos);

            // Calculate exploded position
            // Components fly out in different directions based on their index
            const direction = new THREE.Vector3(
                (i % 2 === 0 ? 1 : -1) * (i * 0.5),
                (i - 3) * 1.5,
                (i % 3 === 0 ? 1 : -1) * 1.2
            );

            // State 1: Hero (offset 0) -> Initial Position
            // State 2: Deconstruction (offset 0.25) -> Partial explosion
            // State 3: Fully Exploded (offset 0.5) -> Max explosion
            // State 4: Zoom (offset 0.75) -> Specific focus (can handle cam here)
            // State 5: Reassembly (offset 1) -> Back to initial + Glow

            let explosionFactor = 0;
            if (offset < 0.5) {
                explosionFactor = offset * 2; // Flows from 0 to 1 as scroll goes 0 to 0.5
            } else {
                explosionFactor = (1 - offset) * 2; // Pulls back as scroll goes 0.5 to 1
            }

            mesh.position.lerpVectors(
                initialPos,
                direction,
                explosionFactor
            );

            // Glow intensity based on offset (State 5)
            if (mesh.material instanceof THREE.MeshStandardMaterial) {
                mesh.material.emissiveIntensity = offset > 0.8 ? (offset - 0.8) * 10 : 0.1;
            }
        });

        // Camera move logic
        if (offset > 0.6 && offset < 0.9) {
            // Zoom in tight for State 4
            state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, 4, 0.1);
        } else {
            state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, 10, 0.1);
        }
    });

    return (
        <group ref={groupRef}>
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                {components.map((comp, i) => (
                    <mesh
                        key={i}
                        ref={(el) => (meshRefs.current[i] = el)}
                        position={comp.pos as [number, number, number]}
                    >
                        <boxGeometry args={comp.size as [number, number, number]} />
                        <meshStandardMaterial
                            color={comp.color}
                            metalness={0.8}
                            roughness={0.2}
                            emissive={comp.color}
                            emissiveIntensity={0.1}
                        />
                    </mesh>
                ))}
            </Float>
        </group>
    );
}
