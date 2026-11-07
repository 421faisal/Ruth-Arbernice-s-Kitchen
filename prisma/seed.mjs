// Seeds the starter menu, store hours and a welcome blog post.
// Safe to re-run: it only adds things that are missing.
import { PrismaClient } from "@prisma/client";
import { OWNER_QUOTE, OWNER_STORY, OWNER_TITLE, WELCOME_CONTENT, WELCOME_EXCERPT } from "./owner-story.mjs";
const db = new PrismaClient();

const closed = { closed: true, open: "11:00", close: "17:00" };
const hours = [
  { closed: false, open: "11:00", close: "17:00" }, // Sunday
  closed,                                             // Monday
  { closed: false, open: "11:00", close: "22:00" }, // Tuesday
  { closed: false, open: "11:00", close: "22:00" }, // Wednesday
  { closed: false, open: "11:00", close: "22:00" }, // Thursday
  { closed: false, open: "11:00", close: "22:00" }, // Friday
  { closed: false, open: "11:00", close: "17:00" }, // Saturday
];

// priceCents: null = "Call for price" (owner sets prices in /admin), 0 = "Included"
// [name, description, category, featured, priceCents, starter photo in public/images]
const menu = [
  ["Fried Chicken", "Crispy, golden, Southern-style fried chicken.", "Entrées", true, null, "southern-fried-chicken"],
  ["Baked Chicken", "Tender, well-seasoned, oven-baked chicken.", "Entrées", true, null, "roasted-chicken-thighs"],
  ["Mississippi Pot Roast", "Slow-cooked, fall-apart tender pot roast.", "Entrées", true, null, "pot-roast-carrots-potatoes"],
  ["Macaroni", "Southern-style macaroni.", "Sides", true, null, "baked-mac-and-cheese-skillet"],
  ["Collard Greens", "Slow-simmered collard greens with smoked ham hocks.", "Sides", false, null, "sauteed-greens-in-skillet"],
  ["Green Beans", "Green beans simmered with smoked turkey.", "Sides", false, null, "seasoned-green-beans-side"],
  ["Sweet Potatoes", "Soft, sweet, Southern-style sweet potatoes.", "Sides", false, null, "roasted-sweet-potato-wedges"],
  ["Rice", "A comforting plate of rice.", "Sides", false, null, "fried-rice-plate"],
  ["Cornbread", "Comes with every meal.", "Bread", false, 0, "cornbread-slices"],
];

async function main() {
  await db.settings.upsert({
    where: { id: "site" },
    update: {},
    create: {
      id: "site",
      phone: "(224) 645-9128",
      hoursJson: JSON.stringify(hours),
      deliveryEnabled: false,
      orderNote: "Call ahead and we'll have your order ready when you arrive.",
    },
  });

  // "Meet the Owner" story in her own words (prisma/owner-story.mjs). She can edit it at /admin/story.
  const site = await db.settings.findUnique({ where: { id: "site" } });
  if (site && !site.ownerStory) {
    await db.settings.update({
      where: { id: "site" },
      data: {
        state: site.state || "NC",
        ownerTitle: OWNER_TITLE,
        ownerQuote: OWNER_QUOTE,
        ownerStory: OWNER_STORY,
      },
    });
  }

  if ((await db.menuItem.count()) === 0) {
    let i = 0;
    for (const [name, description, category, featured, priceCents, photo] of menu) {
      const imageUrl = photo ? `/images/${photo}.webp` : null;
      await db.menuItem.create({ data: { name, description, category, featured, priceCents, imageUrl, sortOrder: i++ } });
    }
  }

  await db.post.upsert({
    where: { slug: "welcome-to-our-kitchen" },
    update: {},
    create: {
      title: "Welcome to Ruth ’N’ Arbernise’s Kitchen",
      slug: "welcome-to-our-kitchen",
      excerpt: WELCOME_EXCERPT,
      content: WELCOME_CONTENT,
      coverUrl: "/images/mac-and-cheese-and-fried-chicken-trays.webp",
      published: true,
      publishedAt: new Date(),
    },
  });
}

main().then(() => db.$disconnect()).catch(async (e) => { console.error(e); await db.$disconnect(); process.exit(1); });
