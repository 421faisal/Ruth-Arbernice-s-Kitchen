"use client";

import { useState, type ReactNode } from "react";
import { useFormStatus } from "react-dom";
import type { ActionState } from "@/app/admin/actions";

export const inputCls =
  "w-full rounded-lg border border-line bg-ink px-3.5 py-2.5 text-cream placeholder:text-muted/60 focus:border-gold focus:outline-none";

export function Field({ label, hint, children, htmlFor }: { label: string; hint?: string; children: ReactNode; htmlFor?: string }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="block text-sm font-semibold text-cream">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-muted">{hint}</p>}
    </div>
  );
}

export function Toggle({ name, label, defaultChecked, hint }: { name: string; label: string; defaultChecked?: boolean; hint?: string }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-line bg-ink px-4 py-3">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="mt-1 h-4 w-4 accent-[#d4af37]" />
      <span>
        <span className="block text-sm font-semibold text-cream">{label}</span>
        {hint && <span className="block text-xs text-muted">{hint}</span>}
      </span>
    </label>
  );
}

export function SubmitButton({ children, pendingText = "Saving…", className = "" }: { children: ReactNode; pendingText?: string; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`rounded-full bg-gold px-6 py-2.5 font-semibold text-ink transition hover:bg-gold-light disabled:opacity-60 ${className}`}
    >
      {pending ? pendingText : children}
    </button>
  );
}

export function Notice({ state }: { state: ActionState }) {
  if (!state?.message) return null;
  return (
    <p
      role={state.ok ? "status" : "alert"}
      className={`rounded-lg border px-4 py-3 text-sm ${state.ok ? "border-ok/40 bg-ok/10 text-ok" : "border-red-400/40 bg-red-500/10 text-red-300"}`}
    >
      {state.message}
    </p>
  );
}

/** Photo picker with a live preview and a "remove photo" option. */
export function ImageField({ name, removeName, current, label }: { name: string; removeName: string; current: string | null; label: string }) {
  const [preview, setPreview] = useState<string | null>(current);
  const [removed, setRemoved] = useState(false);
  return (
    <div className="space-y-2">
      <span className="block text-sm font-semibold text-cream">{label}</span>
      <div className="flex flex-wrap items-start gap-4">
        <div className="flex h-36 w-48 items-center justify-center overflow-hidden rounded-xl border border-line bg-ink">
          {preview && !removed ? (
            <img src={preview} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="px-3 text-center text-xs text-muted">No photo yet</span>
          )}
        </div>
        <div className="space-y-2">
          <label className="inline-block cursor-pointer rounded-full border border-gold/60 px-4 py-2 text-sm font-semibold text-gold hover:bg-gold/10">
            {current || preview ? "Choose a different photo" : "Upload a photo"}
            <input
              type="file"
              name={name}
              accept="image/*"
              className="sr-only"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) {
                  setPreview(URL.createObjectURL(f));
                  setRemoved(false);
                }
              }}
            />
          </label>
          <p className="text-xs text-muted">JPG, PNG or a photo from your phone. Up to 10 MB.</p>
          {current && (
            <label className="flex items-center gap-2 text-sm text-muted">
              <input type="checkbox" name={removeName} checked={removed} onChange={(e) => setRemoved(e.target.checked)} className="accent-[#d4af37]" />
              Remove photo
            </label>
          )}
        </div>
      </div>
    </div>
  );
}

export function ConfirmDelete({ action, id, what }: { action: (fd: FormData) => Promise<void>; id: string; what: string }) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(`Delete ${what}? This can't be undone.`)) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="rounded-full border border-red-400/50 px-5 py-2.5 text-sm font-semibold text-red-300 hover:bg-red-500/10">
        Delete
      </button>
    </form>
  );
}
