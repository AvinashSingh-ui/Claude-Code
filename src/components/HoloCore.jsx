import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const holoVertexShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;
  uniform float uTime;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    vUv = uv;

    // Subtle digital oscillation displacement
    float displacement = sin(position.y * 5.0 + uTime * 2.0) * cos(position.x * 5.0 + uTime * 1.5) * 0.05;
    vec3 newPos = position + normal * displacement;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
  }
`;

const holoFragmentShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec3 uColor;

  void main() {
    // Fresnel rim glow calculation
    vec3 viewDir = normalize(-vPosition);
    float fresnel = pow(1.0 - max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0), 2.2);

    // Digital terminal horizontal scanlines
    float scanline = sin(vPosition.y * 40.0 - uTime * 3.5) * 0.5 + 0.5;
    scanline = pow(scanline, 2.0);

    // Digital matrix wire pattern
    float lattice = abs(sin(vUv.x * 30.0) * cos(vUv.y * 30.0));
    lattice = smoothstep(0.3, 0.7, lattice);

    vec3 baseColor = vec3(0.01, 0.03, 0.08);
    vec3 glow = uColor * (fresnel * 1.0 + scanline * 0.4 + lattice * 0.3);

    float alpha = clamp(fresnel * 0.8 + scanline * 0.25 + 0.1, 0.0, 1.0);

    gl_FragColor = vec4(baseColor + glow, alpha);
  }
`;

export const HoloCore = ({ position = [0, 0, 0] }) => {
  const coreMaterialRef = useRef();
  const ring1Ref = useRef();
  const ring2Ref = useRef();
  const groupRef = useRef();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color('#38bdf8') },
    }),
    []
  );

  useFrame((state, delta) => {
    const elapsed = state.clock.getElapsedTime();

    if (coreMaterialRef.current) {
      coreMaterialRef.current.uniforms.uTime.value = elapsed;
    }

    if (ring1Ref.current) {
      ring1Ref.current.rotation.z += delta * 0.4;
      ring1Ref.current.rotation.x = Math.sin(elapsed * 0.5) * 0.3 + 0.4;
    }

    if (ring2Ref.current) {
      ring2Ref.current.rotation.z -= delta * 0.3;
      ring2Ref.current.rotation.y = Math.cos(elapsed * 0.4) * 0.4 - 0.3;
    }

    if (groupRef.current) {
      groupRef.current.rotation.y = elapsed * 0.15;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Central Holographic Sphere with custom shader */}
      <mesh>
        <sphereGeometry args={[0.75, 48, 48]} />
        <shaderMaterial
          ref={coreMaterialRef}
          vertexShader={holoVertexShader}
          fragmentShader={holoFragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Cyber Inner Wireframe Dodecahedron */}
      <mesh>
        <dodecahedronGeometry args={[0.5, 0]} />
        <meshBasicMaterial color="#60a5fa" wireframe transparent opacity={0.35} />
      </mesh>

      {/* Primary Data Orbital Ring */}
      <group ref={ring1Ref}>
        <mesh rotation={[Math.PI / 2.5, 0, 0]}>
          <ringGeometry args={[1.3, 1.33, 64]} />
          <meshBasicMaterial color="#38bdf8" side={THREE.DoubleSide} transparent opacity={0.5} />
        </mesh>
      </group>

      {/* Secondary Counter-Rotating Orbital Ring */}
      <group ref={ring2Ref}>
        <mesh rotation={[-Math.PI / 3, 0.4, 0]}>
          <ringGeometry args={[1.65, 1.68, 64]} />
          <meshBasicMaterial color="#818cf8" side={THREE.DoubleSide} transparent opacity={0.35} />
        </mesh>
      </group>
    </group>
  );
};
