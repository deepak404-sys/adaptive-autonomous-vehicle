

"use client";

import { useEffect, useRef, useState } from "react";

interface DataPoint {
  t: number;
  speed: number;
  risk: number;
}

export default function AnalyticsPage() {
  const [data, setData] = useState<DataPoint[]>([]);
  const [totalDistance, setTotalDistance] = useState(0);
  const [avoidCount, setAvoidCount] = useState(0);
  const [uptime, setUptime] = useState(0);
  const tRef = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      tRef.current += 1;
      const speed = 3 + Math.sin(tRef.current / 4) * 2 + Math.random() * 0.8;
      const risk = Math.max(
        0,
        Math.min(100, 30 + Math.sin(tRef.current / 3) * 25 + Math.random() * 15)
      );

      setData((prev) => {
        const next = [...prev, { t: tRef.current, speed, risk }];
        return next.slice(-40);
      });

      setTotalDistance((d) => d + speed / 10);
      setUptime((u) => u + 1);
      if (risk > 70) setAvoidCount((c) => c + 1);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const maxSpeed = 8;
  const chartW = 640;
  const chartH = 180;

  function pointsForSeries(key: "speed" | "risk", max: number) {
    if (data.length < 2) return "";
    return data
      .map((d, i) => {
        const x = (i / (data.length - 1)) * chartW;
        const y = chartH - (d[key] / max) * chartH;
        return `${x},${y}`;
      })
      .join(" ");
  }

  const avgSpeed =
    data.length > 0 ? (data.reduce((a, d) => a + d.speed, 0) / data.length).toFixed(1) : "0.0";
  const avgRisk =
    data.length > 0 ? Math.round(data.reduce((a, d) => a + d.risk, 0) / data.length) : 0;
  const peakRisk = data.length > 0 ? Math.round(Math.max(...data.map((d) => d.risk))) : 0;

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="text-white">
      <h1 className="text-xl font-bold mb-1">Analytics</h1>
      <p className="text-slate-400 text-sm mb-5">
        Session telemetry, risk trends, and performance summary
      </p>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Distance Covered" value={`${totalDistance.toFixed(1)} m`} accent="emerald" />
        <StatCard label="Avg Speed" value={`${avgSpeed} m/s`} accent="sky" />
        <StatCard label="Avoidance Events" value={`${avoidCount}`} accent="orange" />
        <StatCard label="Session Time" value={formatTime(uptime)} accent="violet" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Speed chart */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-slate-300 font-medium">Speed (m/s)</span>
            <span className="text-xs text-slate-500">last 20s</span>
          </div>
          <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full h-40">
            {[0, 1, 2, 3].map((i) => (
              <line
                key={i}
                x1={0}
                x2={chartW}
                y1={(chartH / 3) * i}
                y2={(chartH / 3) * i}
                stroke="rgba(255,255,255,0.06)"
              />
            ))}
            <polyline
              points={pointsForSeries("speed", maxSpeed)}
              fill="none"
              stroke="#38bdf8"
              strokeWidth={2}
            />
          </svg>
        </div>

        {/* Risk chart */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-slate-300 font-medium">Risk Score (%)</span>
            <span className="text-xs text-slate-500">last 20s</span>
          </div>
          <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full h-40">
            {[0, 1, 2, 3].map((i) => (
              <line
                key={i}
                x1={0}
                x2={chartW}
                y1={(chartH / 3) * i}
                y2={(chartH / 3) * i}
                stroke="rgba(255,255,255,0.06)"
              />
            ))}
            <polygon
              points={`0,${chartH} ${pointsForSeries("risk", 100)} ${chartW},${chartH}`}
              fill="rgba(239,68,68,0.15)"
            />
            <polyline
              points={pointsForSeries("risk", 100)}
              fill="none"
              stroke="#ef4444"
              strokeWidth={2}
            />
          </svg>
        </div>
      </div>

      {/* Summary table */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
        <div className="text-sm text-slate-300 font-medium mb-3">Session Summary</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-3 text-sm">
          <SummaryRow label="Average Risk" value={`${avgRisk}%`} />
          <SummaryRow label="Peak Risk" value={`${peakRisk}%`} />
          <SummaryRow label="Data Points" value={`${data.length}`} />
          <SummaryRow
            label="System State"
            value={avgRisk > 50 ? "Elevated" : "Nominal"}
            color={avgRisk > 50 ? "text-orange-400" : "text-emerald-400"}
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: "emerald" | "sky" | "orange" | "violet";
}) {
  const colors: Record<string, string> = {
    emerald: "text-emerald-400",
    sky: "text-sky-400",
    orange: "text-orange-400",
    violet: "text-violet-400",
  };
  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
      <div className="text-xs text-slate-400 uppercase tracking-wide mb-1">{label}</div>
      <div className={`text-2xl font-bold ${colors[accent]}`}>{value}</div>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div>
      <div className="text-xs text-slate-500">{label}</div>
      <div className={`font-medium ${color ?? "text-white"}`}>{value}</div>
    </div>
  );
}