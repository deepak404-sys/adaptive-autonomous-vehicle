"use client";

import { useEffect, useRef, useState } from "react";

type Level = "info" | "warn" | "error" | "success";

interface LogEntry {
  id: number;
  time: string;
  level: Level;
  source: string;
  message: string;
}

const sources = ["Perception", "Path Planner", "GPS", "AI Module", "Sensors", "Network", "Battery"];

const messagePool: { level: Level; source: string; message: string }[] = [
  { level: "info", source: "Perception", message: "Object detected: CAR entering range" },
  { level: "info", source: "Path Planner", message: "Trajectory recalculated" },
  { level: "warn", source: "Perception", message: "Obstacle proximity increasing" },
  { level: "error", source: "Sensors", message: "LiDAR frame drop detected" },
  { level: "success", source: "GPS", message: "Position lock acquired" },
  { level: "info", source: "AI Module", message: "Inference cycle completed in 42ms" },
  { level: "warn", source: "Network", message: "Latency spike on telemetry link" },
  { level: "success", source: "Path Planner", message: "Lane change completed safely" },
  { level: "error", source: "Battery", message: "Cell temperature above threshold" },
  { level: "info", source: "Perception", message: "Pedestrian tracking initiated" },
  { level: "warn", source: "AI Module", message: "Confidence score below optimal range" },
  { level: "success", source: "Sensors", message: "Calibration check passed" },
];

let idCounter = 1;

function generateLog(): LogEntry {
  const pick = messagePool[Math.floor(Math.random() * messagePool.length)];
  return {
    id: idCounter++,
    time: new Date().toLocaleTimeString(),
    level: pick.level,
    source: pick.source,
    message: pick.message,
  };
}

const levelStyles: Record<Level, string> = {
  info: "text-sky-400 bg-sky-500/10 border-sky-500/30",
  warn: "text-orange-400 bg-orange-500/10 border-orange-500/30",
  error: "text-red-400 bg-red-500/10 border-red-500/30",
  success: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
};

export default function SystemLogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [paused, setPaused] = useState(false);
  const [levelFilter, setLevelFilter] = useState<Level | "all">("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const autoScroll = useRef(true);

  useEffect(() => {
    setLogs(Array.from({ length: 8 }).map(() => generateLog()));

    const interval = setInterval(() => {
      if (paused) return;
      setLogs((prev) => [...prev, generateLog()].slice(-200));
    }, 1200);

    return () => clearInterval(interval);
  }, [paused]);

  useEffect(() => {
    if (autoScroll.current && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  function handleScroll() {
    const el = scrollRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 40;
    autoScroll.current = atBottom;
  }

  const filtered = logs.filter((l) => {
    if (levelFilter !== "all" && l.level !== levelFilter) return false;
    if (sourceFilter !== "all" && l.source !== sourceFilter) return false;
    if (search && !l.message.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const counts = {
    info: logs.filter((l) => l.level === "info").length,
    warn: logs.filter((l) => l.level === "warn").length,
    error: logs.filter((l) => l.level === "error").length,
    success: logs.filter((l) => l.level === "success").length,
  };

  function exportLogs() {
    const text = logs
      .map((l) => `[${l.time}] ${l.level.toUpperCase()} (${l.source}) ${l.message}`)
      .join("\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `system-logs-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="text-white">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold mb-1">System Logs</h1>
          <p className="text-slate-400 text-sm">
            Real-time system events across perception, planning, and hardware modules
          </p>
        </div>
        <button
          onClick={() => setPaused((p) => !p)}
          className={`px-4 py-2 rounded font-medium text-sm transition ${
            paused
              ? "bg-emerald-600 hover:bg-emerald-500"
              : "bg-white/10 hover:bg-white/20 text-slate-200"
          }`}
        >
          {paused ? "Resume Stream" : "Pause Stream"}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="bg-white/5 border border-white/10 rounded-lg p-3">
          <div className="text-xs text-slate-400">Info</div>
          <div className="text-xl font-bold text-sky-400">{counts.info}</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-lg p-3">
          <div className="text-xs text-slate-400">Warnings</div>
          <div className="text-xl font-bold text-orange-400">{counts.warn}</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-lg p-3">
          <div className="text-xs text-slate-400">Errors</div>
          <div className="text-xl font-bold text-red-400">{counts.error}</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-lg p-3">
          <div className="text-xs text-slate-400">Success</div>
          <div className="text-xl font-bold text-emerald-400">{counts.success}</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-3 items-center">
        <input
          type="text"
          placeholder="Search logs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-white/5 border border-white/10 rounded px-3 py-1.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50 flex-1 min-w-[160px]"
        />

        <select
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value as Level | "all")}
          className="bg-white/5 border border-white/10 rounded px-3 py-1.5 text-sm text-slate-300 focus:outline-none"
        >
          <option value="all">All Levels</option>
          <option value="info">Info</option>
          <option value="warn">Warning</option>
          <option value="error">Error</option>
          <option value="success">Success</option>
        </select>

        <select
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value)}
          className="bg-white/5 border border-white/10 rounded px-3 py-1.5 text-sm text-slate-300 focus:outline-none"
        >
          <option value="all">All Sources</option>
          {sources.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <button
          onClick={exportLogs}
          className="px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 text-sm text-slate-200 transition"
        >
          Export .txt
        </button>
      </div>

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="bg-black/40 border border-white/10 rounded-lg h-[420px] overflow-y-auto font-mono text-xs"
      >
        {filtered.length === 0 && (
          <div className="p-4 text-slate-500">No logs match the current filter.</div>
        )}
        {filtered.map((log) => (
          <div
            key={log.id}
            className="flex items-start gap-3 px-4 py-2 border-b border-white/5 hover:bg-white/5"
          >
            <span className="text-slate-500 shrink-0">{log.time}</span>
            <span
              className={`shrink-0 px-1.5 py-0.5 rounded border text-[10px] font-semibold uppercase ${levelStyles[log.level]}`}
            >
              {log.level}
            </span>
            <span className="text-slate-400 shrink-0 w-28">{log.source}</span>
            <span className="text-slate-200">{log.message}</span>
          </div>
        ))}
      </div>

      {!autoScroll.current && (
        <div className="text-xs text-slate-500 mt-2">
          Auto-scroll paused — scroll to bottom to resume
        </div>
      )}
    </div>
  );
}