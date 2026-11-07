// SEO / AEO / GEO helpers: one source of truth for business facts, used by
// JSON-LD structured data, the FAQ, sitemap, llms.txt and page metadata.
import { DAY_NAMES, groupHours, type DayHours } from "./hours";
import { formatPrice } from "./format";
import { deliveryPartners, deliverySentence, fulfillmentLabel, offersDelivery, partnerNames } from "./ordering";

export const SITE_URL = (process.env.SITE_URL || "http://localhost:3000").replace(/\/$/, "");
export const BUSINESS_NAME = "Ruth ’N’ Arbernise’s Kitchen";
export const BUSINESS_NAME_PLAIN = "Ruth 'N' Arbernise's Kitchen"; // straight quotes, for search & AI tools
export const TAGLINE = "Rooted in Illinois";
export const CUISINES = ["Southern", "Soul Food", "Comfort Food", "American"];

export const abs = (path: string) => (path.startsWith("http") ? path : `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`);

type Social = { facebook: string; instagram: string; tiktok: string; whatsapp: string; linkedin: string };

export function whatsappHref(number: string) {
  const digits = number.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits.length === 10 ? `1${digits}` : digits}` : "";
}

/** Filled-in social links, in display order. */
export function socialLinks(social: Social) {
  return [
    { key: "facebook", label: "Facebook", href: social.facebook },
    { key: "instagram", label: "Instagram", href: social.instagram },
    { key: "tiktok", label: "TikTok", href: social.tiktok },
    { key: "whatsapp", label: "WhatsApp", href: whatsappHref(social.whatsapp) },
    { key: "linkedin", label: "LinkedIn", href: social.linkedin },
  ].filter((l) => l.href) as { key: "facebook" | "instagram" | "tiktok" | "whatsapp" | "linkedin"; label: string; href: string }[];
}

type SettingsLike = {
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  deliveryEnabled: boolean;
  delivery: { doordash: string; ubereats: string };
  orderNote: string;
  hours: DayHours[];
  social: Social;
};

type MenuItemLike = { name: string; description: string; priceCents: number | null; category: string; imageUrl: string | null };

const SCHEMA_DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function locationText(s: Pick<SettingsLike, "city" | "state">) {
  return s.city ? `${s.city}, ${s.state || "NC"}` : "North Carolina";
}

export function hoursSentence(hours: DayHours[]) {
  return groupHours(hours)
    .map((r) => `${r.label}: ${r.value}`)
    .join("; ");
}

/** Plain-language answers built from live settings, so they never go out of date. Used for the FAQ (AEO). */
export function buildFaqs(s: SettingsLike, menu: MenuItemLike[]) {
  const where = locationText(s);
  const mains = menu.filter((m) => m.category === "Entrées").map((m) => m.name);
  const sides = menu.filter((m) => m.category === "Sides").map((m) => m.name.toLowerCase());
  const list = (a: string[]) => (a.length > 1 ? `${a.slice(0, -1).join(", ")} and ${a[a.length - 1]}` : a[0] ?? "");

  const faqs = [
    {
      q: `Where is ${BUSINESS_NAME_PLAIN} located?`,
      a: s.address
        ? `We're at ${[s.address, s.city, `${s.state} ${s.zip}`.trim()].filter(Boolean).join(", ")}. We're a family-owned kitchen in ${where}, rooted in Illinois.`
        : `We're a family-owned kitchen in ${where}, rooted in Illinois. Call ${s.phone} for pickup details.`,
    },
    {
      q: "What are your hours?",
      a: `${hoursSentence(s.hours)}. All times are Eastern time.`,
    },
    {
      q: "Do you offer delivery?",
      a: deliverySentence(s, s.phone),
    },
    {
      q: "How do I place an order?",
      a: `${partnerNames(s) ? `For delivery, order on ${partnerNames(s)}. ` : ""}For pickup, call us at ${s.phone} during business hours. ${s.orderNote || ""}`.trim(),
    },
    {
      q: "What kind of food do you serve?",
      a: `Southern home cooking and soul food${mains.length ? `: ${list(mains)}` : ""}${sides.length ? `, with sides like ${list(sides)}` : ""}. Every meal comes with cornbread.`,
    },
    {
      q: "Does every meal come with cornbread?",
      a: "Yes. Every meal comes with cornbread.",
    },
    {
      q: "Who are Ruth and Arbernise?",
      a: "Ruth and Arbernise are the owner's grandmothers. The kitchen is named in their honor, and the two hearts in our logo are for them.",
    },
    {
      q: "Is this a family-owned business?",
      a: "Yes. It's owned and run by a single mom of five. She does the cooking herself.",
    },
    {
      q: "Who does the cooking?",
      a: "The owner does. She's a single mom of five who has been cooking since she was 17. She learned by watching her grandmother cook and sell dinners for the church, and owning a restaurant has always been her dream.",
    },
  ];
  return faqs;
}

/** Restaurant / LocalBusiness structured data for Google, Bing, Apple Maps and AI answer engines. */
export function restaurantJsonLd(s: SettingsLike, menu: MenuItemLike[]) {
  const sameAs = socialLinks(s.social).map((l) => l.href);
  const openingHoursSpecification = s.hours
    .map((d, i) => ({ d, i }))
    .filter(({ d }) => !d.closed)
    .map(({ d, i }) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: `https://schema.org/${SCHEMA_DAYS[i]}`,
      opens: d.open,
      closes: d.close,
    }));

  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": `${SITE_URL}/#restaurant`,
    name: BUSINESS_NAME_PLAIN,
    alternateName: ["Ruth and Arbernise's Kitchen", "Ruth N Arbernise's Kitchen"],
    slogan: TAGLINE,
    description:
      `Family-owned Southern and soul food kitchen in North Carolina, owned and run by a single mom of five who has cooked since she was 17, and named for Grandmothers Ruth and Arbernise. ${fulfillmentLabel(s)}. Every meal comes with cornbread.`,
    url: SITE_URL,
    logo: abs("/brand/logo-primary-gold.png"),
    image: [abs("/brand/logo-primary-gold.png")],
    telephone: s.phone ? `+1-${s.phone.replace(/\D/g, "").replace(/^(\d{3})(\d{3})(\d{4})$/, "$1-$2-$3")}` : undefined,
    servesCuisine: CUISINES,
    priceRange: "$$",
    acceptsReservations: false,
    hasMenu: abs("/menu"),
    address: {
      "@type": "PostalAddress",
      streetAddress: s.address || undefined,
      addressLocality: s.city || undefined,
      addressRegion: s.state || "NC",
      postalCode: s.zip || undefined,
      addressCountry: "US",
    },
    areaServed: { "@type": "State", name: "North Carolina" },
    openingHoursSpecification,
    ...(sameAs.length ? { sameAs } : {}),
    potentialAction: [
      ...(s.phone
        ? [
            {
              "@type": "OrderAction",
              name: "Call to order for pickup",
              target: { "@type": "EntryPoint", urlTemplate: `tel:${s.phone.replace(/\D/g, "")}`, actionPlatform: "http://schema.org/MobileWebPlatform" },
              deliveryMethod: s.deliveryEnabled
                ? ["http://purl.org/goodrelations/v1#DeliveryModePickUp", "http://purl.org/goodrelations/v1#DeliveryModeOwnFleet"]
                : ["http://purl.org/goodrelations/v1#DeliveryModePickUp"],
            },
          ]
        : []),
      // Delivery partners (DoorDash, Uber Eats): lets Google show "Order online" links
      ...deliveryPartners(s).map((p) => ({
        "@type": "OrderAction",
        name: `Order delivery on ${p.label}`,
        target: {
          "@type": "EntryPoint",
          urlTemplate: p.href,
          actionPlatform: ["http://schema.org/DesktopWebPlatform", "http://schema.org/MobileWebPlatform"],
        },
        // Fulfilled by the partner's couriers, so no deliveryMethod / price is claimed here.
      })),
    ],
    knowsAbout: menu.map((m) => m.name),
  };
}

export function menuJsonLd(menu: MenuItemLike[]) {
  const sections = [...new Set(menu.map((m) => m.category))];
  return {
    "@context": "https://schema.org",
    "@type": "Menu",
    "@id": `${SITE_URL}/menu#menu`,
    name: `${BUSINESS_NAME_PLAIN} Menu`,
    inLanguage: "en-US",
    hasMenuSection: sections.map((sec) => ({
      "@type": "MenuSection",
      name: sec,
      hasMenuItem: menu
        .filter((m) => m.category === sec)
        .map((m) => ({
          "@type": "MenuItem",
          name: m.name,
          description: m.description || undefined,
          image: m.imageUrl ? abs(m.imageUrl) : undefined,
          ...(m.priceCents !== null && m.priceCents > 0
            ? { offers: { "@type": "Offer", price: (m.priceCents / 100).toFixed(2), priceCurrency: "USD" } }
            : {}),
        })),
    })),
  };
}

export function faqJsonLd(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: abs(it.path) })),
  };
}

/** Text summary for llms.txt (GEO): plain facts AI assistants can quote accurately. */
export function llmsText(s: SettingsLike & { owner: { name: string } }, menu: MenuItemLike[], posts: { title: string; slug: string }[]) {
  const where = locationText(s);
  const lines = [
    `# ${BUSINESS_NAME_PLAIN}`,
    "",
    `> Family-owned Southern and soul food kitchen in ${where}. Rooted in Illinois. ${fulfillmentLabel(s)}. Every meal comes with cornbread. Order by phone: ${s.phone}.`,
    "",
    "## Key facts",
    `- Name: ${BUSINESS_NAME_PLAIN} (also written Ruth & Arbernise's Kitchen)`,
    `- Location: ${s.city || s.address ? [s.address, s.city, s.state, s.zip].filter(Boolean).join(", ") : "North Carolina, USA"}`,
    `- Phone: ${s.phone}`,
    `- Ordering: ${offersDelivery(s) ? `pickup (call to order)${s.deliveryEnabled ? "; the kitchen also delivers" : ""}${partnerNames(s) ? `; delivery on ${partnerNames(s)}` : ""}` : "pickup only, no delivery; call to order"}`,
    ...deliveryPartners(s).map((p) => `- Order on ${p.label}: ${p.href}`),
    `- Hours (Eastern time): ${hoursSentence(s.hours)}`,
    `- Cuisine: ${CUISINES.join(", ")}`,
    `- Ownership: family owned; run by the owner, a single mom of five who has cooked since age 17 and learned from her grandmother${s.owner.name ? ` (owner: ${s.owner.name})` : ""}`,
    "- Named for: the owner's grandmothers, Ruth and Arbernise",
    "",
    "## Menu",
    ...menu.map((m) => `- ${m.name} (${m.category}): ${m.description}${m.priceCents ? ` ${formatPrice(m.priceCents)}` : ""}`),
    "",
    "## Pages",
    `- [Home](${SITE_URL}/)`,
    `- [Menu](${SITE_URL}/menu)`,
    `- [Our Story](${SITE_URL}/story)`,
    `- [Blog](${SITE_URL}/blog)`,
    ...posts.map((p) => `- [${p.title}](${SITE_URL}/blog/${p.slug})`),
  ];
  const social = socialLinks(s.social);
  if (social.length) lines.push("", "## Social", ...social.map((l) => `- [${l.label}](${l.href})`));
  return lines.join("\n") + "\n";
}

export { DAY_NAMES };
