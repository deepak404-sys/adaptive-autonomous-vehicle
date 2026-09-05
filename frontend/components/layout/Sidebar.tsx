"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  RadioTower,
  BarChart3,
  FileText,
  Settings,
  Octagon,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Simulation", href: "/simulation", icon: RadioTower },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "System Logs", href: "/system-logs", icon: FileText },
  { label: "Settings", href: "/settings", icon: Settings },
];

const SYSTEM_STATUS = [
  { label: "Connection", value: "Live" },
  { label: "Sensors", value: "Active" },
  { label: "GPS", value: "Locked" },
  { label: "AI Module", value: "Active" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 flex h-screen w-60 flex-col justify-between overflow-y-auto border-r border-white/5 bg-[#0b0f17] px-4 py-5">
      {/* Nav */}
      <div>
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
            const active = pathname?.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  active
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                }`}
              >
                <Icon size={18} strokeWidth={2} />
                <span className="font-medium">{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom: system status + emergency stop */}
      <div className="flex flex-col gap-4">
        <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
          <div className="mb-3 flex items-center gap-2">
            <span className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
              System Status
            </span>
          </div>
          <div className="mb-3 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-sm font-semibold text-emerald-400">
              Operational
            </span>
          </div>
          <div className="flex flex-col gap-1.5">
            {SYSTEM_STATUS.map(({ label, value }) => (
              <div
                key={label}
                className="flex items-center justify-between text-xs"
              >
                <span className="text-slate-500">{label}</span>
                <span className="font-medium text-emerald-400">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          className="flex items-center justify-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 py-2.5 text-sm font-semibold text-red-400 transition-colors hover:bg-red-500/20"
        >
          <Octagon size={16} strokeWidth={2} />
          Emergency Stop
        </button>
      </div>
    </aside>
  );
}