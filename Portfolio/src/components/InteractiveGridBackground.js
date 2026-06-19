'use client';

import { useEffect, useRef } from 'react';

export default function InteractiveGridBackground() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');

    let w, h;
    let animationId;
    let mouse = { x: -1000, y: -1000 };
    let currentParallax = { x: 0, y: 0 };
    let targetParallax = { x: 0, y: 0 };

    // Sparkle effects pool
    let sparkles = [];

    // Grid config
    const mainGridSize = 160;
    const subGridCount = 4;
    const gridSize = mainGridSize / subGridCount; // 40

    // Camera config
    const perspective = 700;
    const cameraY = 200;
    const cubeHeight = 70; // 3D cuboid rise height (3D units)
    let horizonY = -150;

    let time = 0;
    const speed = 0.4; // restored to original speed

    function resize() {
      const rect = container.getBoundingClientRect();
      w = canvas.width = rect.width;
      h = canvas.height = rect.height;
    }

    // 3D to 2D projection
    function project(x, y, z) {
      if (z < 1) z = 1;
      const scale = perspective / z;
      const vanishX = w / 2 + currentParallax.x;
      const vanishY = h / 2 + horizonY + currentParallax.y * 0.5;
      const camX = -currentParallax.x * 0.3;
      return {
        x: vanishX + (x - camX) * scale,
        y: vanishY + y * scale,
      };
    }

    // Draw a 4-point star sparkle
    function drawSparkle(cx, cy, outerR, innerR, alpha) {
      const arms = 4;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = 'rgba(201,109,73,1)';
      ctx.fillStyle = 'rgba(201,109,73,0.15)';
      ctx.lineWidth = 1.5;

      // Main star
      ctx.beginPath();
      for (let i = 0; i < arms * 2; i++) {
        const r = i % 2 === 0 ? outerR : innerR;
        const angle = (i * Math.PI) / arms - Math.PI / 2;
        if (i === 0) ctx.moveTo(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r);
        else ctx.lineTo(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Small dots at each tip
      const dotR = outerR * 0.12;
      for (let i = 0; i < arms; i++) {
        const angle = (i * 2 * Math.PI) / arms - Math.PI / 2;
        const dotX = cx + Math.cos(angle) * (outerR * 1.45);
        const dotY = cy + Math.sin(angle) * (outerR * 1.45);
        ctx.beginPath();
        ctx.arc(dotX, dotY, dotR, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(201,109,73,1)';
        ctx.fill();
      }

      ctx.restore();
    }

    function animate() {
      ctx.clearRect(0, 0, w, h);
      time += speed;

      const wrapZ = time % mainGridSize;

      // Parallax smoothing
      currentParallax.x += (targetParallax.x - currentParallax.x) * 0.05;
      currentParallax.y += (targetParallax.y - currentParallax.y) * 0.05;

      const camOffsetY = currentParallax.y;

      const linesX = Math.floor(Math.ceil(w / gridSize) * 2.5);
      const linesZ = 80;

      const gridWidth = linesX * gridSize;
      const startX = -gridWidth / 2;

      let hoveredQuad = null;

      // 1. Calculate projected points
      const projectedGrid = [];
      for (let j = 0; j <= linesZ; j++) {
        const z = (j * gridSize) - wrapZ + 5;
        const row = [];
        for (let i = 0; i <= linesX; i++) {
          const x = startX + i * gridSize;
          const p = project(x, cameraY + camOffsetY, z);
          row.push({ x: p.x, y: p.y, origX: x, origZ: z, i, j });
        }
        projectedGrid.push(row);
      }

      // 2. Check mouse hover on sub-grids
      for (let j = 0; j < projectedGrid.length - 1; j++) {
        for (let i = 0; i < projectedGrid[j].length - 1; i++) {
          const p1 = projectedGrid[j][i];
          const p2 = projectedGrid[j][i + 1];
          const p3 = projectedGrid[j + 1][i + 1];
          const p4 = projectedGrid[j + 1][i];

          const minX = Math.min(p1.x, p2.x, p3.x, p4.x);
          const maxX = Math.max(p1.x, p2.x, p3.x, p4.x);
          const minY = Math.min(p1.y, p2.y, p3.y, p4.y);
          const maxY = Math.max(p1.y, p2.y, p3.y, p4.y);

          if (mouse.x >= minX && mouse.x <= maxX && mouse.y >= minY && mouse.y <= maxY) {
            const isInside =
              crossProduct(p1, p2, mouse) >= 0 &&
              crossProduct(p2, p3, mouse) >= 0 &&
              crossProduct(p3, p4, mouse) >= 0 &&
              crossProduct(p4, p1, mouse) >= 0;

            if (isInside) {
              hoveredQuad = [p1, p2, p3, p4];
            }
          }
        }
      }

      // 3. Draw Lines
      function drawLines(isMainGrid) {
        ctx.beginPath();

        const centerIndex = Math.floor(linesX / 2);
        for (let i = 0; i <= linesX; i++) {
          const isMainLine = Math.abs(i - centerIndex) % subGridCount === 0;
          if (isMainGrid === isMainLine) {
            const pStart = projectedGrid[0][i];
            const pEnd = projectedGrid[linesZ][i];
            ctx.moveTo(pStart.x, pStart.y);
            ctx.lineTo(pEnd.x, pEnd.y);
          }
        }

        for (let j = 0; j <= linesZ; j++) {
          const isMainLine = j % subGridCount === 0;
          if (isMainGrid === isMainLine) {
            const pStart = projectedGrid[j][0];
            const pEnd = projectedGrid[j][linesX];
            ctx.moveTo(pStart.x, pStart.y);
            ctx.lineTo(pEnd.x, pEnd.y);
          }
        }

        ctx.strokeStyle = isMainGrid ? 'rgba(201,108,72,0.45)' : 'rgba(201,108,72,0.18)';
        ctx.lineWidth = isMainGrid ? 1.5 : 0.8;
        ctx.stroke();
      }

      drawLines(false); // Sub grid
      drawLines(true);  // Main grid

      // 4. (cuboid drawn after gradients — see step 6)

      // 5. Horizon fade gradient — blends into the warm off-white bg
      const vanishY = h / 2 + horizonY;
      const fadeBottom = vanishY + 160;
      const gradient = ctx.createLinearGradient(0, 0, 0, fadeBottom);
      gradient.addColorStop(0, '#F5F1EE');
      gradient.addColorStop(0.82, '#F5F1EE');
      gradient.addColorStop(1, 'rgba(245,241,238,0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, fadeBottom);

      // Left & Right edge fades — only near the horizon (far corners), not full height
      const sidesFadeHeight = vanishY + 160;
      const leftGrad = ctx.createLinearGradient(0, 0, w * 0.22, 0);
      leftGrad.addColorStop(0, '#F5F1EE');
      leftGrad.addColorStop(1, 'rgba(245,241,238,0)');
      ctx.fillStyle = leftGrad;
      ctx.fillRect(0, 0, w * 0.22, sidesFadeHeight);

      const rightGrad = ctx.createLinearGradient(w, 0, w * 0.78, 0);
      rightGrad.addColorStop(0, '#F5F1EE');
      rightGrad.addColorStop(1, 'rgba(245,241,238,0)');
      ctx.fillStyle = rightGrad;
      ctx.fillRect(w * 0.78, 0, w * 0.22, sidesFadeHeight);

      // 6. Draw 3D cuboid AFTER gradients so it's never covered
      if (hoveredQuad) {
        const [p1, p2, p3, p4] = hoveredQuad;

        // Project top face corners (raised by cubeHeight in 3D)
        const tp1 = project(p1.origX, cameraY + camOffsetY - cubeHeight, p1.origZ);
        const tp2 = project(p2.origX, cameraY + camOffsetY - cubeHeight, p2.origZ);
        const tp3 = project(p3.origX, cameraY + camOffsetY - cubeHeight, p3.origZ);
        const tp4 = project(p4.origX, cameraY + camOffsetY - cubeHeight, p4.origZ);

        // Bottom / floor face
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y);
        ctx.lineTo(p3.x, p3.y); ctx.lineTo(p4.x, p4.y);
        ctx.closePath();
        ctx.fillStyle = 'rgba(201,109,73,0.15)';
        ctx.fill();

        // Front face (near edge — p3/p4 side)
        ctx.beginPath();
        ctx.moveTo(p4.x, p4.y); ctx.lineTo(p3.x, p3.y);
        ctx.lineTo(tp3.x, tp3.y); ctx.lineTo(tp4.x, tp4.y);
        ctx.closePath();
        ctx.fillStyle = 'rgba(201,109,73,0.45)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(201,109,73,0.9)'; ctx.lineWidth = 1.2; ctx.stroke();

        // Right side face (p2/p3 side)
        ctx.beginPath();
        ctx.moveTo(p2.x, p2.y); ctx.lineTo(p3.x, p3.y);
        ctx.lineTo(tp3.x, tp3.y); ctx.lineTo(tp2.x, tp2.y);
        ctx.closePath();
        ctx.fillStyle = 'rgba(201,109,73,0.30)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(201,109,73,0.7)'; ctx.lineWidth = 1; ctx.stroke();

        // Top face (brightest)
        ctx.beginPath();
        ctx.moveTo(tp1.x, tp1.y); ctx.lineTo(tp2.x, tp2.y);
        ctx.lineTo(tp3.x, tp3.y); ctx.lineTo(tp4.x, tp4.y);
        ctx.closePath();
        ctx.fillStyle = 'rgba(201,109,73,0.55)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(201,109,73,1)'; ctx.lineWidth = 1.5; ctx.stroke();

        // Crosshair on top face
        const topCx = (tp1.x + tp2.x + tp3.x + tp4.x) / 4;
        const topCy = (tp1.y + tp2.y + tp3.y + tp4.y) / 4;
        const crossLen = 7;
        ctx.strokeStyle = 'rgba(201,109,73,1)'; ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(topCx - crossLen, topCy); ctx.lineTo(topCx + crossLen, topCy);
        ctx.moveTo(topCx, topCy - crossLen); ctx.lineTo(topCx, topCy + crossLen);
        ctx.stroke();
      }

      // 7. Draw active sparkles
      const now = performance.now();
      sparkles = sparkles.filter(s => now - s.startTime < s.duration);
      for (const s of sparkles) {
        const progress = (now - s.startTime) / s.duration;
        const eased = 1 - Math.pow(progress, 2);
        const outerR = s.maxR * (0.3 + 0.7 * Math.sin(progress * Math.PI));
        const innerR = outerR * 0.28;
        drawSparkle(s.x, s.y, outerR, innerR, eased * 0.95);
      }

      animationId = requestAnimationFrame(animate);
    }

    function crossProduct(a, b, p) {
      return (b.x - a.x) * (p.y - a.y) - (b.y - a.y) * (p.x - a.x);
    }

    function handleMouseMove(e) {
      const rect = container.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;

      const maxParallaxX = 150;
      const maxParallaxY = 60;
      const pctX = (e.clientX / window.innerWidth) - 0.5;
      const pctY = (e.clientY / window.innerHeight) - 0.5;

      targetParallax.x = -pctX * maxParallaxX;
      targetParallax.y = -pctY * maxParallaxY;
    }

    function handleMouseLeave() {
      mouse.x = -1000;
      mouse.y = -1000;
      targetParallax.x = 0;
      targetParallax.y = 0;
    }

    function handleClick(e) {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      sparkles.push({
        x,
        y,
        startTime: performance.now(),
        duration: 900,
        maxR: 28,
      });
    }

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('click', handleClick);

    resize();
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      canvas.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'auto',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ display: 'block', width: '100%', height: '100%' }}
      />

      {/* Top / horizon edge fade — covers far-side spawn area */}
      <div style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '45%',
        background: 'linear-gradient(to bottom, #F5F1EE 0%, #F5F1EE 30%, transparent 100%)',
        pointerEvents: 'none',
      }} />
    </div>
  );
}
