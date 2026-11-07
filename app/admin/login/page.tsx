import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/admin/forms";

export const metadata: Metadata = { title: "Log in" };

export default function LoginPage() {
  return (
    <div className="gold-pattern flex min-h-screen items-center justify-center px-5 py-12">
      <div className="w-full max-w-sm space-y-6 rounded-2xl border border-line bg-ink p-8 shadow-2xl">
        <img src="/brand/logo-primary-gold.png" alt="Ruth ’N’ Arbernise’s Kitchen" className="mx-auto w-44" />
        <div className="text-center">
          <h1 className="font-serif text-2xl font-bold text-cream">Owner login</h1>
          <p className="mt-1 text-sm text-muted">Update your menu, prices, photos, hours and blog.</p>
        </div>
        <LoginForm />
        <p className="text-center text-sm">
          <Link href="/" className="text-gold hover:underline">
            ← Back to the website
          </Link>
        </p>
      </div>
    </div>
  );
}
