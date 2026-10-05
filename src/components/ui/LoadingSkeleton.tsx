import React from "react";
import { cn } from "../../lib/utils";

export function LoadingSkeleton({
  lines = 4,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={cn("p-6 bg-white rounded-xl border border-slate-200/90 space-y-4 animate-pulse", className)}>
      <div className="h-5 bg-slate-200 rounded-md w-1/3" />
      <div className="space-y-2.5">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="h-4 bg-slate-100 rounded-md"
            style={{ width: `${100 - (i % 3) * 15}%` }}
          />
        ))}
      </div>
    </div>
  );
}
