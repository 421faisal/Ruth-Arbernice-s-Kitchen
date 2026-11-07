import { formatPrice } from "@/lib/format";

type Dish = { name: string; description: string; priceCents: number | null; imageUrl: string | null; category: string };

export function DishImage({
  dish,
  className = "",
  compact = false,
}: {
  dish: Pick<Dish, "name" | "imageUrl">;
  className?: string;
  compact?: boolean;
}) {
  if (dish.imageUrl) {
    return (
      <img
        src={dish.imageUrl}
        alt={`${dish.name} from Ruth ’N’ Arbernise’s Kitchen`}
        loading="lazy"
        className={`h-full w-full object-cover ${className}`}
      />
    );
  }
  // Elegant placeholder until the owner uploads a photo: gold-framed plate with the family emblem
  return (
    <div className={`relative flex h-full w-full items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_50%_40%,#2a2214_0%,#0b0a07_70%)] ${className}`} aria-hidden>
      <div className={`absolute rounded-full border border-gold/25 ${compact ? "inset-2" : "inset-[12%]"}`} />
      <div className={`absolute rounded-full border border-gold/10 ${compact ? "inset-4" : "inset-[17%]"}`} />
      {compact ? (
        <img src="/brand/emblem-gold.png" alt="" className="relative w-[70%] opacity-70" />
      ) : (
        <div className="relative flex flex-col items-center gap-3 px-6 text-center">
          <img src="/brand/emblem-gold.png" alt="" className="w-40 opacity-60" />
          <span className="gold-text font-script text-3xl leading-none">{dish.name}</span>
        </div>
      )}
    </div>
  );
}

export function DishCard({ dish }: { dish: Dish }) {
  return (
    <article className="card-lux group flex h-full flex-col rounded-3xl">
      <div className="relative aspect-[4/3] overflow-hidden">
        <DishImage dish={dish} className="transition duration-[1.2s] ease-out group-hover:scale-110" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0b0a07] to-transparent" aria-hidden />
        <span className="absolute left-4 top-4 rounded-full border border-gold/40 bg-ink/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-gold backdrop-blur">
          {dish.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-serif text-2xl font-bold text-cream transition-colors duration-500 group-hover:text-gold-light">{dish.name}</h3>
          <span className="shrink-0 font-serif text-lg font-semibold text-gold">{formatPrice(dish.priceCents)}</span>
        </div>
        {dish.description && <p className="leading-relaxed text-muted">{dish.description}</p>}
      </div>
    </article>
  );
}
