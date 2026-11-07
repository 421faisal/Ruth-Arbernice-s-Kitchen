// One-off: writes the owner's story (prisma/owner-story.mjs) into an existing database.
// Run with: node prisma/apply-owner-story.mjs
import { PrismaClient } from "@prisma/client";
import { OWNER_QUOTE, OWNER_STORY, OWNER_TITLE, WELCOME_CONTENT, WELCOME_EXCERPT } from "./owner-story.mjs";

const db = new PrismaClient();
const s = await db.settings.update({
  where: { id: "site" },
  data: { ownerTitle: OWNER_TITLE, ownerQuote: OWNER_QUOTE, ownerStory: OWNER_STORY },
});
const p = await db.post.updateMany({
  where: { slug: "welcome-to-our-kitchen" },
  data: { excerpt: WELCOME_EXCERPT, content: WELCOME_CONTENT },
});
console.log("story saved:", s.ownerTitle, "|", s.ownerQuote, "| welcome post updated:", p.count);
await db.$disconnect();
