# Ruth ’N’ Arbernise’s Kitchen: website

Black-and-gold website for a family-owned Southern and soul food kitchen in **North Carolina** (brand tagline:
“Rooted in Illinois”), with an owner dashboard for prices, dishes, photos, the owner's story, blog posts, hours
and social links. Pickup by phone, plus delivery through DoorDash and Uber Eats as soon as their store links are
added in the dashboard.

Built with **Next.js 16** (App Router, Cache Components), **Prisma**, **Tailwind CSS 4** and **sharp**.

## Pages

| Page | What it shows |
| --- | --- |
| `/` | Cinematic hero (gold-foil logo, gold dust, live “Open now” badge in Eastern time), dish marquee, family favorites, photo gallery, story teaser, hours, FAQ, latest posts |
| `/menu` | Full menu by section with photos and prices |
| `/story` | **Meet the Owner** (photo, name, quote, story, social buttons) and the meaning of the logo |
| `/blog`, `/blog/[slug]` | Owner's blog posts |
| `/admin` | Owner dashboard (password protected) |

## Owner dashboard (`/admin`)

- **Menu & prices**: change a price and press Save in the list; click a dish to edit its name, description,
  section, photo, “Family favorite” (home page) and “Show on the menu” (turn off when sold out).
  Empty price = “Call for price”; `0` = “Included” (used for cornbread).
- **Our Story**: name, title, photo, a favorite quote and the story itself, shown on `/story`.
- **Blog**: posts with simple formatting (`## Heading`, `**bold**`, `- list`), live preview, drafts.
- **Hours & settings**: hours per day, phone, pickup address (street, city, **NC**, ZIP), delivery on/off,
  ordering note, announcement bar, and **Facebook, Instagram, TikTok, LinkedIn and WhatsApp**. Each social button
  appears on the site only once its link is filled in.
- **Photos** upload straight from a phone; they are rotated, resized to 1600px and saved as WebP.

Every save refreshes the public pages immediately (`updateTag`), while the pages themselves stay prerendered and fast.

## SEO, AEO and GEO

All business facts come from one place (`lib/seo.ts`, fed by the dashboard settings), so search engines,
answer engines and AI assistants always see the same name, address, phone and hours.

- **SEO**: per-page titles, descriptions and canonical URLs; `sitemap.xml`; `robots.txt` (admin blocked);
  1200×630 social share image (`public/og-image.jpg`); descriptive image file names and alt text; semantic HTML.
- **Structured data (JSON-LD)**: `Restaurant` (NC address, area served, hours, phone, cuisine, pickup `OrderAction`,
  `sameAs` social profiles) on every page, plus `Menu` with sections/items/prices, `FAQPage`, `BlogPosting`,
  `AboutPage` / `Person` (owner) and `BreadcrumbList`.
- **AEO**: answer-first FAQ on the home page (location, hours, delivery, how to order, food, cornbread, who Ruth and
  Arbernise are). The answers are generated from live settings, so they never go out of date.
- **GEO**: `/llms.txt`, a plain-text fact sheet for AI assistants (ChatGPT, Perplexity, Gemini, Claude), rebuilt
  from the same data.

**Most important next step for local search:** add the city, street and ZIP in Hours & settings, then create a free
**Google Business Profile** and **Apple Business Connect** listing with exactly the same name, address and phone.

## Photos

Stock photos from Pexels were renamed by what they show. Web versions (WebP, max 1600px, 7.7 MB total) live in
`public/images/`; full-size originals are in `photo-library/` (not deployed; `SOURCES.json` lists the original
Pexels file names). Pexels photos are free for commercial use, but the dish photos are stand-ins. Replace them
with real photos of the kitchen's food from the dashboard as soon as possible.

## Run it locally

The database is Postgres (Neon). Pull the connection settings from Vercel, then run:

```bash
npm install
npx vercel link                 # once: link to the "ruth-arbernise-kitchen" Vercel project
npx vercel env pull .env.local  # DATABASE_URL, DATABASE_URL_UNPOOLED, BLOB_READ_WRITE_TOKEN
npm run dev                     # http://localhost:3000   (owner login at /admin)
```

Put `ADMIN_PASSWORD`, `SESSION_SECRET` and `SITE_URL` for local use in `.env` (copy `.env.example`). Prisma CLI
commands read `.env` only, so load `.env.local` first: `set -a; . ./.env.local; set +a; npx prisma db push`.

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Neon pooled connection (used by the site) |
| `DATABASE_URL_UNPOOLED` | Neon direct connection (used by `prisma db push`) |
| `ADMIN_PASSWORD` | Owner's dashboard password |
| `SESSION_SECRET` | Long random string that signs the login cookie |
| `SITE_URL` | Public address. Used for canonical URLs, sitemap and structured data |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob store for photos the owner uploads |

## Hosting (live on Vercel)

- **Site:** Vercel project `ruth-arbernise-kitchen`. Every push to `main` on GitHub deploys automatically.
- **Database:** Neon Postgres `ruth-kitchen-db` (free plan, `iad1` / US East), connected through the Vercel Marketplace.
- **Photos:** Vercel Blob store `ruth-kitchen-photos` (public).
- **Secrets** (`ADMIN_PASSWORD`, `SESSION_SECRET`) are encrypted Vercel environment variables. Change the owner
  password in Vercel → Settings → Environment Variables, then redeploy.
- **Schema changes:** run `prisma db push` against Neon (see above) before pushing code that needs them.
- **After launch:** submit `/sitemap.xml` in Google Search Console and Bing Webmaster Tools, and set up a Google
  Business Profile with the same name, address and phone as the website.
- **Custom domain:** add it in Vercel → Settings → Domains, then update `SITE_URL`.

## Project layout

```
app/(site)/          public pages + shared header/footer (Restaurant JSON-LD lives in the layout)
app/admin/           owner login, dashboard pages and server actions (actions.ts)
app/sitemap.ts, robots.ts, llms.txt/   search & AI discovery files
app/uploads/         serves uploaded photos when not using Vercel Blob
components/site/     public UI: header, motion (reveal, gold dust), gallery, FAQ, social buttons, dish cards
components/admin/    dashboard forms
lib/                 database, cached data reads, SEO/structured data, auth, photo storage, hours/price helpers
prisma/              schema and starter data (seed.mjs)
public/brand/        gold-foil logo files · public/images/ optimized photos · public/og-image.jpg
photo-library/       full-size original photos (not deployed)
```

## Notes

- Hours and the “Open now” badge use **America/New_York** (North Carolina). Monday is set to closed.
- Animations respect the visitor's “reduce motion” setting, and content never stays hidden without JavaScript.
- Starter menu descriptions and the owner's story are drafts written from what the owner shared. She should
  edit them in her own words. Children's ages and family health details were intentionally left off the site.
- Logo source files (SVG, PDF, PNG in every colorway, including gold foil) are in `brand-kit/`.
