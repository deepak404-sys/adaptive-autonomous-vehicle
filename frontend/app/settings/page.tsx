"use client";

import { useState } from "react";

type Tab = "general" | "sensors" | "notifications" | "display" | "about";

export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>("general");

  // General
  const [vehicleName, setVehicleName] = useState("Autonomous Vehicle 01");
  const [driveMode, setDriveMode] = useState<"autonomous" | "manual" | "assisted">("autonomous");
  const [units, setUnits] = useState<"metric" | "imperial">("metric");

  // Sensors
  const [lidar, setLidar] = useState(true);
  const [camera, setCamera] = useState(true);
  const [ultrasonic, setUltrasonic] = useState(true);
  const [gps, setGps] = useState(true);
  const [sensitivity, setSensitivity] = useState(70);

  // Notifications
  const [alertSound, setAlertSound] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(true);
  const [riskThreshold, setRiskThreshold] = useState(60);
  const [emailReports, setEmailReports] = useState(false);

  // Display
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [showFps, setShowFps] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [cameraView, setCameraView] = useState<"camera" | "perception">("perception");

  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "general", label: "General" },
    { id: "sensors", label: "Sensors" },
    { id: "notifications", label: "Notifications" },
    { id: "display", label: "Display" },
    { id: "about", label: "About" },
  ];

  return (
    <div className="text-white max-w-4xl">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold mb-1">Settings</h1>
          <p className="text-slate-400 text-sm">
            Configure vehicle behavior, sensors, and dashboard preferences
          </p>
        </div>
        <button
          onClick={handleSave}
          className="px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-500 transition font-medium text-sm"
        >
          {saved ? "Saved ✓" : "Save Changes"}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-white/10">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
              tab === t.id
                ? "border-emerald-500 text-emerald-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* General */}
      {tab === "general" && (
        <div className="space-y-5">
          <Field label="Vehicle Name">
            <input
              type="text"
              value={vehicleName}
              onChange={(e) => setVehicleName(e.target.value)}
              className="input"
            />
          </Field>

          <Field label="Drive Mode">
            <div className="flex gap-2">
              {(["autonomous", "assisted", "manual"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setDriveMode(m)}
                  className={`px-3 py-1.5 rounded text-sm capitalize transition ${
                    driveMode === m
                      ? "bg-emerald-600 text-white"
                      : "bg-white/5 text-slate-300 hover:bg-white/10"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Units">
            <div className="flex gap-2">
              {(["metric", "imperial"] as const).map((u) => (
                <button
                  key={u}
                  onClick={() => setUnits(u)}
                  className={`px-3 py-1.5 rounded text-sm capitalize transition ${
                    units === u
                      ? "bg-emerald-600 text-white"
                      : "bg-white/5 text-slate-300 hover:bg-white/10"
                  }`}
                >
                  {u === "metric" ? "Metric (km/h)" : "Imperial (mph)"}
                </button>
              ))}
            </div>
          </Field>
        </div>
      )}

      {/* Sensors */}
      {tab === "sensors" && (
        <div className="space-y-5">
          <ToggleRow label="LiDAR" desc="Front and rear LiDAR scanning" value={lidar} onChange={setLidar} />
          <ToggleRow label="Camera Array" desc="Object detection camera feed" value={camera} onChange={setCamera} />
          <ToggleRow label="Ultrasonic Sensors" desc="Short-range obstacle detection" value={ultrasonic} onChange={setUltrasonic} />
          <ToggleRow label="GPS Module" desc="Positioning and waypoint tracking" value={gps} onChange={setGps} />

          <Field label={`Detection Sensitivity — ${sensitivity}%`}>
            <input
              type="range"
              min={0}
              max={100}
              value={sensitivity}
              onChange={(e) => setSensitivity(Number(e.target.value))}
              className="w-full"
            />
          </Field>
        </div>
      )}

      {/* Notifications */}
      {tab === "notifications" && (
        <div className="space-y-5">
          <ToggleRow label="Alert Sound" desc="Play sound on high-risk events" value={alertSound} onChange={setAlertSound} />
          <ToggleRow label="Push Alerts" desc="Show in-app notification banners" value={pushAlerts} onChange={setPushAlerts} />
          <ToggleRow label="Email Reports" desc="Daily summary sent to registered email" value={emailReports} onChange={setEmailReports} />

          <Field label={`Risk Alert Threshold — ${riskThreshold}%`}>
            <input
              type="range"
              min={0}
              max={100}
              value={riskThreshold}
              onChange={(e) => setRiskThreshold(Number(e.target.value))}
              className="w-full"
            />
            <p className="text-xs text-slate-500 mt-1">
              Trigger an alert when risk score exceeds this value
            </p>
          </Field>
        </div>
      )}

      {/* Display */}
      {tab === "display" && (
        <div className="space-y-5">
          <Field label="Theme">
            <div className="flex gap-2">
              {(["dark", "light"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`px-3 py-1.5 rounded text-sm capitalize transition ${
                    theme === t
                      ? "bg-emerald-600 text-white"
                      : "bg-white/5 text-slate-300 hover:bg-white/10"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            {theme === "light" && (
              <p className="text-xs text-orange-400 mt-1">
                Light theme preview only — full support coming soon
              </p>
            )}
          </Field>

          <Field label="Default Camera View">
            <div className="flex gap-2">
              {(["perception", "camera"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setCameraView(v)}
                  className={`px-3 py-1.5 rounded text-sm capitalize transition ${
                    cameraView === v
                      ? "bg-emerald-600 text-white"
                      : "bg-white/5 text-slate-300 hover:bg-white/10"
                  }`}
                >
                  {v === "perception" ? "3D Perception" : "Camera View"}
                </button>
              ))}
            </div>
          </Field>

          <ToggleRow label="Show FPS Counter" desc="Display live rendering FPS on 3D view" value={showFps} onChange={setShowFps} />
          <ToggleRow label="Show Grid Overlay" desc="Display reference grid on visualizations" value={showGrid} onChange={setShowGrid} />
        </div>
      )}

      {/* About */}
      {tab === "about" && (
        <div className="space-y-4">
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <div className="text-sm text-slate-400 mb-1">System Version</div>
            <div className="font-mono text-emerald-400">v1.0.0-beta</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <div className="text-sm text-slate-400 mb-1">Build</div>
            <div className="font-mono text-slate-300">Next.js 16.3.3 · Turbopack</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <div className="text-sm text-slate-400 mb-1">Rendering Engine</div>
            <div className="font-mono text-slate-300">Three.js · React Three Fiber</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <div className="text-sm text-slate-400 mb-2">Project</div>
            <div className="text-slate-300 text-sm">
              Adaptive Autonomous Vehicle — Control Dashboard
            </div>
            <div className="text-slate-500 text-xs mt-1">
              Built for Smart India Hackathon
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        :global(.input) {
          width: 100%;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0.375rem;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          color: white;
        }
        :global(.input:focus) {
          outline: none;
          border-color: rgba(16, 185, 129, 0.5);
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm text-slate-300 font-medium mb-2">{label}</label>
      {children}
    </div>
  );
}

function ToggleRow({
  label,
  desc,
  value,
  onChange,
}: {
  label: string;
  desc: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg p-3">
      <div>
        <div className="text-sm font-medium text-white">{label}</div>
        <div className="text-xs text-slate-500">{desc}</div>
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`w-11 h-6 rounded-full transition relative shrink-0 ${
          value ? "bg-emerald-600" : "bg-white/10"
        }`}
      >
        <span
          className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
            value ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}