"use client";

import { useEffect, useRef, useState } from "react";

interface Obstacle {
  x: number;
  y: number;
  radius: number;
  vy: number;
  type: "static" | "moving";
}

interface LogEntry {
  time: string;
  message: string;
  level: "info" | "warn" | "danger";
}

export default function SimulationPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [running, setRunning] = useState(true);
  const [speed, setSpeed] = useState(3);
  const [status, setStatus] = useState("Cruising");
  const [risk, setRisk] = useState(0);
  const [distance, setDistance] = useState(0);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const lastLogRef = useRef("");

  const vehicle = useRef({ x: 60, y: 300, targetY: 300, angle: 0 });
  const laps = useRef(0);

  const obstacles = useRef<Obstacle[]>([
    { x: 280, y: 300, radius: 18, vy: 1.2, type: "moving" },
    { x: 460, y: 180, radius: 22, vy: 0, type: "static" },
    { x: 650, y: 300, radius: 16, vy: -1.5, type: "moving" },
    { x: 820, y: 400, radius: 20, vy: 0, type: "static" },
  ]);

  function addLog(message: string, level: LogEntry["level"] = "info") {
    if (lastLogRef.current === message) return;
    lastLogRef.current = message;
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [{ time, message, level }, ...prev].slice(0, 6));
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let frame = 0;

    function draw() {
      if (!ctx || !canvas) return;
      frame++;

      // Background
      const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      grad.addColorStop(0, "#020617");
      grad.addColorStop(1, "#0a0f1e");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid
      ctx.strokeStyle = "rgba(16,185,129,0.06)";
      for (let x = 0; x < canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Road lane
      ctx.fillStyle = "rgba(255,255,255,0.02)";
      ctx.fillRect(0, 260, canvas.width, 120);
      ctx.strokeStyle = "rgba(16,185,129,0.35)";
      ctx.lineWidth = 2;
      ctx.setLineDash([10, 10]);
      ctx.beginPath();
      ctx.moveTo(0, 320);
      ctx.lineTo(canvas.width, 320);
      ctx.stroke();
      ctx.setLineDash([]);

      const v = vehicle.current;

      // Update obstacles (moving ones oscillate vertically)
      obstacles.current.forEach((o) => {
        if (o.type === "moving") {
          o.y += o.vy;
          if (o.y < 220 || o.y > 400) o.vy *= -1;
        }
      });

      let nearestDist = Infinity;
      let dangerLevel = 0;
      let avoiding = false;

      if (running) {
        v.targetY = 320;

        obstacles.current.forEach((o) => {
          const dx = o.x - v.x;
          const dy = o.y - v.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dx > -20 && dx < 160) {
            nearestDist = Math.min(nearestDist, dist);
          }
          if (dx > 0 && dx < 140 && Math.abs(dy) < 70) {
            v.targetY = o.y > 320 ? 240 : 400;
            avoiding = true;
          }
        });

        if (nearestDist < 200) {
          dangerLevel = Math.max(0, Math.min(100, 100 - (nearestDist - 20) / 1.6));
        }

        v.y += (v.targetY - v.y) * 0.06;
        v.angle = (v.targetY - v.y) * 0.02;
        v.x += speed;
        setDistance((d) => d + speed / 20);

        if (v.x > canvas.width - 40) {
          v.x = 60;
          laps.current++;
          addLog(`Lap ${laps.current} completed`, "info");
        }
      }

      setRisk(Math.round(dangerLevel));
      if (avoiding) {
        setStatus("Avoiding obstacle");
        if (dangerLevel > 60) addLog("High risk — obstacle proximity critical", "danger");
        else addLog("Steering around obstacle", "warn");
      } else {
        setStatus("Cruising");
      }

      // Sensor cone (radar sweep)
      const sweepAngle = (frame * 0.03) % (Math.PI * 2);
      const coneGrad = ctx.createRadialGradient(v.x, v.y, 0, v.x, v.y, 180);
      coneGrad.addColorStop(0, "rgba(16,185,129,0.15)");
      coneGrad.addColorStop(1, "rgba(16,185,129,0)");
      ctx.fillStyle = coneGrad;
      ctx.beginPath();
      ctx.moveTo(v.x, v.y);
      ctx.arc(v.x, v.y, 180, sweepAngle - 0.5, sweepAngle + 0.5);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = "rgba(16,185,129,0.15)";
      ctx.beginPath();
      ctx.arc(v.x, v.y, 140, 0, Math.PI * 2);
      ctx.stroke();

      // Obstacles with pulse + risk glow
      obstacles.current.forEach((o) => {
        const dx = o.x - v.x;
        const dy = o.y - v.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const isClose = dist < 160;

        if (isClose) {
          const glow = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.radius * 2.5);
          glow.addColorStop(0, "rgba(239,68,68,0.4)");
          glow.addColorStop(1, "rgba(239,68,68,0)");
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(o.x, o.y, o.radius * 2.5, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(o.x, o.y, o.radius, 0, Math.PI * 2);
        ctx.fillStyle = o.type === "moving" ? "#f97316" : "#ef4444";
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.3)";
        ctx.stroke();
      });

      // Vehicle body
      ctx.save();
      ctx.translate(v.x, v.y);
      ctx.rotate(v.angle);

      const bodyGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, 30);
      bodyGlow.addColorStop(0, "rgba(16,185,129,0.5)");
      bodyGlow.addColorStop(1, "rgba(16,185,129,0)");
      ctx.fillStyle = bodyGlow;
      ctx.beginPath();
      ctx.arc(0, 0, 30, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#10b981";
      ctx.beginPath();
      ctx.moveTo(18, 0);
      ctx.lineTo(-12, -10);
      ctx.lineTo(-6, 0);
      ctx.lineTo(-12, 10);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      animationId = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(animationId);
  }, [running, speed]);

  return (
    <div className="text-white">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold mb-1">Simulation</h1>
          <p className="text-slate-400 text-sm">
            Real-time sensor sweep, obstacle prediction, and adaptive path correction
          </p>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-400 uppercase tracking-wide">Status</div>
          <div
            className={`font-semibold ${
              status === "Cruising" ? "text-emerald-400" : "text-orange-400"
            }`}
          >
            {status}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Main canvas */}
        <div className="lg:col-span-3">
          <div className="flex gap-3 mb-3 items-center">
            <button
              onClick={() => setRunning((r) => !r)}
              className="px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-500 transition font-medium"
            >
              {running ? "Pause" : "Resume"}
            </button>
            <div className="flex items-center gap-2 text-sm text-slate-300">
              Speed
              <input
                type="range"
                min={1}
                max={6}
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
              />
            </div>
          </div>

          <canvas
            ref={canvasRef}
            width={960}
            height={520}
            className="w-full rounded-lg border border-white/10"
          />
        </div>

        {/* Telemetry sidebar */}
        <div className="space-y-4">
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <div className="text-xs text-slate-400 uppercase tracking-wide mb-2">
              Risk Level
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-1">
              <div
                className={`h-full transition-all ${
                  risk > 60 ? "bg-red-500" : risk > 25 ? "bg-orange-400" : "bg-emerald-500"
                }`}
                style={{ width: `${risk}%` }}
              />
            </div>
            <div className="text-2xl font-bold">{risk}%</div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Speed</span>
              <span className="font-medium">{speed} m/s</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Distance</span>
              <span className="font-medium">{distance.toFixed(1)} m</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Obstacles Tracked</span>
              <span className="font-medium">{obstacles.current.length}</span>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <div className="text-xs text-slate-400 uppercase tracking-wide mb-2">
              Event Log
            </div>
            <div className="space-y-1.5 text-xs max-h-40 overflow-y-auto">
              {logs.length === 0 && <div className="text-slate-500">No events yet</div>}
              {logs.map((log, i) => (
                <div key={i} className="flex gap-2">
                  <span className="text-slate-500 shrink-0">{log.time}</span>
                  <span
                    className={
                      log.level === "danger"
                        ? "text-red-400"
                        : log.level === "warn"
                        ? "text-orange-400"
                        : "text-slate-300"
                    }
                  >
                    {log.message}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}