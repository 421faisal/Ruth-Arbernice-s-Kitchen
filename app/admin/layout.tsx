import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Owner dashboard", template: "%s · Owner dashboard" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: LayoutProps<"/admin">) {
  return <div className="min-h-full flex-1 bg-coal">{children}</div>;
}
