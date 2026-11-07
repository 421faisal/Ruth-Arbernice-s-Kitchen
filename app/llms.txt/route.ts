import { getMenu, getPublishedPosts, getSettings } from "@/lib/data";
import { llmsText } from "@/lib/seo";

// GEO: a plain-text fact sheet for AI assistants (ChatGPT, Perplexity, Gemini, Claude), per the llms.txt convention.
// Built from the same cached data as the site, so it updates whenever the owner saves changes.
export async function GET() {
  const [s, menu, posts] = await Promise.all([getSettings(), getMenu(), getPublishedPosts()]);
  return new Response(llmsText(s, menu, posts), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
