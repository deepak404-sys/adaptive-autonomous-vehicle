"use client";

import { AlertTriangle, AlertOctagon, Info, ArrowRight } from "lucide-react";

type AlertSeverity = "warning" | "critical" | "info";

interface Alert {
  id: string;
  severity: AlertSeverity;
  title: string;
  message: string;
  timestamp: string;
}
const severityConfig: Record<AlertSeverity, { icon: React.ElementType; bg: string; iconColor: string }> = {
  warning: {
    icon: AlertTriangle,
    bg: "bg-yellow-500/15",
    iconColor: "text-yellow-400",
  },
  critical: {
    icon: AlertOctagon,
    bg: "bg-red-500/15",
    iconColor: "text-red-400",
  },
  info: {
    icon: Info,
    bg: "bg-blue-500/15",
    iconColor: "text-blue-400",
  },
};

const mockAlerts: Alert[] = [
  {
    id: "1",
    severity: "warning",
    title: "Obstacle Detected",
    message: "Replanning path",
    timestamp: "10:42:12 AM",
  },
  {
    id: "2",
    severity: "critical",
    title: "High Risk Situation",
    message: "TTC below 2 sec",
    timestamp: "10:41:58 AM",
  },
  {
    id: "3",
    severity: "info",
    title: "Path Recalculated",
    message: "New optimal path generated",
    timestamp: "10:41:45 AM",
  },
];

export default function AlertPanel({ alerts = mockAlerts }: { alerts?: Alert[] }) {
  return (
    <div className="bg-[#0d1520] border border-white/10 rounded-xl p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold tracking-wide text-white/90">
          RECENT ALERTS
        </h2>
      </div>

      <div className="flex flex-col divide-y divide-white/5">
        {alerts.map((alert) => {
          const config = severityConfig[alert.severity];
          const Icon = config.icon;

          return (
            <div
              key={alert.id}
              className="flex items-start gap-3 py-3 first:pt-0 last:pb-0"
            >
              <div
                className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${config.bg}`}
              >
                <Icon className={`w-4 h-4 ${config.iconColor}`} />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white/90">
                  {alert.title}
                </p>
                <p className="text-xs text-white/50 mt-0.5">
                  {alert.message}
                </p>
              </div>

              <span className="text-xs text-white/40 whitespace-nowrap shrink-0">
                {alert.timestamp}
              </span>
            </div>
          );
        })}
      </div>

      <button className="flex items-center justify-end gap-1 text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors mt-1">
        View All Alerts
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}