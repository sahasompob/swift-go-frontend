"use client";
import { Loader2 } from "lucide-react";

export function Spinner({
  size = 20,
  className = "",
}: { size?: number; className?: string }) {
  return (
    <span role="status" aria-live="polite" className={`inline-flex items-center ${className}`}>
      <Loader2 style={{ width: size, height: size }} className="animate-spin" />
      <span className="sr-only">Loading…</span>
    </span>
  );
}
