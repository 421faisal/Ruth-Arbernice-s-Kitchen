"use client";
import { useEffect, useState } from "react";
import { openStatus, type DayHours } from "@/lib/hours";

/** Live "Open now / Closed" badge, computed in Illinois time on the visitor's device. */
export function OpenStatus({ hours, className = "" }: { hours: DayHours[]; className?: string }) {
  const [status, setStatus] = useState<{ open: boolean; text: string } | null>(null);
  useEffect(() => {
    const update = () => setStatus(openStatus(hours));
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, [hours]);

  if (!status) return <span className={`inline-block h-7 ${className}`} aria-hidden />;
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-sm ${
        status.open ? "border-ok/40 text-ok" : "border-line text-muted"
      } ${className}`}
    >
      <span className={`h-2 w-2 rounded-full ${status.open ? "bg-ok animate-pulse" : "bg-muted/60"}`} aria-hidden />
      {status.text}
    </span>
  );
}
