"use client";

import { useEffect, useState } from "react";
import { Radio, Bell, Settings } from "lucide-react";

export default function Header() {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const update = () =>
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      );
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="flex h-[76px] items-center justify-between border-b border-white/5 bg-[#0b0f17] px-6">
      {/* Logo + title */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5">
          <Radio size={20} className="text-white" strokeWidth={1.8} />
        </div>
        <div className="leading-tight">
          <h1 className="text-lg font-bold uppercase tracking-wide text-white">
            Autonomous Vehicle
          </h1>
          <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
            Control Dashboard
          </p>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <span className="text-xs font-semibold text-emerald-400">LIVE</span>
        </div>

        <span className="text-sm font-medium text-slate-300 tabular-nums">
          {time}
        </span>

        <button
          type="button"
          className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
        >
          <Bell size={18} strokeWidth={2} />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-red-500" />
        </button>

        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
        >
          <Settings size={18} strokeWidth={2} />
        </button>
      </div>
    </header>
  );
}