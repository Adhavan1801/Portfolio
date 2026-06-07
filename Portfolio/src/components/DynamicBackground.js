'use client';

import { useEffect, useRef } from 'react';

export default function DynamicBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;
    
    // Track mouse position
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    // Current blob position (for smooth interpolation)
    let currentX = window.innerWidth / 2;
    let currentY = window.innerHeight / 2;
    
    const ORANGE = 'rgba(233, 116, 81, 0.15)'; // E97451 with opacity

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function animate() {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Lerp (smoothly move current position towards target)
      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;

      // Draw the glowing orb
      const radius = Math.min(window.innerWidth, window.innerHeight) * 0.4;
      const gradient = ctx.createRadialGradient(
        currentX, currentY, 0,
        currentX, currentY, radius
      );
      
      gradient.addColorStop(0, ORANGE);
      gradient.addColorStop(0.4, 'rgba(233, 116, 81, 0.05)');
      gradient.addColorStop(1, 'rgba(233, 116, 81, 0)');

      ctx.beginPath();
      ctx.arc(currentX, currentY, radius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Add a secondary ambient glow in the corner
      const ambientGradient = ctx.createRadialGradient(
        canvas.width, 0, 0,
        canvas.width, 0, radius * 1.5
      );
      ambientGradient.addColorStop(0, 'rgba(255, 255, 255, 0.03)');
      ambientGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      ctx.beginPath();
      ctx.arc(canvas.width, 0, radius * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = ambientGradient;
      ctx.fill();

      animationId = requestAnimationFrame(animate);
    }

    function handleMouseMove(e) {
      targetX = e.clientX;
      targetY = e.clientY;
    }

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', resize);
    
    resize();
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
      aria-hidden="true"
    />
  );
}
