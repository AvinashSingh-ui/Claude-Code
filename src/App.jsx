import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Text, PerspectiveCamera, Environment, MeshWobbleMaterial, MeshDistortMaterial } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as Lucide from 'lucide-react';
import * as THREE from 'three';
import './index.css';
import profileImg from './assets/profile.jpg';
import { CyberGrid } from './components/CyberGrid';
import { HoloCore } from './components/HoloCore';
import { CyberParticles } from './components/CyberParticles';
import { SceneRig } from './components/SceneRig';

const GithubIcon = ({ size = 20, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ size = 20, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const InstagramIcon = ({ size = 20, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const MenuIcon = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="4" y1="12" x2="20" y2="12" />
    <line x1="4" y1="6" x2="20" y2="6" />
    <line x1="4" y1="18" x2="20" y2="18" />
  </svg>
);

const CloseIcon = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const Github = Lucide.Github || GithubIcon;
const Linkedin = Lucide.Linkedin || LinkedinIcon;
const Instagram = Lucide.Instagram || InstagramIcon;

const FALLBACK_PROJECTS = [
  {
    id: 'productmix',
    name: 'ProductMix',
    description: 'High-performance interactive web application and product showcase platform.',
    html_url: 'https://github.com/AvinashSingh-ui/ProductMix',
    homepage: 'https://github.com/AvinashSingh-ui/ProductMix',
  },
  {
    id: 'portfolio-3d',
    name: 'portfolio-3d',
    description: 'Immersive 3D software engineer portfolio built with React Three Fiber, Vite, and custom GLSL shaders.',
    html_url: 'https://github.com/AvinashSingh-ui/portfolio-3d',
    homepage: null,
  },
  {
    id: 'design-system-core',
    name: 'Design-System-Core',
    description: 'Reusable UI component library featuring accessible design tokens and fluid animations.',
    html_url: 'https://github.com/AvinashSingh-ui',
    homepage: null,
  },
  {
    id: 'docker-nginx-devops',
    name: 'DevOps-Microservices',
    description: 'Production-ready containerized microservices and automated reverse-proxy deployment setup.',
    html_url: 'https://github.com/AvinashSingh-ui',
    homepage: null,
  },
];

const SkillBall = ({ position, name, color }) => {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef();

  useFrame((_, delta) => {
    if (meshRef.current) {
      const targetScale = hovered ? 1.3 : 1.0;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 8);
    }
  });

  return (
    <Float speed={2.5} rotationIntensity={0.6} floatIntensity={0.6}>
      <group position={position}>
        <mesh
          ref={meshRef}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(true);
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            setHovered(false);
            document.body.style.cursor = 'auto';
          }}
        >
          <sphereGeometry args={[0.22, 32, 32]} />
          <MeshWobbleMaterial
            color={color}
            factor={hovered ? 0.6 : 0.25}
            speed={hovered ? 4 : 2}
            roughness={0}
            metalness={0.9}
          />
        </mesh>
        <Text
          position={[0, -0.4, 0]}
          fontSize={0.12}
          color={hovered ? '#ffffff' : '#94a3b8'}
          anchorX="center"
        >
          {name}
        </Text>
      </group>
    </Float>
  );
};

const ProjectNode = ({ position, name, onClick }) => {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef();

  useFrame((_, delta) => {
    if (meshRef.current) {
      const targetScale = hovered ? 1.25 : 1.0;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 8);
      meshRef.current.rotation.y += delta * (hovered ? 2.5 : 0.8);
      meshRef.current.rotation.x += delta * (hovered ? 1.5 : 0.4);
    }
  });

  return (
    <Float speed={1.8} rotationIntensity={0.3} floatIntensity={0.3}>
      <group position={position}>
        <mesh
          ref={meshRef}
          onClick={onClick}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(true);
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            setHovered(false);
            document.body.style.cursor = 'auto';
          }}
        >
          <boxGeometry args={[0.65, 0.65, 0.65]} />
          <MeshDistortMaterial
            color={hovered ? '#38bdf8' : '#0f172a'}
            speed={hovered ? 4 : 2}
            distort={hovered ? 0.35 : 0.18}
            metalness={0.95}
            roughness={0.05}
          />
        </mesh>
        <Text
          position={[0, -0.55, 0]}
          fontSize={0.14}
          color={hovered ? '#38bdf8' : '#ffffff'}
          anchorX="center"
          maxWidth={1.5}
          textAlign="center"
        >
          {name}
        </Text>
      </group>
    </Float>
  );
};


const App = () => {
  const [projects, setProjects] = useState(FALLBACK_PROJECTS);
  const [selectedProject, setSelectedProject] = useState(null);
  const [formStatus, setFormStatus] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const skills = useMemo(() => [
    { name: 'React', color: '#61DAFB' }, { name: 'Next.js', color: '#fff' },
    { name: 'TypeScript', color: '#3178C6' }, { name: 'Redux', color: '#764ABC' },
    { name: 'RTK Query', color: '#C026D3' }, { name: 'Playwright', color: '#2E96FF' },
    { name: 'Jest', color: '#C2132B' }, { name: 'Tailwind', color: '#38B2AC' },
    { name: 'Ant Design', color: '#001529' }, { name: 'Material UI', color: '#007FFF' },
    { name: 'Claude Code', color: '#D97706' }, { name: 'GitHub Copilot', color: '#fff' },
  ], []);

  useEffect(() => {
    let isMounted = true;
    fetch('https://api.github.com/users/AvinashSingh-ui/repos?sort=updated&per_page=6')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setProjects(data.slice(0, 6));
        }
      })
      .catch(err => console.warn('Using fallback repository data:', err.message));

    return () => { isMounted = false; };
  }, []);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('sending');

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('https://formspree.io/f/mjyyyyzq', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        setFormStatus('success');
        e.target.reset();
      } else {
        throw new Error('Failed to send');
      }
    } catch (err) {
      setFormStatus('error');
    }
  };

  return (
    <div className="min-h-screen w-full text-white bg-[#050505] selection:bg-blue-500/30 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full px-4 sm:px-8 py-4 sm:py-5 z-[100] flex justify-between items-center nav-blur border-b border-white/5">
        <a href="#home" className="text-lg sm:text-xl font-black tracking-tighter">
          PORTFOLIO<span className="text-blue-500">.</span>
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 items-center text-sm font-medium text-gray-400">
          <a href="#projects" className="hover:text-white transition-colors">Work</a>
          <a href="#skills" className="hover:text-white transition-colors">Stack</a>
          <a href="#contact" className="hover:text-white transition-colors">Contact</a>
          <div className="flex items-center gap-2 pl-4 border-l border-white/10">
            <a href="https://github.com/AvinashSingh-ui" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="p-2 bg-white text-black rounded-full hover:bg-gray-200 transition-all">
              <Github size={15} />
            </a>
            <a href="https://linkedin.com/in/avinash-singh-092462270/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="p-2 bg-white/10 text-white rounded-full hover:bg-white hover:text-black transition-all">
              <Linkedin size={15} />
            </a>
            <a href="https://www.instagram.com/ig_abhi.chouhan/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="p-2 bg-white/10 text-white rounded-full hover:bg-white hover:text-black transition-all">
              <Instagram size={15} />
            </a>
          </div>
        </div>

        {/* Mobile Header Actions */}
        <div className="flex items-center gap-2 md:hidden">
          <a href="https://github.com/AvinashSingh-ui" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="p-2 bg-white text-black rounded-full hover:bg-gray-200 transition-all">
            <Github size={14} />
          </a>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            className="p-2 text-gray-300 hover:text-white bg-white/5 border border-white/10 rounded-xl transition-colors"
          >
            {mobileMenuOpen ? <CloseIcon size={20} /> : <MenuIcon size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-[65px] bg-black/95 backdrop-blur-2xl border-b border-white/10 z-[99] p-6 flex flex-col gap-6 md:hidden"
          >
            <div className="flex flex-col gap-3 text-lg font-medium text-gray-300">
              <a
                href="#projects"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 hover:text-white border-b border-white/5 transition-colors"
              >
                Work
              </a>
              <a
                href="#skills"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 hover:text-white border-b border-white/5 transition-colors"
              >
                Stack
              </a>
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 hover:text-white border-b border-white/5 transition-colors"
              >
                Contact
              </a>
            </div>
            <div className="flex items-center gap-2.5 pt-2 flex-wrap">
              <a href="https://github.com/AvinashSingh-ui" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3.5 py-2 bg-white text-black rounded-full text-xs font-bold">
                <Github size={14} /> GitHub
              </a>
              <a href="https://linkedin.com/in/avinash-singh-092462270/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3.5 py-2 bg-white/10 text-white rounded-full text-xs font-bold">
                <Linkedin size={14} /> LinkedIn
              </a>
              <a href="https://www.instagram.com/ig_abhi.chouhan/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3.5 py-2 bg-white/10 text-white rounded-full text-xs font-bold">
                <Instagram size={14} /> Instagram
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3D Background with custom shaders, parallax rig, and cyber particle system */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-60">
        <Canvas
          shadows
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          className="pointer-events-auto"
        >
          <PerspectiveCamera makeDefault position={[0, 1.2, 7.5]} fov={50} />
          <Environment preset="city" />
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 12, 8]} intensity={1.2} />
          <pointLight position={[0, 0, 0]} intensity={2.5} color="#38bdf8" distance={6} />

          {/* Interactive Mouse Parallax & Scroll-Driven Scene Controller */}
          <SceneRig>
            {/* Custom GLSL Cyber Grid Horizon Floor */}
            <CyberGrid position={[0, -2.8, 0]} />

            {/* Central Holographic Neural Core with Fresnel & Scanlines */}
            <HoloCore position={[0, 0, 0]} />

            {/* Optimized Digital Particle Field */}
            <CyberParticles count={320} />

            {/* Outer Orbit: Skill Nodes */}
            <group position={[0, 0, 0]}>
              {skills.map((skill, i) => {
                const angle = (i / skills.length) * Math.PI * 2;
                return (
                  <SkillBall
                    key={skill.name}
                    position={[Math.cos(angle) * 4.2, Math.sin(angle * 2) * 0.4, Math.sin(angle) * 4.2]}
                    name={skill.name}
                    color={skill.color}
                  />
                );
              })}
            </group>

            {/* Inner Orbit: Interactive Project Nodes */}
            <group position={[0, 0, 0]}>
              {projects.map((proj, i) => {
                const angle = (i / Math.max(projects.length, 1)) * Math.PI * 2;
                return (
                  <ProjectNode
                    key={proj.id || proj.name}
                    position={[Math.cos(angle) * 2.3, Math.sin(angle * 3) * 0.3, Math.sin(angle) * 2.3]}
                    name={proj.name}
                    onClick={() => setSelectedProject(proj)}
                  />
                );
              })}
            </group>
          </SceneRig>
        </Canvas>
      </div>

      <main className="relative z-10">
        {/* HERO */}
        <section id="home" className="min-h-screen pt-28 pb-16 md:py-0 flex items-center px-4 sm:px-8 md:px-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center max-w-7xl mx-auto w-full">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="order-2 md:order-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 text-blue-500 font-mono text-xs mb-4 sm:mb-6 uppercase tracking-widest bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                {Lucide.Sparkles && <Lucide.Sparkles size={14} />}
                <span>Frontend Engineer & AI Specialist</span>
              </div>
              <h2 className="text-4xl sm:text-6xl md:text-8xl font-bold tracking-tighter leading-none mb-6 sm:mb-8 text-gradient">
                Avinash <br /> Singh.
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-400 leading-relaxed mb-8 sm:mb-12 max-w-xl mx-auto md:mx-0">
                I architect high-performance, visually stunning digital interfaces.
                Specializing in React, Next.js, and modern AI-driven development workflows.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start w-full sm:w-auto">
                <a href="#projects" className="px-8 py-4 bg-white text-black rounded-full font-bold hover:bg-gray-200 transition-all text-center">
                  Explore Work
                </a>
                <a href="#skills" className="px-8 py-4 bg-transparent text-white rounded-full font-bold border border-white/10 hover:bg-white/5 transition-all text-center">
                  Technical Stack
                </a>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }} className="order-1 md:order-2 flex justify-center relative">
              <div className="relative w-44 h-44 sm:w-56 sm:h-56 md:w-72 md:h-72 rounded-full p-1 bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-[0_0_50px_rgba(59,130,246,0.3)]">
                <div className="w-full h-full rounded-full overflow-hidden border-4 border-[#050505]">
                  <img src={profileImg} alt="Avinash Singh" loading="lazy" decoding="async" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* PROJECTS */}
        <section id="projects" className="py-20 md:py-32 px-4 sm:px-8 md:px-24">
          <div className="max-w-6xl mx-auto">
            <div className="mb-12 md:mb-20">
              <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tighter mb-4">Selected Work</h2>
              <div className="h-1 w-12 bg-blue-500 rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {projects.map((proj) => (
                <motion.div key={proj.id || proj.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} onClick={() => setSelectedProject(proj)} className="p-6 sm:p-8 glass-card rounded-2xl sm:rounded-3xl cursor-pointer group">
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-white/5 rounded-xl group-hover:text-blue-500 transition-colors">{Lucide.Code2 && <Lucide.Code2 size={24} />}</div>
                    <div className="text-gray-600 group-hover:text-white transition-colors">{Lucide.ArrowUpRight && <Lucide.ArrowUpRight size={20} />}</div>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-3 group-hover:text-blue-400 transition-colors">{proj.name}</h3>
                  <p className="text-gray-400 line-clamp-2 text-sm leading-relaxed">{proj.description || 'Engineering a scalable solution for modern web needs.'}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* SKILLS */}
        <section id="skills" className="py-20 md:py-32 px-4 sm:px-8 md:px-24 border-t border-white/5">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tighter mb-10 md:mb-16">Technical Stack</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {skills.map((skill) => (
                <motion.div key={skill.name} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="p-4 sm:p-6 glass-card rounded-xl sm:rounded-2xl flex items-center gap-3 sm:gap-4 group">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: skill.color }}></div>
                  <span className="text-xs sm:text-sm font-medium text-gray-300 group-hover:text-white transition-colors truncate">{skill.name}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="py-20 md:py-32 px-4 sm:px-8 md:px-24 bg-white/[0.02]">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tighter mb-6 md:mb-8">Let's Connect.</h2>
              <p className="text-gray-400 text-base sm:text-lg mb-8 sm:mb-12 leading-relaxed">
                I'm always open to discussing new projects, creative ideas or opportunities to be part of your visions.
              </p>
              <div className="space-y-4 sm:space-y-6">
                <a href="mailto:as6005215206@gmail.com" className="flex items-center gap-3 sm:gap-4 text-base sm:text-lg md:text-xl group">
                  <div className="p-2.5 sm:p-3 bg-white/5 rounded-full group-hover:bg-blue-500/20 transition-colors flex-shrink-0">
                    {Lucide.Mail && <Lucide.Mail size={20} className="group-hover:text-blue-400 sm:w-6 sm:h-6" />}
                  </div>
                  <span className="text-gray-300 group-hover:text-white transition-colors break-all">as6005215206@gmail.com</span>
                </a>
                <a href="https://linkedin.com/in/avinash-singh-092462270/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 sm:gap-4 text-base sm:text-lg md:text-xl group">
                  <div className="p-2.5 sm:p-3 bg-white/5 rounded-full group-hover:bg-blue-500/20 transition-colors flex-shrink-0">
                    <Linkedin size={20} className="text-gray-300 group-hover:text-blue-400 transition-colors sm:w-6 sm:h-6" />
                  </div>
                  <span className="text-gray-300 group-hover:text-white transition-colors">LinkedIn Profile</span>
                </a>
                <a href="https://www.instagram.com/ig_abhi.chouhan/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 sm:gap-4 text-base sm:text-lg md:text-xl group">
                  <div className="p-2.5 sm:p-3 bg-white/5 rounded-full group-hover:bg-blue-500/20 transition-colors flex-shrink-0">
                    <Instagram size={20} className="text-gray-300 group-hover:text-blue-400 transition-colors sm:w-6 sm:h-6" />
                  </div>
                  <span className="text-gray-300 group-hover:text-white transition-colors">Instagram</span>
                </a>
              </div>
            </div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} className="glass-card p-6 sm:p-8 md:p-12 rounded-2xl sm:rounded-3xl">
              <form onSubmit={handleContactSubmit} className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Name</label>
                    <input required name="name" type="text" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-colors text-sm sm:text-base" placeholder="John Doe" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Email</label>
                    <input required name="email" type="email" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-colors text-sm sm:text-base" placeholder="john@example.com" />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Message</label>
                  <textarea required name="message" rows="4" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-colors text-sm sm:text-base" placeholder="How can I help you?"></textarea>
                </div>
                <button disabled={formStatus === 'sending'} className="w-full py-4 bg-white text-black rounded-full font-bold hover:bg-gray-200 transition-all flex items-center justify-center gap-2 text-sm sm:text-base">
                  {formStatus === 'sending' ? 'Sending...' : 'Send Message'}
                  {Lucide.Send && <Lucide.Send size={18} />}
                </button>
                {formStatus === 'success' && <p className="text-green-400 text-center text-sm font-medium">Message sent successfully!</p>}
                {formStatus === 'error' && <p className="text-red-400 text-center text-sm font-medium">Something went wrong. Please try again.</p>}
              </form>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Project Detail Drawer */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full sm:w-[480px] md:w-[500px] bg-black/95 backdrop-blur-3xl p-6 sm:p-8 md:p-12 z-[200] border-l border-white/10 flex flex-col max-h-screen overflow-y-auto"
          >
            <button onClick={() => setSelectedProject(null)} className="text-gray-400 hover:text-white mb-8 sm:mb-12 w-fit transition-colors text-xs sm:text-sm font-semibold tracking-wider flex items-center gap-2">
              <CloseIcon size={18} /> CLOSE
            </button>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-white/5 text-blue-400 rounded-xl">{Lucide.Code2 && <Lucide.Code2 size={20} />}</div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white break-words">{selectedProject.name}</h2>
            </div>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-8 sm:mb-10">{selectedProject.description || 'A high-performance project focused on modern engineering practices.'}</p>
            <div className="mt-auto flex flex-col gap-3 pt-6">
              {selectedProject.html_url && (
                <a href={selectedProject.html_url} target="_blank" rel="noopener noreferrer" className="w-full py-3.5 sm:py-4 bg-white text-black rounded-full font-bold text-center flex items-center justify-center gap-2 hover:bg-gray-200 transition-all text-sm sm:text-base">
                  <Github size={18} /> View Source
                </a>
              )}
              {selectedProject.homepage && (
                <a href={selectedProject.homepage} target="_blank" rel="noopener noreferrer" className="w-full py-3.5 sm:py-4 bg-transparent text-white rounded-full font-bold border border-white/10 text-center flex items-center justify-center gap-2 hover:bg-white/5 transition-all text-sm sm:text-base">
                  {Lucide.ExternalLink && <Lucide.ExternalLink size={18} />} Live Demo
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
