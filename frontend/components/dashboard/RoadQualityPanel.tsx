"use client";

import { Construction, Route, AlertTriangle } from "lucide-react";

export interface RoadQualityData {
  surfaceCondition: "Smooth" | "Rough" | "Damaged";
  potholeDetected: boolean;
  potholeDistance?: number; // meters
  speedBreakerDistance?: number; // meters, undefined if none ahead
  laneConfidence: number; // 0-100
  laneMarkingsPresent: boolean;
}

const DEFAULT_DATA: RoadQualityData = {
  surfaceCondition: "Rough",
  potholeDetected: true,
  potholeDistance: 15,
  speedBreakerDistance: 40,
  laneConfidence: 38,
  laneMarkingsPresent: false,
};

function surfaceColor(condition: RoadQualityData["surfaceCondition"]) {
  if (condition === "Smooth") return "text-emerald-400";
  if (condition === "Rough") return "text-amber-400";
  return "text-red-400";
}

function laneConfidenceColor(value: number) {
  if (value >= 70) return { bar: "bg-emerald-400", text: "text-emerald-400" };
  if (value >= 40) return { bar: "bg-amber-400", text: "text-amber-400" };
  return { bar: "bg-red-400", text: "text-red-400" };
}

export default function RoadQualityPanel({
  data = DEFAULT_DATA,
}: {
  data?: RoadQualityData;
}) {
  const laneColor = laneConfidenceColor(data.laneConfidence);

  return (
    <div className="rounded-2xl border border-white/5 bg-[#0d1220] p-5">
      <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-white">
        Road Quality
      </h3>

      {/* Surface condition */}
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm text-slate-400">Surface Condition</span>
        <span
          className={`text-sm font-semibold ${surfaceColor(
            data.surfaceCondition
          )}`}
        >
          {data.surfaceCondition}
        </span>
      </div>

      {/* Lane confidence bar */}
      <div className="mb-4">
        <div className="mb-1.5 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-sm text-slate-400">
            <Route size={14} strokeWidth={2} />
            Lane Confidence
          </span>
          <span className={`text-sm font-semibold ${laneColor.text}`}>
            {data.laneConfidence}%
          </span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-white/5">
          <div
            className={`h-1.5 rounded-full ${laneColor.bar}`}
            style={{ width: `${data.laneConfidence}%` }}
          />
        </div>
        {!data.laneMarkingsPresent && (
          <p className="mt-1.5 text-xs text-slate-500">
            Unmarked road — path estimated from road edges
          </p>
        )}
      </div>

      {/* Alerts: pothole + speed breaker */}
      <div className="flex flex-col gap-2">
        {data.potholeDetected && (
          <div className="flex items-start gap-2.5 rounded-lg border border-amber-400/20 bg-amber-400/10 px-3 py-2">
            <AlertTriangle
              size={16}
              className="mt-0.5 shrink-0 text-amber-400"
              strokeWidth={2}
            />
            <div>
              <p className="text-sm font-semibold text-amber-400">
                Pothole Detected
              </p>
              <p className="text-xs text-slate-400">
                {data.potholeDistance}m ahead — adjusting path
              </p>
            </div>
          </div>
        )}

        {data.speedBreakerDistance !== undefined && (
          <div className="flex items-start gap-2.5 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2">
            <Construction
              size={16}
              className="mt-0.5 shrink-0 text-slate-400"
              strokeWidth={2}
            />
            <div>
              <p className="text-sm font-semibold text-slate-200">
                Speed Breaker
              </p>
              <p className="text-xs text-slate-400">
                {data.speedBreakerDistance}m ahead — reduce speed
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}