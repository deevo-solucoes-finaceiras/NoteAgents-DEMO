import React from "react";
import { cn } from "../../lib/utils";

interface MetricCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  iconColorClass?: string;
  trend?: string;
  onClick?: () => void;
  className?: string;
}

export function MetricCard({
  label,
  value,
  icon,
  iconColorClass = "bg-blue-50 text-blue-600 border-blue-100",
  trend,
  onClick,
  className,
}: MetricCardProps) {
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
        "bg-white rounded-xl border border-slate-200/90 p-4 transition-all duration-150 flex items-center justify-between",
        onClick && "cursor-pointer hover:border-blue-300 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
        className
      )}
    >
      <div className="flex items-center gap-3.5">
        <div
          className={cn(
            "w-11 h-11 rounded-lg flex items-center justify-center border shrink-0 text-xl",
            iconColorClass
          )}
        >
          {icon}
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500">{label}</p>
          <p className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
            {value}
          </p>
        </div>
      </div>

      {trend && (
        <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100 tabular-nums">
          {trend}
        </span>
      )}
    </div>
  );
}
