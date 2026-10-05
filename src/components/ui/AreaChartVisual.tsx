import React, { useState } from "react";
import { cn } from "../../lib/utils";

interface DataPoint {
  label: string;
  value: number;
}

const DEFAULT_SERIES_30D: DataPoint[] = [
  { label: "01", value: 12 },
  { label: "04", value: 18 },
  { label: "07", value: 14 },
  { label: "10", value: 25 },
  { label: "13", value: 20 },
  { label: "16", value: 34 },
  { label: "19", value: 28 },
  { label: "22", value: 42 },
  { label: "25", value: 38 },
  { label: "28", value: 45 },
  { label: "30", value: 40 },
];

const DEFAULT_SERIES_7D: DataPoint[] = [
  { label: "Seg", value: 24 },
  { label: "Ter", value: 31 },
  { label: "Qua", value: 28 },
  { label: "Qui", value: 42 },
  { label: "Sex", value: 39 },
  { label: "Sáb", value: 18 },
  { label: "Dom", value: 15 },
];

export function AreaChartVisual({ className }: { className?: string }) {
  const [period, setPeriod] = useState<"30d" | "7d">("30d");
  const [hoveredPoint, setHoveredPoint] = useState<DataPoint | null>(null);

  const data = period === "30d" ? DEFAULT_SERIES_30D : DEFAULT_SERIES_7D;
  const maxValue = Math.max(...data.map((d) => d.value), 50);

  // SVG dimensions
  const width = 500;
  const height = 180;
  const paddingX = 20;
  const paddingY = 25;

  const points = data.map((d, index) => {
    const x = paddingX + (index / (data.length - 1)) * (width - 2 * paddingX);
    const y = height - paddingY - (d.value / maxValue) * (height - 2 * paddingY);
    return { x, y, data: d };
  });

  const pathD = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, "");

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

  return (
    <div className={cn("bg-white rounded-xl border border-slate-200/90 p-5", className)}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            Execuções dos Agentes
          </h3>
          <p className="text-xs text-slate-500">
            Volume de automações em pipelines ativos
          </p>
        </div>

        {/* Period Selector Filter Control */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200/60">
          <button
            onClick={() => setPeriod("30d")}
            className={cn(
              "px-2.5 py-1 text-xs font-medium rounded-md transition-colors",
              period === "30d"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            Últimos 30 dias
          </button>
          <button
            onClick={() => setPeriod("7d")}
            className={cn(
              "px-2.5 py-1 text-xs font-medium rounded-md transition-colors",
              period === "7d"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            7 dias
          </button>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-44 overflow-visible"
        >
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563EB" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line
            x1={paddingX}
            y1={paddingY}
            x2={width - paddingX}
            y2={paddingY}
            stroke="#F1F5F9"
            strokeDasharray="4 4"
          />
          <line
            x1={paddingX}
            y1={height / 2}
            x2={width - paddingX}
            y2={height / 2}
            stroke="#F1F5F9"
            strokeDasharray="4 4"
          />
          <line
            x1={paddingX}
            y1={height - paddingY}
            x2={width - paddingX}
            y2={height - paddingY}
            stroke="#E2E8F0"
          />

          {/* Area Fill */}
          <path d={areaD} fill="url(#areaGradient)" />

          {/* Line Stroke */}
          <path
            d={pathD}
            fill="none"
            stroke="#2563EB"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Interactive Points */}
          {points.map((p, idx) => (
            <g key={idx}>
              <circle
                cx={p.x}
                cy={p.y}
                r={hoveredPoint?.label === p.data.label ? "5" : "3.5"}
                className={cn(
                  "cursor-pointer transition-all fill-white stroke-blue-600",
                  hoveredPoint?.label === p.data.label ? "stroke-[3px]" : "stroke-[2px]"
                )}
                onMouseEnter={() => setHoveredPoint(p.data)}
                onMouseLeave={() => setHoveredPoint(null)}
              />
              <text
                x={p.x}
                y={height - 6}
                textAnchor="middle"
                className="text-[10px] fill-slate-400 font-mono"
              >
                {p.data.label}
              </text>
            </g>
          ))}
        </svg>

        {/* Hover Tooltip */}
        {hoveredPoint && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-2.5 py-1 rounded-md shadow-md flex items-center gap-2 pointer-events-none">
            <span className="text-slate-300">Dia {hoveredPoint.label}:</span>
            <span className="font-bold tabular-nums">{hoveredPoint.value} execuções</span>
          </div>
        )}
      </div>
    </div>
  );
}
