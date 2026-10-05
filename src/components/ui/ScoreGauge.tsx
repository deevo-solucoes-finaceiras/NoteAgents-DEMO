import React from "react";
import { cn } from "../../lib/utils";

interface ScoreCategory {
  name: string;
  score: number;
  color?: string;
}

interface ScoreGaugeProps {
  score: number;
  maxScore?: number;
  label?: string;
  categories?: ScoreCategory[];
  onClick?: () => void;
  className?: string;
}

export function ScoreGauge({
  score,
  maxScore = 100,
  label = "Pronto para produção",
  categories = [],
  onClick,
  className,
}: ScoreGaugeProps) {
  const percentage = Math.round((score / maxScore) * 100);
  const strokeWidth = 8;
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick();
        }
      }}
      className={cn(
        "bg-white rounded-xl border border-slate-200/90 p-5 transition-all",
        onClick && "cursor-pointer hover:border-blue-300 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
        className
      )}
    >
      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* Circular Gauge */}
        <div className="relative flex flex-col items-center justify-center shrink-0">
          <svg className="w-28 h-28 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              className="text-slate-100"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="text-emerald-500 transition-all duration-700 ease-out"
              fill="transparent"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
              {score}<span className="text-xs text-slate-400 font-normal">/{maxScore}</span>
            </span>
          </div>
          <p className="mt-1 text-[11px] font-medium text-emerald-600 tracking-tight">
            {label}
          </p>
        </div>

        {/* Category Breakdown */}
        {categories.length > 0 && (
          <div className="flex-1 w-full grid grid-cols-2 gap-y-2 gap-x-4">
            {categories.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: cat.color || "#2563EB" }}
                  />
                  {cat.name}
                </span>
                <span className="font-semibold text-slate-900 tabular-nums">
                  {cat.score}%
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
