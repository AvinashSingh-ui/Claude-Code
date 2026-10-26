import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const cyberGridVertex = `
  varying vec3 vWorldPos;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPosition.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

const cyberGridFragment = `
  varying vec3 vWorldPos;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec3 uColor;
  uniform vec3 uPulseColor;

  void main() {
    // Scale coordinate grid in world space
    vec2 coord = vWorldPos.xz * 0.6;
    vec2 grid = abs(fract(coord - 0.5) - 0.5) / fwidth(coord);
    float line = min(grid.x, grid.y);
    float gridAlpha = 1.0 - min(line, 1.0);

    // Dynamic data pulse sweeping through the grid (matrix flow)
    float wave = sin(vWorldPos.z * 0.5 - uTime * 2.2);
    float pulse = smoothstep(0.85, 1.0, wave);

    // Radial distance falloff for smooth horizon fade
    float dist = length(vWorldPos.xz);
    float falloff = smoothstep(22.0, 3.5, dist);

    // Mix neon cyan grid with high-intensity pulse wave
    vec3 col = mix(uColor, uPulseColor, pulse);
    float alpha = (gridAlpha * 0.45 + pulse * 0.6) * falloff;

    gl_FragColor = vec4(col, alpha);
  }
`;

export const CyberGrid = ({ position = [0, -2.5, 0] }) => {
  const materialRef = useRef();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color('#1e40af') }, // Deep electric blue
      uPulseColor: { value: new THREE.Color('#38bdf8') }, // Bright cyber sky
    }),
    []
  );

  useFrame((state, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[45, 45, 1, 1]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={cyberGridVertex}
        fragmentShader={cyberGridFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
};
