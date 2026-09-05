"use client";

import { Gauge, TriangleAlert, Timer, Bot } from "lucide-react";

function Sparkline({
  data,
  color,
}: {
  data: number[];
  color: string;
}) {
  const width = 100;
  const height = 28;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data
    .map((value, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full h-7"
      preserveAspectRatio="none"
    >
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const SPEED_HISTORY = [24, 28, 26, 30, 33, 31, 32, 34, 32];
const RISK_HISTORY = [20, 35, 30, 45, 50, 42, 48, 55, 50];
const TTC_HISTORY = [4.1, 3.8, 3.9, 3.5, 3.6, 3.3, 3.4, 3.2, 3.2];

export interface StatCardsData {
  speedKmh: number;
  riskLevel: "Low" | "Medium" | "High";
  ttcSec: number;
  driveMode: "Autonomous" | "Manual" | "Assisted";
}

const DEFAULT_DATA: StatCardsData = {
  speedKmh: 32,
  riskLevel: "Medium",
  ttcSec: 3.2,
  driveMode: "Autonomous",
};

function riskColor(level: StatCardsData["riskLevel"]) {
  if (level === "Low") return { text: "text-emerald-400", line: "#4ade80" };
  if (level === "Medium") return { text: "text-amber-400", line: "#fbbf24" };
  return { text: "text-red-400", line: "#f87171" };
}

export default function StatCardsRow({
  data = DEFAULT_DATA,
}: {
  data?: StatCardsData;
}) {
  const risk = riskColor(data.riskLevel);

  return (
    <div className="grid grid-cols-4 gap-4">
      {/* Speed */}
      <div className="rounded-xl border border-white/10 bg-[#0d1520] p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Speed
            </p>
            <p className="mt-1 text-2xl font-bold text-white">
              {data.speedKmh}
              <span className="ml-1 text-sm font-medium text-slate-400">
                km/h
              </span>
            </p>
          </div>
          <Gauge size={22} className="text-slate-500" strokeWidth={2} />
        </div>
        <div className="mt-2">
          <Sparkline data={SPEED_HISTORY} color="#4ade80" />
        </div>
      </div>

      {/* Risk Level */}
      <div className="rounded-xl border border-white/10 bg-[#0d1520] p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Risk Level
            </p>
            <p className={`mt-1 text-2xl font-bold ${risk.text}`}>
              {data.riskLevel}
            </p>
          </div>
          <TriangleAlert size={22} className={risk.text} strokeWidth={2} />
        </div>
        <div className="mt-2">
          <Sparkline data={RISK_HISTORY} color={risk.line} />
        </div>
      </div>

      {/* TTC */}
      <div className="rounded-xl border border-white/10 bg-[#0d1520] p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              TTC
            </p>
            <p className="mt-1 text-2xl font-bold text-white">
              {data.ttcSec}
              <span className="ml-1 text-sm font-medium text-slate-400">
                sec
              </span>
            </p>
          </div>
          <Timer size={22} className="text-sky-400" strokeWidth={2} />
        </div>
        <div className="mt-2">
          <Sparkline data={TTC_HISTORY} color="#38bdf8" />
        </div>
      </div>

      {/* Drive Mode */}
      <div className="rounded-xl border border-white/10 bg-[#0d1520] p-4 flex flex-col justify-center">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Drive Mode
          </p>
          <Bot size={20} className="text-emerald-400" strokeWidth={2} />
        </div>
        <p className="mt-1 text-2xl font-bold uppercase text-emerald-400">
          {data.driveMode}
        </p>
      </div>
    </div>
  );
}