import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  hue: number;
  opacity: number;
  type: 'normal' | 'energy' | 'quantum' | 'neural';
  rotation: number;
  rotationSpeed: number;
}

interface NeuralConnection {
  from: Particle;
  to: Particle;
  strength: number;
  pulse: number;
}

export const NeuralBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const connectionsRef = useRef<NeuralConnection[]>([]);
  const animationRef = useRef<number>();
  const timeRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const createParticle = (x?: number, y?: number, type?: Particle['type']): Particle => {
      const particleType = type || (['normal', 'energy', 'quantum', 'neural'][Math.floor(Math.random() * 4)] as Particle['type']);
      
      return {
        x: x ?? Math.random() * canvas.width,
        y: y ?? Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * (particleType === 'energy' ? 2.5 : 1.5),
        vy: (Math.random() - 0.5) * (particleType === 'energy' ? 2.5 : 1.5),
        life: Math.random() * 400 + 200,
        maxLife: Math.random() * 400 + 200,
        size: particleType === 'energy' ? Math.random() * 0.5 + 0.2 : Math.random() * 0.3 + 0.1,
        hue: particleType === 'neural' ? 217 + Math.random() * 40 : Math.random() * 360,
        opacity: Math.random() * 0.9 + 0.3,
        type: particleType,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02
      };
    };

    const initParticles = () => {
      particlesRef.current = [];
      for (let i = 0; i < 120; i++) {
        particlesRef.current.push(createParticle());
      }
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);

    const animate = (timestamp: number) => {
      timeRef.current = timestamp;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Mouse attraction effect
      const mouseInfluence = 150;
      
      // Update and draw particles
      particlesRef.current.forEach((particle, index) => {
        // Mouse interaction
        const dx = mouseRef.current.x - particle.x;
        const dy = mouseRef.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouseInfluence) {
          const force = (mouseInfluence - distance) / mouseInfluence;
          particle.vx += (dx / distance) * force * 0.02;
          particle.vy += (dy / distance) * force * 0.02;
        }
        
        // Update position with different behaviors per type
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.rotation += particle.rotationSpeed;
        particle.life -= 0.6;
        
        // Type-specific behaviors
        switch (particle.type) {
          case 'energy':
            particle.x += Math.sin(timestamp * 0.002 + index * 0.1) * 0.8;
            particle.y += Math.cos(timestamp * 0.0015 + index * 0.1) * 0.6;
            particle.hue = (particle.hue + 2) % 360;
            break;
          case 'quantum':
            particle.x += Math.sin(timestamp * 0.003 + index * 0.2) * 0.4;
            particle.y += Math.cos(timestamp * 0.0025 + index * 0.2) * 0.3;
            particle.size = Math.abs(Math.sin(timestamp * 0.005 + index)) * 3 + 1;
            break;
          case 'neural':
            particle.x += Math.sin(timestamp * 0.001 + index * 0.05) * 0.2;
            particle.y += Math.cos(timestamp * 0.0008 + index * 0.05) * 0.1;
            break;
          default:
            particle.x += Math.sin(timestamp * 0.001 + index * 0.1) * 0.3;
            particle.y += Math.cos(timestamp * 0.0008 + index * 0.1) * 0.2;
        }
        
        // Boundary wrapping with fade
        if (particle.x < -100) particle.x = canvas.width + 100;
        if (particle.x > canvas.width + 100) particle.x = -100;
        if (particle.y < -100) particle.y = canvas.height + 100;
        if (particle.y > canvas.height + 100) particle.y = -100;
        
        // Respawn particle if it dies
        if (particle.life <= 0) {
          particlesRef.current[index] = createParticle();
        }

        // Calculate alpha based on life and type
        const lifeRatio = particle.life / particle.maxLife;
        let alpha = lifeRatio * particle.opacity * 0.8;
        
        if (particle.type === 'energy') alpha *= 1.2;
        if (particle.type === 'quantum') alpha *= Math.abs(Math.sin(timestamp * 0.01 + index));
        
        // Enhanced particle rendering based on type
        ctx.save();
        
        switch (particle.type) {
          case 'energy':
            // Multi-layered glow
            for (let i = 0; i < 3; i++) {
              const glowSize = particle.size * (4 - i);
              ctx.beginPath();
              ctx.arc(particle.x, particle.y, glowSize, 0, Math.PI * 2);
              ctx.fillStyle = `hsla(${particle.hue}, 80%, 70%, ${alpha * (0.3 - i * 0.1)})`;
              ctx.fill();
            }
            break;
            
          case 'quantum':
            // Morphing shape
            ctx.translate(particle.x, particle.y);
            ctx.rotate(particle.rotation);
            ctx.beginPath();
            const vertices = 6;
            for (let i = 0; i < vertices; i++) {
              const angle = (i / vertices) * Math.PI * 2;
              const radius = particle.size * (1 + Math.sin(timestamp * 0.01 + i) * 0.3);
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              if (i === 0) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.fillStyle = `hsla(${particle.hue}, 90%, 75%, ${alpha})`;
            ctx.fill();
            ctx.strokeStyle = `hsla(${particle.hue}, 100%, 85%, ${alpha * 0.5})`;
            ctx.lineWidth = 1;
            ctx.stroke();
            break;
            
          case 'neural':
            // Pulsing neural node
            const pulseSize = particle.size * (1 + Math.sin(timestamp * 0.005 + index * 0.1) * 0.4);
            // Outer glow
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, pulseSize * 3, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${particle.hue}, 70%, 60%, ${alpha * 0.1})`;
            ctx.fill();
            // Core
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, pulseSize, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${particle.hue}, 85%, 75%, ${alpha})`;
            ctx.fill();
            // Inner ring
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, pulseSize * 0.5, 0, Math.PI * 2);
            ctx.strokeStyle = `hsla(${particle.hue + 30}, 90%, 80%, ${alpha * 0.8})`;
            ctx.lineWidth = 1;
            ctx.stroke();
            break;
            
          default:
            // Standard particle with enhanced glow
            const glowSize = particle.size * 2.5;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, glowSize, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${particle.hue}, 70%, 60%, ${alpha * 0.15})`;
            ctx.fill();
            
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${particle.hue}, 80%, 70%, ${alpha})`;
            ctx.fill();
        }
        
        ctx.restore();
        
        // Sparkle effect for energy particles
        if (particle.type === 'energy' && Math.random() > 0.95) {
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${particle.hue}, 100%, 90%, ${alpha * 0.6})`;
          ctx.fill();
        }
      });

      // Enhanced neural connections
      connectionsRef.current = [];
      particlesRef.current.forEach((particle, i) => {
        const nearbyParticles = particlesRef.current.slice(i + 1, i + 12);
        
        nearbyParticles.forEach(otherParticle => {
          const distance = Math.sqrt(
            Math.pow(particle.x - otherParticle.x, 2) + 
            Math.pow(particle.y - otherParticle.y, 2)
          );

          if (distance < 150) {
            const connectionAlpha = (1 - distance / 150) * 0.25;
            const avgHue = (particle.hue + otherParticle.hue) / 2;
            
            // Animated connection pulse
            const pulsePhase = Math.sin(timestamp * 0.003 + i * 0.1) * 0.5 + 0.5;
            const finalAlpha = connectionAlpha * (0.5 + pulsePhase * 0.5);
            
            // Enhanced connection rendering
            if (particle.type === 'neural' || otherParticle.type === 'neural') {
              // Neural connections are more prominent
              ctx.beginPath();
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(otherParticle.x, otherParticle.y);
              ctx.strokeStyle = `hsla(${avgHue}, 80%, 70%, ${finalAlpha * 1.5})`;
              ctx.lineWidth = 2;
              ctx.stroke();
              
              // Add flowing energy dots
              const midX = (particle.x + otherParticle.x) / 2;
              const midY = (particle.y + otherParticle.y) / 2;
              ctx.beginPath();
              ctx.arc(midX, midY, 1, 0, Math.PI * 2);
              ctx.fillStyle = `hsla(${avgHue + 60}, 90%, 80%, ${finalAlpha})`;
              ctx.fill();
            } else {
              // Standard connections
              ctx.beginPath();
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(otherParticle.x, otherParticle.y);
              ctx.strokeStyle = `hsla(${avgHue}, 60%, 50%, ${finalAlpha})`;
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          }
        });
      });

      // Floating quantum fields
      const fieldCount = 3;
      for (let i = 0; i < fieldCount; i++) {
        const fieldX = canvas.width * (0.2 + i * 0.3) + Math.sin(timestamp * 0.0005 + i * 2) * (canvas.width * 0.1);
        const fieldY = canvas.height * 0.5 + Math.cos(timestamp * 0.0004 + i * 1.5) * (canvas.height * 0.15);
        const fieldHue = (timestamp * 0.02 + i * 120) % 360;
        const fieldSize = 60 + Math.sin(timestamp * 0.002 + i) * 20;
        
        // Quantum field rendering
        ctx.save();
        ctx.translate(fieldX, fieldY);
        ctx.rotate(timestamp * 0.001 + i);
        
        // Multiple concentric rings
        for (let ring = 0; ring < 5; ring++) {
          ctx.beginPath();
          ctx.arc(0, 0, fieldSize + ring * 15, 0, Math.PI * 2);
          ctx.strokeStyle = `hsla(${fieldHue + ring * 20}, 70%, 60%, ${0.05 - ring * 0.01})`;
          ctx.lineWidth = 2 - ring * 0.3;
          ctx.stroke();
        }
        
        ctx.restore();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    initParticles();
    animate(0);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0"
        style={{ background: 'transparent' }}
      />
      
      {/* Subtle background enhancement */}
      <div className="fixed inset-0 pointer-events-none z-5 overflow-hidden opacity-30">
        {/* Minimal floating elements */}
        <div className="morphing-bg absolute top-10 right-10 w-32 h-32" />
        <div className="morphing-bg absolute bottom-10 left-10 w-24 h-24" style={{ animationDelay: '4s' }} />
      </div>
    </>
  );
};