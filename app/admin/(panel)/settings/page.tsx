import type { Metadata } from "next";
import { Suspense } from "react";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { parseHours } from "@/lib/hours";
import { SettingsForm } from "@/components/admin/forms";

export const metadata: Metadata = { title: "Hours & settings" };

export default function SettingsPage() {
  return (
    <Suspense fallback={<p className="text-muted">Loading…</p>}>
      <Settings />
    </Suspense>
  );
}

async function Settings() {
  await requireAdmin();
  const s = await db.settings.findUnique({ where: { id: "site" } });
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-cream">Hours &amp; settings</h1>
        <p className="mt-1 text-muted">Hours, pickup location, social media links and the announcement bar.</p>
      </div>
      <div className="rounded-2xl border border-line bg-ink p-6 sm:p-8">
        <SettingsForm
          s={{
            phone: s?.phone ?? "",
            address: s?.address ?? "",
            city: s?.city ?? "",
            state: s?.state ?? "NC",
            zip: s?.zip ?? "",
            announcement: s?.announcement ?? "",
            orderNote: s?.orderNote ?? "",
            deliveryEnabled: s?.deliveryEnabled ?? false,
            doordashUrl: s?.doordashUrl ?? "",
            ubereatsUrl: s?.ubereatsUrl ?? "",
            facebookUrl: s?.facebookUrl ?? "",
            instagramUrl: s?.instagramUrl ?? "",
            tiktokUrl: s?.tiktokUrl ?? "",
            linkedinUrl: s?.linkedinUrl ?? "",
            whatsappNumber: s?.whatsappNumber ?? "",
            hours: parseHours(s?.hoursJson),
          }}
        />
      </div>
    </div>
  );
}
