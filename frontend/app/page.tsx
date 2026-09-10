"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Radio,
  BarChart3,
  FileText,
  Settings,
  ShieldCheck,
  Cpu,
  Navigation,
  ArrowRight,
  Activity,
  Zap
} from "lucide-react";

export default function HomePage() {
  const modules = [
    {
      title: "Live Control Dashboard",
      desc: "Real-time 3D perception, dynamic path replanning, obstacle & TTC monitoring.",
      href: "/dashboard",
      icon: LayoutDashboard,
      badge: "Primary Control",
      activeColor: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400 hover:border-emerald-400"
    },
    {
      title: "Vehicle Simulation",
      desc: "Run CARLA / digital twin scenario tests on unstructured Indian road models.",
      href: "/simulation",
      icon: Radio,
      badge: "Interactive",
      activeColor: "from-blue-500/20 to-cyan-500/10 border-blue-500/30 text-blue-400 hover:border-blue-400"
    },
    {
      title: "Analytics & Telemetry",
      desc: "Disengagement ratios, speed variance, jerk limits, and MPC convergence metrics.",
      href: "/analytics",
      icon: BarChart3,
      badge: "Diagnostics",
      activeColor: "from-purple-500/20 to-indigo-500/10 border-purple-500/30 text-purple-400 hover:border-purple-400"
    },
    {
      title: "System Logs & Blackbox",
      desc: "Inspect live sensor dumps, CAN messages, hazard triggers, and audit trails.",
      href: "/system-logs",
      icon: FileText,
      badge: "Auditing",
      activeColor: "from-amber-500/20 to-yellow-500/10 border-amber-500/30 text-amber-400 hover:border-amber-400"
    },
    {
      title: "Configurations & Settings",
      desc: "Adjust sensor weights, EKF fusion matrices, and fail-safe safety buffers.",
      href: "/settings",
      icon: Settings,
      badge: "Config",
      activeColor: "from-zinc-500/20 to-slate-500/10 border-zinc-500/30 text-zinc-300 hover:border-zinc-400"
    }
  ];

  return (
    <div className="min-h-full w-full bg-[#050811] text-slate-100 p-6 md:p-10 flex flex-col justify-between select-none">
      {/* Top Banner / Welcome Header */}
      <div className="max-w-6xl mx-auto w-full space-y-8">
        
        {/* Header Badges */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Team LogicLoom
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-800/80 text-slate-300 border border-slate-700/60">
                SIH26037 • Smart Vehicles
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent pt-2">
              Autonomous Vehicle Central Console
            </h1>
            <p className="text-sm md:text-base text-slate-400 max-w-3xl">
              Adaptive Path Planning &amp; Real-time Collision Avoidance Platform engineered for unstructured, multi-agent Indian road environments.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 px-5 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 shadow-lg shadow-emerald-500/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Activity className="h-4 w-4" />
            Launch Live Dashboard
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* System Quick Stats Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-[#0b101d]/80 border border-slate-800/80 rounded-xl p-4 flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-lg">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400">System State</p>
              <p className="text-sm font-semibold text-emerald-400">Operational (Nominal)</p>
            </div>
          </div>

          <div className="bg-[#0b101d]/80 border border-slate-800/80 rounded-xl p-4 flex items-center gap-3">
            <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-lg">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Core Engine</p>
              <p className="text-sm font-semibold text-slate-200">NMPC + YOLOv8</p>
            </div>
          </div>

          <div className="bg-[#0b101d]/80 border border-slate-800/80 rounded-xl p-4 flex items-center gap-3">
            <div className="p-2.5 bg-cyan-500/10 text-cyan-400 rounded-lg">
              <Navigation className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Trajectory Mode</p>
              <p className="text-sm font-semibold text-slate-200">Adaptive Spline</p>
            </div>
          </div>

          <div className="bg-[#0b101d]/80 border border-slate-800/80 rounded-xl p-4 flex items-center gap-3">
            <div className="p-2.5 bg-purple-500/10 text-purple-400 rounded-lg">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Inference Latency</p>
              <p className="text-sm font-semibold text-purple-400">&lt; 32 ms</p>
            </div>
          </div>
        </div>

        {/* Navigation Section / Cards */}
        <div className="space-y-4 pt-2">
          <h2 className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
            Platform Modules &amp; Subsystems
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules.map((m) => {
              const Icon = m.icon;
              return (
                <Link
                  key={m.href}
                  href={m.href}
                  className={`group relative flex flex-col justify-between p-5 rounded-xl border bg-gradient-to-br transition-all duration-200 hover:shadow-lg hover:shadow-black/40 hover:-translate-y-1 bg-[#0b101d]/90 ${m.activeColor}`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded border border-slate-800 bg-slate-900/60 text-slate-400">
                        {m.badge}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-100 group-hover:text-white transition-colors">
                        {m.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {m.desc}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-400 group-hover:text-slate-200">Open Module</span>
                    <ArrowRight className="h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer / System Health Note */}
      <div className="max-w-6xl mx-auto w-full pt-10 border-t border-slate-800/60 mt-10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <p>© 2026 LogicLoom. All telemetry nodes synchronized.</p>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            Sensors: Active
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            GPS: Locked
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            AI: Online
          </span>
        </div>
      </div>
    </div>
  );
}
