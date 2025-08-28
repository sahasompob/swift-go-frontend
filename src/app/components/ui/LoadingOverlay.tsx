"use client";

import { Loader2 } from "lucide-react";

type Props = {
  show: boolean;
  label?: string;
  blocking?: boolean;
  blur?: boolean;
};

export function LoadingOverlay({
  show,
  label = "Loading…",
  blocking = true,
  blur = true,
}: Props) {
  if (!show) return null;

  return (
    <div
      className={[
        "fixed inset-0 z-[60] flex items-center justify-center",
        "bg-background/60",
        blur ? "backdrop-blur-sm" : "",
        blocking ? "pointer-events-auto" : "pointer-events-none",
      ].join(" ")}
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex items-center gap-3 rounded-lg border bg-card px-4 py-3 shadow pointer-events-auto">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
    </div>
  );
}
