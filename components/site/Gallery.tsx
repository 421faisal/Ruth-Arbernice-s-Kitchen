import { Reveal } from "./Motion";

// Mosaic of kitchen photos for the home page. Spans make a magazine-style layout on large screens.
const PHOTOS = [
  { src: "/images/pot-roast-carrots-potatoes.webp", alt: "Pot roast with carrots and potatoes", caption: "Pot roast", span: "lg:col-span-2 lg:row-span-2" },
  { src: "/images/southern-fried-chicken.webp", alt: "Golden Southern fried chicken", caption: "Fried chicken", span: "" },
  { src: "/images/baked-mac-and-cheese-skillet.webp", alt: "Baked macaroni and cheese in a skillet", caption: "Macaroni", span: "" },
  { src: "/images/greens-cooking-over-open-fire.webp", alt: "A pot of greens cooking over an open fire", caption: "Slow-cooked greens", span: "lg:row-span-2" },
  { src: "/images/cornbread-slices.webp", alt: "Slices of golden cornbread on a plate", caption: "Cornbread with every meal", span: "" },
  { src: "/images/whole-roast-chicken-with-green-beans.webp", alt: "Whole roast chicken served with green beans", caption: "Sunday dinner", span: "lg:col-span-2" },
  { src: "/images/mac-and-cheese-and-fried-chicken-trays.webp", alt: "Trays of macaroni and fried chicken", caption: "Made for the whole family", span: "" },
];

export function Gallery() {
  return (
    <div className="grid auto-rows-[220px] grid-cols-2 gap-3 sm:gap-4 lg:auto-rows-[240px] lg:grid-cols-4">
      {PHOTOS.map((p, i) => (
        <Reveal key={p.src} variant="zoom" delay={(i % 4) * 0.08} className={`${p.span} ${i === 0 ? "col-span-2" : ""}`}>
          <figure className="group relative h-full overflow-hidden rounded-2xl border border-gold/10">
            <img
              src={p.src}
              alt={p.alt}
              loading="lazy"
              className="h-full w-full object-cover transition duration-[1.6s] ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/10 to-transparent opacity-80 transition-opacity duration-700 group-hover:opacity-100" />
            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gold/0 transition duration-700 group-hover:ring-gold/50" />
            <figcaption className="absolute inset-x-0 bottom-0 translate-y-2 p-5 transition duration-700 group-hover:translate-y-0">
              <span className="gold-text font-script text-2xl sm:text-3xl">{p.caption}</span>
            </figcaption>
          </figure>
        </Reveal>
      ))}
    </div>
  );
}
