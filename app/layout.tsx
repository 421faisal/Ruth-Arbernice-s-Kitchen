import type { Metadata, Viewport } from "next";
import { DM_Sans, Fraunces, Yellowtail } from "next/font/google";
import "./globals.css";

const body = DM_Sans({ variable: "--font-body", subsets: ["latin"] });
const display = Fraunces({ variable: "--font-display", subsets: ["latin"], weight: ["400", "600", "700", "800"], style: ["normal", "italic"] });
const script = Yellowtail({ variable: "--font-script", subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL || "http://localhost:3000"),
  title: {
    default: "Ruth ’N’ Arbernise’s Kitchen · Rooted in Illinois",
    template: "%s · Ruth ’N’ Arbernise’s Kitchen",
  },
  description:
    "Family-owned Southern & soul food kitchen in North Carolina, rooted in Illinois. Fried chicken, baked chicken, Mississippi pot roast and classic sides. Call (224) 645-9128 to order.",
  twitter: { card: "summary_large_image" },
  openGraph: {
    type: "website",
    siteName: "Ruth ’N’ Arbernise’s Kitchen",
    locale: "en_US",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Ruth ’N’ Arbernise’s Kitchen: Southern fried chicken, family owned in North Carolina" }],
  },
};

export const viewport: Viewport = { themeColor: "#070605" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${body.variable} ${display.variable} ${script.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        {/* Marks that JS is running so scroll-reveal animations never hide content when it isn't. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        {children}
      </body>
    </html>
  );
}
