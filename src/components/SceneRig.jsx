import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const SceneRig = ({ children }) => {
  const groupRef = useRef();
  const scrollRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        scrollRef.current = window.scrollY / totalScroll;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useFrame((state, delta) => {
    // 1. Mouse Parallax (clamped smooth lerp)
    const targetCamX = state.pointer.x * 1.2;
    const targetCamY = state.pointer.y * 0.8;

    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetCamX, delta * 2.5);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetCamY, delta * 2.5);

    // 2. Scroll-Driven 3D Transition
    if (groupRef.current) {
      const scrollProgress = scrollRef.current;
      // Scene rotates smoothly on scroll
      const targetRotationY = scrollProgress * Math.PI * 1.5;
      const targetRotationX = Math.sin(scrollProgress * Math.PI) * 0.25;
      const targetScale = 1 - scrollProgress * 0.15;

      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotationY, delta * 3);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotationX, delta * 3);
      groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, delta * 3));
    }

    state.camera.lookAt(0, 0, 0);
  });

  return <group ref={groupRef}>{children}</group>;
};
