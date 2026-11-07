"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { FamilyPhoto } from "@/lib/family";

/**
 * Cross-fading family slideshow with a slow cinematic zoom on the active photo.
 * Pauses on hover/focus and when the visitor prefers reduced motion. Dots let people pick a photo.
 */
export function FamilySlideshow({ photos, interval = 4800, className = "" }: { photos: FamilyPhoto[]; interval?: number; className?: string }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (paused || reduced || photos.length < 2) return;
    const id = setInterval(() => setI((n) => (n + 1) % photos.length), interval);
    return () => clearInterval(id);
  }, [paused, reduced, photos.length, interval]);

  return (
    <div
      className={`group/slides relative h-full w-full overflow-hidden ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Family photos"
    >
      {photos.map((p, n) => (
        <figure
          key={p.src}
          className={`absolute inset-0 transition-opacity duration-[1400ms] ease-in-out ${n === i ? "opacity-100" : "opacity-0"}`}
          aria-hidden={n !== i}
        >
          <img
            src={p.src}
            alt={p.alt}
            loading={n === 0 ? "eager" : "lazy"}
            decoding="async"
            className={`h-full w-full object-cover ${n === i ? "slide-zoom" : ""}`}
          />
          <figcaption
            className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/85 via-ink/30 to-transparent px-6 pb-14 pt-16 text-center transition-all duration-1000 ${
              n === i ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            }`}
          >
            <span className="gold-text font-script text-3xl">{p.caption}</span>
          </figcaption>
        </figure>
      ))}
      {photos.length > 1 && (
        <div className="absolute inset-x-0 bottom-5 z-10 flex justify-center gap-2">
          {photos.map((p, n) => (
            <button
              key={p.src}
              type="button"
              onClick={() => setI(n)}
              aria-label={`Show photo ${n + 1}: ${p.caption}`}
              aria-current={n === i}
              className={`h-1.5 rounded-full transition-all duration-500 ${n === i ? "w-6 bg-gold" : "w-1.5 bg-cream/50 hover:bg-cream"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/** Polaroid-style family wall: tilted ivory prints with gold tape that straighten and lift on hover. */
export function FamilyWall({ photos }: { photos: FamilyPhoto[] }) {
  const tilts = [-3, 2.5, -1.5, 3, -2.5, 1.5, -3.5, 2, -1, 3.5];
  const ref = useRef<HTMLUListElement>(null);

  // Each print drops in and settles at its tilt as it scrolls into view.
  useEffect(() => {
    const items = ref.current?.querySelectorAll<HTMLElement>("[data-polaroid]");
    if (!items?.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting || e.boundingClientRect.top < 0) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.15 },
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <ul ref={ref} className="columns-2 gap-5 sm:gap-7 md:columns-3 lg:columns-4">
      {photos.map((p, n) => (
        <li
          key={p.src}
          data-polaroid
          className="polaroid group relative mb-8 break-inside-avoid"
          style={{ "--tilt": `${tilts[n % tilts.length]}deg`, "--d": `${(n % 4) * 0.12}s` } as CSSProperties}
        >
          <span className="absolute -top-3 left-1/2 z-10 h-6 w-20 -translate-x-1/2 rotate-[-4deg] bg-gradient-to-b from-gold-light/90 to-gold/70 opacity-90 shadow-sm" aria-hidden />
          <figure className="rounded-[4px] bg-[#f6efe0] p-2.5 pb-0 shadow-[0_18px_40px_-18px_rgba(0,0,0,0.9)] transition-shadow duration-700 group-hover:shadow-[0_30px_60px_-20px_rgba(212,175,55,0.45)] sm:p-3 sm:pb-0">
            <div className="overflow-hidden bg-ink">
              <img
                src={p.src}
                alt={p.alt}
                width={p.w}
                height={p.h}
                loading="lazy"
                decoding="async"
                className="h-auto w-full transition duration-[1.4s] ease-out group-hover:scale-105"
              />
            </div>
            <figcaption className="px-1 py-3 text-center font-script text-xl text-[#3a2416] sm:text-2xl">{p.caption}</figcaption>
          </figure>
        </li>
      ))}
    </ul>
  );
}
