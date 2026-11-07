"use client";

import { useActionState, useState } from "react";
import Markdown from "react-markdown";
import {
  loginAction,
  quickUpdateMenuItemAction,
  saveMenuItemAction,
  savePostAction,
  saveSettingsAction,
  saveStoryAction,
} from "@/app/admin/actions";
import { DAY_NAMES, type DayHours } from "@/lib/hours";
import { slugify } from "@/lib/format";
import { Field, ImageField, Notice, SubmitButton, Toggle, inputCls } from "./ui";

const centsToInput = (c: number | null | undefined) => (c === null || c === undefined ? "" : (c / 100).toFixed(2));

// ---------------------------------------------------------------- login

export function LoginForm() {
  const [state, action] = useActionState(loginAction, null);
  return (
    <form action={action} className="space-y-4">
      <Field label="Password" htmlFor="password">
        <input id="password" name="password" type="password" required autoComplete="current-password" autoFocus className={inputCls} />
      </Field>
      <Notice state={state} />
      <SubmitButton pendingText="Checking…" className="w-full">
        Log in
      </SubmitButton>
    </form>
  );
}

// ---------------------------------------------------------------- menu

type MenuItemData = {
  id: string;
  name: string;
  description: string;
  priceCents: number | null;
  category: string;
  imageUrl: string | null;
  available: boolean;
  featured: boolean;
  sortOrder: number;
};

export function MenuItemForm({ item, categories }: { item?: MenuItemData; categories: string[] }) {
  const [state, action] = useActionState(saveMenuItemAction, null);
  return (
    <form action={action} className="space-y-6">
      {item && <input type="hidden" name="id" value={item.id} />}
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Dish name" htmlFor="name">
          <input id="name" name="name" required defaultValue={item?.name} placeholder="e.g. Smothered Pork Chops" className={inputCls} />
        </Field>
        <Field label="Price" htmlFor="price" hint="Leave empty to show “Call for price”. Enter 0 to show “Included”.">
          <div className="relative">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">$</span>
            <input id="price" name="price" inputMode="decimal" defaultValue={centsToInput(item?.priceCents)} placeholder="12.99" className={`${inputCls} pl-7`} />
          </div>
        </Field>
        <Field label="Section of the menu" htmlFor="category" hint="Pick one or type a new section, like Desserts or Drinks.">
          <input id="category" name="category" list="categories" defaultValue={item?.category ?? "Entrées"} className={inputCls} />
          <datalist id="categories">
            {categories.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </Field>
        <Field label="Order on the menu" htmlFor="sortOrder" hint="Smaller numbers show first.">
          <input id="sortOrder" name="sortOrder" type="number" defaultValue={item?.sortOrder ?? 0} className={inputCls} />
        </Field>
      </div>
      <Field label="Description" htmlFor="description">
        <textarea id="description" name="description" rows={3} defaultValue={item?.description} placeholder="A short, tasty description" className={inputCls} />
      </Field>
      <ImageField name="image" removeName="removeImage" current={item?.imageUrl ?? null} label="Photo" />
      <div className="grid gap-3 sm:grid-cols-2">
        <Toggle name="available" label="Show on the menu" hint="Turn off when you’re sold out or not making it." defaultChecked={item?.available ?? true} />
        <Toggle name="featured" label="Family favorite" hint="Show it on the home page." defaultChecked={item?.featured ?? false} />
      </div>
      <Notice state={state} />
      <SubmitButton>{item ? "Save changes" : "Add to menu"}</SubmitButton>
    </form>
  );
}

export function QuickPriceForm({ id, priceCents, available }: { id: string; priceCents: number | null; available: boolean }) {
  const [state, action] = useActionState(quickUpdateMenuItemAction, null);
  return (
    <form action={action} className="flex flex-wrap items-center gap-2">
      <input type="hidden" name="id" value={id} />
      <div className="relative w-28">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted">$</span>
        <input
          name="price"
          aria-label="Price"
          inputMode="decimal"
          defaultValue={centsToInput(priceCents)}
          placeholder="—"
          className="w-full rounded-lg border border-line bg-ink py-2 pl-6 pr-2 text-sm text-cream focus:border-gold focus:outline-none"
        />
      </div>
      <label className="flex items-center gap-1.5 text-xs text-muted">
        <input type="checkbox" name="available" defaultChecked={available} className="accent-[#d4af37]" />
        On menu
      </label>
      <SubmitButton pendingText="…" className="!px-4 !py-1.5 text-sm">
        Save
      </SubmitButton>
      {state && <span className={`text-xs ${state.ok ? "text-ok" : "text-red-300"}`}>{state.message}</span>}
    </form>
  );
}

// ---------------------------------------------------------------- blog

type PostData = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverUrl: string | null;
  published: boolean;
};

export function PostForm({ post }: { post?: PostData }) {
  const [state, action] = useActionState(savePostAction, null);
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(post));
  const [content, setContent] = useState(post?.content ?? "");
  const [tab, setTab] = useState<"write" | "preview">("write");

  return (
    <form action={action} className="space-y-6">
      {post && <input type="hidden" name="id" value={post.id} />}
      <Field label="Title" htmlFor="title">
        <input
          id="title"
          name="title"
          required
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (!slugTouched) setSlug(slugify(e.target.value));
          }}
          placeholder="e.g. This week’s special: smothered chicken"
          className={inputCls}
        />
      </Field>
      <Field label="Web address" htmlFor="slug" hint={`Your post will live at /blog/${slug || "your-title"}`}>
        <input
          id="slug"
          name="slug"
          value={slug}
          onChange={(e) => {
            setSlug(e.target.value);
            setSlugTouched(true);
          }}
          className={inputCls}
        />
      </Field>
      <Field label="Short summary" htmlFor="excerpt" hint="One or two sentences shown on the blog list.">
        <textarea id="excerpt" name="excerpt" rows={2} defaultValue={post?.excerpt} className={inputCls} />
      </Field>
      <ImageField name="cover" removeName="removeCover" current={post?.coverUrl ?? null} label="Cover photo (optional)" />

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-cream">Post</span>
          <div className="flex rounded-full border border-line p-0.5 text-sm">
            {(["write", "preview"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`rounded-full px-4 py-1 capitalize ${tab === t ? "bg-gold text-ink" : "text-muted"}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <textarea
          name="content"
          rows={16}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className={`${inputCls} font-mono text-sm leading-relaxed ${tab === "preview" ? "hidden" : ""}`}
          placeholder={"Write your post here.\n\nTips: put ## at the start of a line for a heading, **two stars** around words for bold, and - for a bullet list."}
        />
        {tab === "preview" && (
          <div className="prose-gold min-h-64 rounded-lg border border-line bg-ink p-5 text-cream/90">
            {content.trim() ? <Markdown>{content}</Markdown> : <p className="text-muted">Nothing to preview yet.</p>}
          </div>
        )}
        <p className="text-xs text-muted">
          Formatting: <code>## Heading</code> · <code>**bold**</code> · <code>*italic*</code> · <code>- list item</code> ·{" "}
          <code>[link text](https://…)</code>
        </p>
      </div>

      <Toggle name="published" label="Published" hint="Turn off to keep it as a draft that only you can see." defaultChecked={post?.published ?? true} />
      <Notice state={state} />
      <SubmitButton>{post ? "Save post" : "Publish post"}</SubmitButton>
    </form>
  );
}

// ---------------------------------------------------------------- owner story

type StoryData = { name: string; title: string; photoUrl: string | null; quote: string; story: string };

export function StoryForm({ s }: { s: StoryData }) {
  const [state, action] = useActionState(saveStoryAction, null);
  const [story, setStory] = useState(s.story);
  const [tab, setTab] = useState<"write" | "preview">("write");
  return (
    <form action={action} className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name" htmlFor="ownerName" hint="Shown as “Meet …” on the Our Story page.">
          <input id="ownerName" name="ownerName" defaultValue={s.name} placeholder="Your first and last name" className={inputCls} />
        </Field>
        <Field label="Your title" htmlFor="ownerTitle">
          <input id="ownerTitle" name="ownerTitle" defaultValue={s.title} placeholder="Owner, Cook & Single Mom of Five" className={inputCls} />
        </Field>
      </div>
      <ImageField name="photo" removeName="removePhoto" current={s.photoUrl} label="Your photo" />
      <Field label="Favorite quote or saying" htmlFor="ownerQuote" hint="Shown large, in gold, at the top of your story.">
        <textarea id="ownerQuote" name="ownerQuote" rows={2} defaultValue={s.quote} className={inputCls} />
      </Field>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-cream">Your story</span>
          <div className="flex rounded-full border border-line p-0.5 text-sm">
            {(["write", "preview"] as const).map((t) => (
              <button key={t} type="button" onClick={() => setTab(t)} className={`rounded-full px-4 py-1 capitalize ${tab === t ? "bg-gold text-ink" : "text-muted"}`}>
                {t}
              </button>
            ))}
          </div>
        </div>
        <textarea
          name="ownerStory"
          rows={14}
          value={story}
          onChange={(e) => setStory(e.target.value)}
          className={`${inputCls} leading-relaxed ${tab === "preview" ? "hidden" : ""}`}
          placeholder="Tell your customers who you are, why you started cooking, and what your grandmothers taught you."
        />
        {tab === "preview" && (
          <div className="prose-gold min-h-64 rounded-lg border border-line bg-ink p-5 text-cream/90">
            {story.trim() ? <Markdown>{story}</Markdown> : <p className="text-muted">Nothing to preview yet.</p>}
          </div>
        )}
        <p className="text-xs text-muted">Leave an empty line between paragraphs. Use **two stars** around words to make them bold.</p>
      </div>
      <Notice state={state} />
      <SubmitButton>Save my story</SubmitButton>
    </form>
  );
}

// ---------------------------------------------------------------- settings

type SettingsData = {
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  announcement: string;
  orderNote: string;
  deliveryEnabled: boolean;
  doordashUrl: string;
  ubereatsUrl: string;
  facebookUrl: string;
  instagramUrl: string;
  tiktokUrl: string;
  linkedinUrl: string;
  whatsappNumber: string;
  hours: DayHours[];
};

export function SettingsForm({ s }: { s: SettingsData }) {
  const [state, action] = useActionState(saveSettingsAction, null);
  const week = [1, 2, 3, 4, 5, 6, 0];
  return (
    <form action={action} className="space-y-10">
      <section className="space-y-5">
        <h2 className="font-serif text-xl font-bold text-gold">Store hours</h2>
        <div className="divide-y divide-line rounded-xl border border-line bg-ink">
          {week.map((d) => (
            <div key={d} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3">
              <span className="w-28 font-semibold text-cream">{DAY_NAMES[d]}</span>
              <label className="flex items-center gap-2 text-sm text-muted">
                <input type="checkbox" name={`open_${d}`} defaultChecked={!s.hours[d].closed} className="accent-[#d4af37]" />
                Open
              </label>
              <input type="time" name={`from_${d}`} defaultValue={s.hours[d].open} aria-label={`${DAY_NAMES[d]} opening time`} className="rounded-lg border border-line bg-coal px-2 py-1.5 text-sm text-cream" />
              <span className="text-muted">to</span>
              <input type="time" name={`to_${d}`} defaultValue={s.hours[d].close} aria-label={`${DAY_NAMES[d]} closing time`} className="rounded-lg border border-line bg-coal px-2 py-1.5 text-sm text-cream" />
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <h2 className="font-serif text-xl font-bold text-gold">Ordering &amp; delivery</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="DoorDash store link" htmlFor="doordashUrl" hint="From your DoorDash Merchant Portal. Adds an “Order on DoorDash” button.">
            <input id="doordashUrl" name="doordashUrl" defaultValue={s.doordashUrl} placeholder="https://www.doordash.com/store/…" className={inputCls} />
          </Field>
          <Field label="Uber Eats store link" htmlFor="ubereatsUrl" hint="From Uber Eats Manager. Adds an “Order on Uber Eats” button.">
            <input id="ubereatsUrl" name="ubereatsUrl" defaultValue={s.ubereatsUrl} placeholder="https://www.ubereats.com/store/…" className={inputCls} />
          </Field>
        </div>
        <p className="text-xs text-muted">
          Leave a link empty until your store is live on that app. As soon as you add one, the website says you offer delivery.
        </p>
        <Toggle
          name="deliveryEnabled"
          label="We also deliver ourselves"
          hint="Only turn this on if your family delivers orders directly (not through DoorDash or Uber Eats)."
          defaultChecked={s.deliveryEnabled}
        />
        <Field label="Ordering note" htmlFor="orderNote" hint="Shown in the Hours & Pickup section.">
          <input id="orderNote" name="orderNote" defaultValue={s.orderNote} className={inputCls} />
        </Field>
        <Field label="Announcement bar" htmlFor="announcement" hint="Optional gold bar at the top of every page, e.g. “Closed Thanksgiving Day”. Leave empty to hide it.">
          <input id="announcement" name="announcement" defaultValue={s.announcement} className={inputCls} />
        </Field>
      </section>

      <section className="space-y-5">
        <div>
          <h2 className="font-serif text-xl font-bold text-gold">Phone &amp; pickup location</h2>
          <p className="mt-1 text-sm text-muted">
            Your city and address help people find you on Google, Apple Maps and AI assistants. Fill in at least your city.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Phone" htmlFor="phone">
            <input id="phone" name="phone" defaultValue={s.phone} className={inputCls} />
          </Field>
          <Field label="Street address" htmlFor="address" hint="Leave empty if you don’t want it on the site yet.">
            <input id="address" name="address" defaultValue={s.address} placeholder="123 Main St" className={inputCls} />
          </Field>
          <Field label="City" htmlFor="city">
            <input id="city" name="city" defaultValue={s.city} placeholder="e.g. Charlotte" className={inputCls} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="State" htmlFor="state">
              <input id="state" name="state" defaultValue={s.state || "NC"} maxLength={2} className={`${inputCls} uppercase`} />
            </Field>
            <Field label="ZIP" htmlFor="zip">
              <input id="zip" name="zip" defaultValue={s.zip} inputMode="numeric" className={inputCls} />
            </Field>
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <div>
          <h2 className="font-serif text-xl font-bold text-gold">Social media</h2>
          <p className="mt-1 text-sm text-muted">Paste your profile links. A button appears on the website for each one you fill in.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Facebook" htmlFor="facebookUrl">
            <input id="facebookUrl" name="facebookUrl" defaultValue={s.facebookUrl} placeholder="https://facebook.com/yourpage" className={inputCls} />
          </Field>
          <Field label="Instagram" htmlFor="instagramUrl">
            <input id="instagramUrl" name="instagramUrl" defaultValue={s.instagramUrl} placeholder="https://instagram.com/yourname" className={inputCls} />
          </Field>
          <Field label="TikTok" htmlFor="tiktokUrl">
            <input id="tiktokUrl" name="tiktokUrl" defaultValue={s.tiktokUrl} placeholder="https://tiktok.com/@yourname" className={inputCls} />
          </Field>
          <Field label="LinkedIn" htmlFor="linkedinUrl">
            <input id="linkedinUrl" name="linkedinUrl" defaultValue={s.linkedinUrl} placeholder="https://linkedin.com/in/yourname" className={inputCls} />
          </Field>
          <Field label="WhatsApp number" htmlFor="whatsappNumber" hint="The number customers can message you on WhatsApp. Leave empty to hide the button.">
            <input id="whatsappNumber" name="whatsappNumber" defaultValue={s.whatsappNumber} inputMode="tel" placeholder="(224) 645-9128" className={inputCls} />
          </Field>
        </div>
      </section>

      <Notice state={state} />
      <SubmitButton>Save settings</SubmitButton>
    </form>
  );
}
