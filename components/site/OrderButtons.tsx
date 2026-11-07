import { deliveryPartners, type OrderingInfo, type PartnerKey } from "@/lib/ordering";

// Brand colors only on the small icon chip, so the buttons are recognizable but still fit the black & gold theme.
const BRAND: Record<PartnerKey, string> = { doordash: "#EB1700", ubereats: "#06C167" };

function BagIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M6 7h12l-1 13H7L6 7z" />
      <path d="M9 7V5a3 3 0 0 1 6 0v2" />
    </svg>
  );
}

/** "Order on DoorDash" / "Order on Uber Eats" buttons. Renders nothing until the owner adds a link. */
export function OrderButtons({
  s,
  size = "md",
  className = "",
}: {
  s: OrderingInfo;
  size?: "md" | "lg";
  className?: string;
}) {
  const partners = deliveryPartners(s);
  if (!partners.length) return null;
  const pad = size === "lg" ? "pl-2 pr-6 py-2 text-base" : "pl-1.5 pr-5 py-1.5 text-sm";
  const chip = size === "lg" ? "h-10 w-10" : "h-8 w-8";

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      {partners.map((p) => (
        <a
          key={p.key}
          href={p.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`group inline-flex items-center gap-3 rounded-full border border-gold/40 bg-ink/70 font-semibold text-cream backdrop-blur transition duration-500 hover:-translate-y-0.5 hover:border-gold hover:text-gold-light hover:shadow-[0_12px_36px_-14px_rgba(212,175,55,0.7)] ${pad}`}
        >
          <span className={`inline-flex ${chip} items-center justify-center rounded-full text-white`} style={{ backgroundColor: BRAND[p.key] }}>
            <BagIcon />
          </span>
          <span>
            <span className="block text-[10px] font-medium uppercase leading-none tracking-[0.2em] text-muted group-hover:text-gold/80">Delivery</span>
            <span className="leading-tight">Order on {p.label}</span>
          </span>
        </a>
      ))}
    </div>
  );
}
