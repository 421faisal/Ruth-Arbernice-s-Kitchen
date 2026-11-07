import { Reveal } from "./Motion";

/** Answer-first FAQ (AEO). Native <details> so answers are in the HTML for search engines and work without JS. */
export function Faq({ faqs }: { faqs: { q: string; a: string }[] }) {
  return (
    <div className="divide-y divide-line overflow-hidden rounded-3xl border border-line bg-[linear-gradient(180deg,#120f0b,#0a0907)]">
      {faqs.map((f, i) => (
        <Reveal key={f.q} delay={Math.min(i * 0.06, 0.4)} variant="fade">
          <details className="group" open={i === 0}>
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 px-6 py-5 transition-colors hover:bg-gold/[0.04] sm:px-8 [&::-webkit-details-marker]:hidden">
              <h3 className="font-serif text-lg font-semibold text-cream sm:text-xl">{f.q}</h3>
              <span
                className="relative h-8 w-8 shrink-0 rounded-full border border-gold/40 text-gold transition-transform duration-500 group-open:rotate-45"
                aria-hidden
              >
                <span className="absolute left-1/2 top-1/2 h-px w-3 -translate-x-1/2 -translate-y-1/2 bg-current" />
                <span className="absolute left-1/2 top-1/2 h-3 w-px -translate-x-1/2 -translate-y-1/2 bg-current" />
              </span>
            </summary>
            <p className="px-6 pb-6 leading-relaxed text-muted sm:px-8">{f.a}</p>
          </details>
        </Reveal>
      ))}
    </div>
  );
}
