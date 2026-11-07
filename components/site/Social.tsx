import { socialLinks } from "@/lib/seo";

type Key = "facebook" | "instagram" | "tiktok" | "whatsapp" | "linkedin";

const ICONS: Record<Key, React.ReactNode> = {
  facebook: <path fill="currentColor" d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.8v3h2.6V21h3.1z" />,
  instagram: (
    <g fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="0.6" fill="currentColor" stroke="none" />
    </g>
  ),
  tiktok: <path fill="currentColor" d="M16.6 3c.3 2.1 1.6 3.6 3.9 3.8v3c-1.4.1-2.7-.3-3.9-1v6.1a5.6 5.6 0 1 1-5.6-5.6c.3 0 .6 0 .9.1v3.1a2.6 2.6 0 1 0 1.7 2.4V3h3z" />,
  whatsapp: (
    <g>
      <path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" d="M4.2 19.8l1.1-3.9A8.2 8.2 0 1 1 8.4 19z" />
      <path fill="currentColor" d="M9.3 7.9c.2-.4.4-.4.6-.4h.5c.2 0 .4 0 .5.4l.7 1.6c.1.2.1.4 0 .6l-.4.6c-.1.2-.2.3 0 .6.5.9 1.3 1.6 2.2 2.1.3.1.4.1.6-.1l.6-.7c.2-.2.3-.2.5-.1l1.6.8c.2.1.4.2.4.4 0 .5-.2 1.3-.8 1.7-.6.4-1.4.6-2.6.2-2.6-.9-4.3-3.1-4.9-4.3-.6-1.2-.2-2.6.5-3.4z" />
    </g>
  ),
  linkedin: (
    <path
      fill="currentColor"
      d="M5 9.2h3.1V19H5V9.2zM6.6 4.5a1.8 1.8 0 1 1 0 3.6 1.8 1.8 0 0 1 0-3.6zM10 9.2h3v1.4c.4-.8 1.5-1.6 3-1.6 3.2 0 3.8 2.1 3.8 4.8V19h-3.1v-4.6c0-1.1 0-2.5-1.5-2.5s-1.8 1.2-1.8 2.4V19H10V9.2z"
    />
  ),
};

export function SocialIcon({ name, className = "h-5 w-5" }: { name: Key; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      {ICONS[name]}
    </svg>
  );
}

/** Round gold buttons for every social profile the owner has filled in. */
export function SocialButtons({
  social,
  size = "md",
  className = "",
}: {
  social: { facebook: string; instagram: string; tiktok: string; whatsapp: string; linkedin: string };
  size?: "md" | "lg";
  className?: string;
}) {
  const links = socialLinks(social);
  if (!links.length) return null;
  const box = size === "lg" ? "h-14 w-14" : "h-11 w-11";
  return (
    <ul className={`flex flex-wrap gap-3 ${className}`}>
      {links.map((l) => (
        <li key={l.key}>
          <a
            href={l.href}
            target="_blank"
            rel="noopener noreferrer me"
            aria-label={`${l.label}: Ruth ’N’ Arbernise’s Kitchen`}
            title={l.label}
            className={`group relative inline-flex ${box} items-center justify-center rounded-full border border-gold/35 text-gold transition duration-500 hover:-translate-y-1 hover:border-gold hover:bg-gold hover:text-ink hover:shadow-[0_10px_30px_-8px_rgba(212,175,55,0.7)]`}
          >
            <SocialIcon name={l.key} className={size === "lg" ? "h-6 w-6" : "h-5 w-5"} />
          </a>
        </li>
      ))}
    </ul>
  );
}
