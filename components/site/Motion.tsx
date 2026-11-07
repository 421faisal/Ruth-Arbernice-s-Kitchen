"use client";

import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";

/** Fades/slides children in when they scroll into view. */
export function Reveal({
  children,
  as: Tag = "div",
  delay = 0,
  variant,
  className = "",
}: {
  children: ReactNode;
  as?: ElementType;
  delay?: number;
  variant?: "up" | "fade" | "zoom";
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        // Also reveal anything the visitor has already scrolled past (fast scrolls, jump links).
        if (entry.isIntersecting || entry.boundingClientRect.top < 0) {
          el.classList.add("is-visible");
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag
      ref={ref}
      data-reveal={variant && variant !== "up" ? variant : ""}
      className={className}
      style={{ "--d": `${delay}s` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}

/** Slowly rising, twinkling gold dust drawn on a canvas. Pauses when off-screen; off for reduced motion. */
export function GoldDust({ density = 1, className = "" }: { density?: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    type P = { x: number; y: number; r: number; vy: number; phase: number; speed: number; drift: number };
    let w = 0, h = 0, raf = 0, running = true;
    let particles: P[] = [];
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const spawn = (anywhere: boolean): P => ({
      x: Math.random() * w,
      y: anywhere ? Math.random() * h : h + 10,
      r: 0.5 + Math.random() * 1.8,
      vy: 0.12 + Math.random() * 0.45,
      phase: Math.random() * Math.PI * 2,
      speed: 0.01 + Math.random() * 0.025,
      drift: 0.2 + Math.random() * 0.6,
    });

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(110, (w * h) / 14000) * density);
      particles = Array.from({ length: count }, () => spawn(true));
    };

    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      for (const p of particles) {
        p.phase += p.speed;
        p.y -= p.vy;
        p.x += Math.sin(p.phase) * p.drift * 0.3;
        if (p.y < -10) Object.assign(p, spawn(false));
        const a = 0.25 + 0.55 * (0.5 + 0.5 * Math.sin(p.phase * 2));
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
        g.addColorStop(0, `rgba(255, 236, 170, ${a})`);
        g.addColorStop(0.35, `rgba(212, 175, 55, ${a * 0.55})`);
        g.addColorStop(1, "rgba(212, 175, 55, 0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
        ctx.fill();
      }
      if (running) raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (!running) {
        running = true;
        raf = requestAnimationFrame(tick);
      }
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    resize();
    raf = requestAnimationFrame(tick);
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()));
    io.observe(canvas);
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [density]);

  return <canvas ref={ref} aria-hidden className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} />;
}
