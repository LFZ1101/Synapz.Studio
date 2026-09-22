"use client";

import { useEffect, useRef } from "react";

type Node = { x: number; y: number; vx: number; vy: number; r: number };

/**
 * Abstract connection network that reacts subtly to cursor.
 * Structured nodes — not a random particle cloud.
 */
export function ConnectionNetwork({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -9999, y: -9999 });
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let nodes: Node[] = [];

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Grid-like constellation
      const cols = w < 640 ? 4 : 6;
      const rows = w < 640 ? 3 : 4;
      nodes = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = ((c + 0.5) / cols) * w + (r % 2 ? 18 : -10);
          const y = ((r + 0.5) / rows) * h;
          nodes.push({
            x,
            y,
            vx: 0,
            vy: 0,
            r: c === cols - 1 && r === Math.floor(rows / 2) ? 3.5 : 2,
          });
        }
      }
      // Extra hub connections
      draw(w, h);
    };

    const draw = (w: number, h: number) => {
      ctx.clearRect(0, 0, w, h);

      // Links
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < Math.min(w, h) * 0.28) {
            const alpha = 1 - dist / (Math.min(w, h) * 0.28);
            ctx.strokeStyle = `rgba(236,237,231,${0.08 + alpha * 0.12})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Nodes + impulse focus
      nodes.forEach((n, i) => {
        const isImpulse = i === nodes.length - 2 || n.r > 3;
        ctx.beginPath();
        ctx.fillStyle = isImpulse ? "#B7FF00" : "#ECEDE7";
        ctx.globalAlpha = isImpulse ? 0.95 : 0.55;
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      });
    };

    const tick = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const w = parent.clientWidth;
      const h = parent.clientHeight;

      if (!reduced.current) {
        nodes.forEach((n) => {
          const dx = mouse.current.x - n.x;
          const dy = mouse.current.y - n.y;
          const dist = Math.hypot(dx, dy) || 1;
          if (dist < 160) {
            n.vx += (dx / dist) * 0.02;
            n.vy += (dy / dist) * 0.02;
          }
          n.vx *= 0.92;
          n.vy *= 0.92;
          n.x += n.vx;
          n.y += n.vy;
        });
      }

      draw(w, h);
      raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    resize();
    window.addEventListener("resize", resize);
    canvas.parentElement?.addEventListener("pointermove", onMove);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      canvas.parentElement?.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`network-canvas absolute inset-0 h-full w-full ${className ?? ""}`}
      aria-hidden
    />
  );
}
