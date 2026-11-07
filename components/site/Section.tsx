import type { ReactNode } from "react";
import { GoldDust, Reveal } from "./Motion";

/** Full-bleed photo, darkened with a black-to-gold wash so gold text stays readable. Slow zoom for life. */
export function PhotoBackdrop({ src, strength = "strong" }: { src: string; strength?: "strong" | "medium" }) {
  return (
    <div className="absolute inset-0" aria-hidden>
      <img src={src} alt="" className="kenburns h-full w-full object-cover" />
      <div
        className={`absolute inset-0 ${
          strength === "strong"
            ? "bg-[linear-gradient(180deg,rgba(7,6,5,0.88)_0%,rgba(7,6,5,0.78)_45%,rgba(7,6,5,0.95)_100%)]"
            : "bg-[linear-gradient(180deg,rgba(7,6,5,0.75)_0%,rgba(7,6,5,0.6)_50%,rgba(7,6,5,0.9)_100%)]"
        }`}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(212,175,55,0.18),transparent_65%)] mix-blend-screen" />
    </div>
  );
}

/** Small art-deco ornament: hairline · diamond · hairline */
export function Ornament({ className = "", wide = false }: { className?: string; wide?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-3 text-gold ${className}`} aria-hidden>
      <span className={`h-px bg-gradient-to-r from-transparent to-gold/80 ${wide ? "w-20 sm:w-28" : "w-10"}`} />
      <svg width="10" height="10" viewBox="0 0 10 10" className="rotate-45">
        <rect x="1.5" y="1.5" width="7" height="7" fill="none" stroke="currentColor" strokeWidth="1.2" />
      </svg>
      <span className={`h-px bg-gradient-to-l from-transparent to-gold/80 ${wide ? "w-20 sm:w-28" : "w-10"}`} />
    </span>
  );
}

export function Eyebrow({ children, center = false }: { children: ReactNode; center?: boolean }) {
  return (
    <p className={`flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.35em] text-gold ${center ? "justify-center" : ""}`}>
      <span className="h-px w-8 bg-gradient-to-r from-transparent to-gold" aria-hidden />
      {children}
      {center && <span className="h-px w-8 bg-gradient-to-l from-transparent to-gold" aria-hidden />}
    </p>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  children,
  center = false,
}: {
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
  center?: boolean;
}) {
  return (
    <Reveal className={`space-y-5 ${center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}`}>
      <Eyebrow center={center}>{eyebrow}</Eyebrow>
      <h2 className="font-serif text-4xl font-bold leading-[1.1] text-cream sm:text-5xl">{title}</h2>
      {children && <p className="text-lg leading-relaxed text-muted">{children}</p>}
    </Reveal>
  );
}

/** Header band for inner pages (menu, story, blog). */
export function PageHero({
  eyebrow,
  title,
  children,
  image,
}: {
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
  /** Optional photo shown behind the header, darkened and warmed to match the theme. */
  image?: string;
}) {
  return (
    <section className="lux-bg relative overflow-hidden border-b border-line">
      {image && <PhotoBackdrop src={image} />}
      <GoldDust density={0.5} />
      <div className="relative mx-auto max-w-4xl space-y-6 px-5 pb-20 pt-40 text-center sm:pt-44">
        <div className="rise" style={{ ["--d" as string]: "0.05s" }}>
          <Eyebrow center>{eyebrow}</Eyebrow>
        </div>
        <h1 className="rise font-serif text-5xl font-bold leading-[1.05] sm:text-6xl" style={{ ["--d" as string]: "0.2s" }}>
          {title}
        </h1>
        <div className="rise" style={{ ["--d" as string]: "0.35s" }}>
          <Ornament wide />
        </div>
        {children && (
          <div className="rise mx-auto max-w-xl text-lg leading-relaxed text-muted" style={{ ["--d" as string]: "0.5s" }}>
            {children}
          </div>
        )}
      </div>
    </section>
  );
}
