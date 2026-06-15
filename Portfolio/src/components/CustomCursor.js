'use client';

import { useEffect, useRef } from 'react';

/**
 * Custom cursor — white circle (mix-blend-mode: difference).
 *
 * Behaviour:
 *   - Over black text  → text inside circle appears WHITE
 *   - Over white text  → text inside circle appears BLACK
 *   - Over orange el   → solid BLACK circle (clean, no blue tint)
 *   - Over image       → everything hidden (no effect)
 */

// ── Colour helpers ────────────────────────────────────────────────────────────

function parseRGB(str) {
  if (!str) return null;
  const m = str.match(/rgba?\(\s*(\d+),\s*(\d+),\s*(\d+)/);
  return m ? { r: +m[1], g: +m[2], b: +m[3] } : null;
}

function isOrangeRGB({ r, g, b }) {
  return r > 150 && r < 240 && g > 50 && g < 165 && b > 15 && b < 125 && r > g && g > b;
}

function isTransparent(str) {
  return !str || str === 'transparent' || str === 'rgba(0, 0, 0, 0)';
}

function getEffectiveBg(el) {
  let node = el;
  while (node && node !== document.documentElement) {
    const cs = window.getComputedStyle(node);
    if (!isTransparent(cs.backgroundColor)) return parseRGB(cs.backgroundColor);
    node = node.parentElement;
  }
  return null;
}

function getMode(el) {
  if (!el) return 'normal';
  // Image or iframe detection — walk up
  let node = el;
  while (node && node.tagName) {
    const tag = node.tagName.toLowerCase();
    if (tag === 'iframe' || tag === 'img' || tag === 'video' || tag === 'picture') return 'hidden';
    node = node.parentElement;
  }
  // Orange text
  const cs = window.getComputedStyle(el);
  const textRGB = parseRGB(cs.color);
  if (textRGB && isOrangeRGB(textRGB)) return 'orange';
  // Orange background
  const bgRGB = getEffectiveBg(el);
  if (bgRGB && isOrangeRGB(bgRGB)) return 'orange';
  return 'normal';
}


// ── Component ─────────────────────────────────────────────────────────────────

export default function CustomCursor() {
  const mainRef = useRef(null);

  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;

    let tx = -300, ty = -300;
    let cx = -300, cy = -300;

    let raf;
    let visible = false;
    let curMode = 'normal';
    let isInteractive = false;

    // ── Show / hide all ──────────────────────────────────────────────
    function showAll(v) {
      main.style.opacity = v ? '1' : '0';
    }

    // ── Mode application ─────────────────────────────────────────────
    function applyMode(m) {
      curMode = m;
      const size = isInteractive ? 32 : 22;
      const half = size / 2;

      if (m === 'image' || m === 'hidden') {
        main.style.opacity = '0';
        return;
      }

      main.style.opacity = '1';

      if (m === 'orange') {
        // Solid black circle — visible on orange, no blue tint
        main.style.background   = '#000000';
        main.style.mixBlendMode = 'normal';
      } else {
        // Normal: white + difference = inverts text colours underneath
        main.style.background   = '#ffffff';
        main.style.mixBlendMode = 'difference';
      }

      main.style.width      = size + 'px';
      main.style.height     = size + 'px';
      main.style.marginLeft = -half + 'px';
      main.style.marginTop  = -half + 'px';
    }

    // ── Mouse handlers ───────────────────────────────────────────────
    function onMove(e) {
      tx = e.clientX;
      ty = e.clientY;
      if (!visible) {
        cx = tx; cy = ty;
        visible = true;
        showAll(true);
      }
      const hit = document.elementFromPoint(e.clientX, e.clientY);
      applyMode(getMode(hit));
    }

    function onLeave() {
      showAll(false);
      visible = false;
    }

    function onEnterInteractive() {
      isInteractive = true;
      const size = 32;
      main.style.width      = size + 'px';
      main.style.height     = size + 'px';
      main.style.marginLeft = -(size / 2) + 'px';
      main.style.marginTop  = -(size / 2) + 'px';
    }
    function onLeaveInteractive() {
      isInteractive = false;
      const size = (curMode === 'image' || curMode === 'hidden') ? 0 : 22;
      main.style.width      = size + 'px';
      main.style.height     = size + 'px';
      main.style.marginLeft = -(size / 2) + 'px';
      main.style.marginTop  = -(size / 2) + 'px';
    }

    function loop() {
      cx += (tx - cx) * 0.16;
      cy += (ty - cy) * 0.16;
      main.style.transform = `translate(${cx}px, ${cy}px)`;
      raf = requestAnimationFrame(loop);
    }

    // ── Attach listeners ─────────────────────────────────────────────
    const interactives = document.querySelectorAll(
      'a, button, [role="button"], input, textarea, select, label'
    );
    interactives.forEach(el => {
      el.addEventListener('mouseenter', onEnterInteractive);
      el.addEventListener('mouseleave', onLeaveInteractive);
    });
    window.addEventListener('mousemove', onMove);
    document.documentElement.addEventListener('mouseleave', onLeave);
    loop();

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(raf);
      interactives.forEach(el => {
        el.removeEventListener('mouseenter', onEnterInteractive);
        el.removeEventListener('mouseleave', onLeaveInteractive);
      });
    };
  }, []);

  // Shared base style
  const fixed = {
    position: 'fixed',
    top: 0,
    left: 0,
    borderRadius: '50%',
    pointerEvents: 'none',
    zIndex: 99999,
    opacity: 0,
    willChange: 'transform',
  };

  return (
    <>
      {/* Main cursor circle — inverts text via mix-blend-mode */}
      <div
        ref={mainRef}
        style={{
          ...fixed,
          width: 22,
          height: 22,
          marginLeft: -11,
          marginTop: -11,
          background: '#ffffff',
          mixBlendMode: 'difference',
          transition: 'width 0.2s ease, height 0.2s ease, margin 0.2s ease, background 0.1s ease, opacity 0.2s ease',
        }}
      />

    </>
  );
}
