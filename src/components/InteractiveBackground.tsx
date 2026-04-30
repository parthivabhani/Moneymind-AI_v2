import { useEffect, useState, useRef } from 'react';

export function InteractiveBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMounted, setIsMounted] = useState(false);
  const animationFrameRef = useRef<number>();

  // Smooth mouse tracking state
  const targetMouse = useRef({ x: 0, y: 0 });
  const currentMouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setIsMounted(true);
    
    // Start at center
    const startX = window.innerWidth / 2;
    const startY = window.innerHeight / 2;
    targetMouse.current = { x: startX, y: startY };
    currentMouse.current = { x: startX, y: startY };

    const handleMouseMove = (e: MouseEvent) => {
      targetMouse.current = { x: e.clientX, y: e.clientY };
    };

    const animate = () => {
      // Smooth interpolation for mouse position
      currentMouse.current.x += (targetMouse.current.x - currentMouse.current.x) * 0.05;
      currentMouse.current.y += (targetMouse.current.y - currentMouse.current.y) * 0.05;
      
      setMousePosition({ 
        x: currentMouse.current.x, 
        y: currentMouse.current.y 
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  if (!isMounted) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden bg-background">
      
      {/* 
        GLASSMORPHISM ORBS 
        We use large div elements with CSS blur and opacity.
      */}

      {/* Orb 1: Primary color, follows mouse slightly but inverted */}
      <div 
        className="absolute rounded-full opacity-30 mix-blend-multiply dark:mix-blend-screen animate-blob"
        style={{
          width: '60vw',
          height: '60vw',
          maxWidth: '800px',
          maxHeight: '800px',
          background: 'hsl(var(--primary))',
          filter: 'blur(100px)',
          left: `calc(50% - 400px + ${(mousePosition.x - window.innerWidth / 2) * -0.1}px)`,
          top: `calc(30% - 400px + ${(mousePosition.y - window.innerHeight / 2) * -0.1}px)`,
          transition: 'left 0.2s ease-out, top 0.2s ease-out',
          animationDelay: '0s'
        }}
      />

      {/* Orb 2: Accent color, follows mouse directly */}
      <div 
        className="absolute rounded-full opacity-20 mix-blend-multiply dark:mix-blend-screen animate-blob"
        style={{
          width: '50vw',
          height: '50vw',
          maxWidth: '600px',
          maxHeight: '600px',
          background: 'hsl(var(--accent-foreground))',
          filter: 'blur(100px)',
          left: `calc(20% - 300px + ${(mousePosition.x - window.innerWidth / 2) * 0.15}px)`,
          top: `calc(60% - 300px + ${(mousePosition.y - window.innerHeight / 2) * 0.15}px)`,
          transition: 'left 0.2s ease-out, top 0.2s ease-out',
          animationDelay: '2s'
        }}
      />

      {/* Orb 3: Another variation of primary/accent, moves independently */}
      <div 
        className="absolute rounded-full opacity-20 mix-blend-multiply dark:mix-blend-screen animate-blob"
        style={{
          width: '40vw',
          height: '40vw',
          maxWidth: '500px',
          maxHeight: '500px',
          background: 'hsl(var(--primary))',
          filter: 'blur(120px)',
          left: `calc(70% - 250px + ${(mousePosition.x - window.innerWidth / 2) * -0.05}px)`,
          top: `calc(50% - 250px + ${(mousePosition.y - window.innerHeight / 2) * -0.05}px)`,
          transition: 'left 0.2s ease-out, top 0.2s ease-out',
          animationDelay: '4s'
        }}
      />

      {/* Glass overlay to frost everything slightly and add grain */}
      <div className="absolute inset-0 bg-background/40 backdrop-blur-[50px]"></div>

      {/* Premium subtle noise texture on top */}
      <div 
        className="absolute inset-0 opacity-[0.025] mix-blend-overlay"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22 opacity=%221%22/%3E%3C/svg%3E")'
        }}
      />

      <style>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 15s infinite alternate;
        }
      `}</style>
    </div>
  );
}
