"use client";

import { MapPin } from "lucide-react";

type PathState = "ON_TRACK" | "REPLANNING" | "BLOCKED";

interface PathStatusData {
  status: PathState;
  reason: string;
  confidence: number; // 0-100
  nextWaypoint: number; // meters
}

const statusConfig: Record<PathState, { label: string; color: string }> = {
  ON_TRACK: { label: "ON TRACK", color: "text-green-400" },
  REPLANNING: { label: "REPLANNING", color: "text-yellow-400" },
  BLOCKED: { label: "BLOCKED", color: "text-red-400" },
};

const mockData: PathStatusData = {
  status: "REPLANNING",
  reason: "Obstacle Detected",
  confidence: 92,
  nextWaypoint: 120,
};

export default function PathStatus({
  data = mockData,
}: {
  data?: PathStatusData;
}) {
  const config = statusConfig[data.status];

  return (
    <div className="bg-[#0d1520] border border-white/10 rounded-xl px-6 py-4 flex items-center justify-between gap-6 flex-wrap">
      {/* Path Status */}
      <div className="flex flex-col gap-1">
        <span className="text-[11px] tracking-wide text-white/40">
          PATH STATUS
        </span>
        <span className={`text-sm font-semibold ${config.color}`}>
          {config.label}
        </span>
      </div>

      {/* Reason */}
      <div className="flex flex-col gap-1">
        <span className="text-[11px] tracking-wide text-white/40">
          REASON
        </span>
        <span className="text-sm font-medium text-white/90">
          {data.reason}
        </span>
      </div>

      {/* Confidence */}
      <div className="flex flex-col gap-1 min-w-[140px]">
        <span className="text-[11px] tracking-wide text-white/40">
          CONFIDENCE
        </span>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-green-400 transition-all"
              style={{ width: `${data.confidence}%` }}
            />
          </div>
          <span className="text-xs text-white/70">{data.confidence}%</span>
        </div>
      </div>

      {/* Next Waypoint */}
      <div className="flex items-center gap-2">
        <MapPin className="w-4 h-4 text-blue-400" />
        <div className="flex flex-col gap-1">
          <span className="text-[11px] tracking-wide text-white/40">
            NEXT WAYPOINT
          </span>
          <span className="text-sm font-medium text-white/90">
            {data.nextWaypoint} m
          </span>
        </div>
      </div>
    </div>
  );
}