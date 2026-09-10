"use client";

import { useEffect, useRef, useState } from "react";

interface Vehicle {
  laneX: number;
  z: number;
  speed: number;
  label: string;
  color: string;
}

export default function LiveRoadView() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fps, setFps] = useState(30);
  const [objectCount, setObjectCount] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const horizonY = H * 0.38;
    const roadWidthAtBottom = W * 0.9;
    const roadWidthAtHorizon = 20;

    let frame = 0;
    let animId: number;
    let lastFpsTime = performance.now();
    let fpsFrames = 0;

    const vehicles: Vehicle[] = [
      { laneX: -0.5, z: 0.2, speed: 0.006, label: "Car", color: "#38bdf8" },
      { laneX: 0.5, z: 0.6, speed: 0.004, label: "Auto", color: "#fbbf24" },
      { laneX: -0.3, z: 0.9, speed: 0.005, label: "Two-Wheeler", color: "#f472b6" },
    ];

    function project(laneX: number, z: number) {
      // z: 0 (far/horizon) -> 1 (near/bottom)
      const y = horizonY + z * (H - horizonY);
      const roadHalfWidth = (roadWidthAtHorizon + (roadWidthAtBottom - roadWidthAtHorizon) * z) / 2;
      const x = W / 2 + laneX * roadHalfWidth;
      const scale = 0.15 + z * 0.85;
      return { x, y, scale, roadHalfWidth };
    }

    function draw() {
      if (!ctx || !canvas) return;
      frame++;

      // Sky
      const sky = ctx.createLinearGradient(0, 0, 0, horizonY);
      sky.addColorStop(0, "#0b1220");
      sky.addColorStop(1, "#182236");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, W, horizonY);

      // Ground
      const ground = ctx.createLinearGradient(0, horizonY, 0, H);
      ground.addColorStop(0, "#1a2130");
      ground.addColorStop(1, "#05070c");
      ctx.fillStyle = ground;
      ctx.fillRect(0, horizonY, W, H - horizonY);

      // Road (trapezoid)
      ctx.beginPath();
      ctx.moveTo(W / 2 - roadWidthAtHorizon / 2, horizonY);
      ctx.lineTo(W / 2 + roadWidthAtHorizon / 2, horizonY);
      ctx.lineTo(W / 2 + roadWidthAtBottom / 2, H);
      ctx.lineTo(W / 2 - roadWidthAtBottom / 2, H);
      ctx.closePath();
      ctx.fillStyle = "#14181f";
      ctx.fill();

      // Center dashed line (scrolling)
      const dashOffset = (frame * 1.5) % 40;
      ctx.strokeStyle = "rgba(250,204,21,0.55)";
      for (let z = 0; z < 1; z += 0.02) {
        const zz = (z + dashOffset / 400) % 1;
        const p = project(0, zz);
        const p2 = project(0, Math.min(1, zz + 0.012));
        ctx.lineWidth = 1 + zz * 3;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }

      // Road edges
      ctx.strokeStyle = "rgba(16,185,129,0.4)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(W / 2 - roadWidthAtHorizon / 2, horizonY);
      ctx.lineTo(W / 2 - roadWidthAtBottom / 2, H);
      ctx.moveTo(W / 2 + roadWidthAtHorizon / 2, horizonY);
      ctx.lineTo(W / 2 + roadWidthAtBottom / 2, H);
      ctx.stroke();

      // Horizon glow
      ctx.fillStyle = "rgba(16,185,129,0.08)";
      ctx.fillRect(0, horizonY - 2, W, 3);

      // Update + draw vehicles (far to near for correct overlap)
      vehicles.forEach((v) => {
        v.z += v.speed;
        if (v.z > 1) v.z = 0;
      });
      const sorted = [...vehicles].sort((a, b) => a.z - b.z);

      let visibleCount = 0;
      sorted.forEach((v) => {
        const p = project(v.laneX, v.z);
        const w = 46 * p.scale;
        const h = 30 * p.scale;
        if (p.scale < 0.05) return;
        visibleCount++;

        // Shadow
        ctx.fillStyle = "rgba(0,0,0,0.4)";
        ctx.beginPath();
        ctx.ellipse(p.x, p.y + h * 0.45, w * 0.55, h * 0.18, 0, 0, Math.PI * 2);
        ctx.fill();

        // Body
        ctx.fillStyle = v.color;
        ctx.beginPath();
        ctx.roundRect(p.x - w / 2, p.y - h, w, h, 4 * p.scale);
        ctx.fill();

        // Windshield
        ctx.fillStyle = "rgba(255,255,255,0.25)";
        ctx.fillRect(p.x - w * 0.3, p.y - h * 0.85, w * 0.6, h * 0.3);

        // Bounding box + label (detection HUD style)
        ctx.strokeStyle = "#10b981";
        ctx.lineWidth = 1.2;
        ctx.strokeRect(p.x - w / 2 - 4, p.y - h - 4, w + 8, h + 8);

        if (p.scale > 0.35) {
          ctx.font = `${Math.max(9, 10 * p.scale)}px monospace`;
          const text = `${v.label}`;
          const tw = ctx.measureText(text).width + 6;
          ctx.fillStyle = "rgba(16,185,129,0.9)";
          ctx.fillRect(p.x - w / 2 - 4, p.y - h - 20, tw, 14);
          ctx.fillStyle = "#000";
          ctx.fillText(text, p.x - w / 2 - 1, p.y - h - 9);
        }
      });
      setObjectCount(visibleCount);

      // Vignette
      const vg = ctx.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, H);
      vg.addColorStop(0, "rgba(0,0,0,0)");
      vg.addColorStop(1, "rgba(0,0,0,0.45)");
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, W, H);

      // Scanlines
      ctx.fillStyle = "rgba(0,0,0,0.04)";
      for (let y = 0; y < H; y += 3) ctx.fillRect(0, y, W, 1);

      // HUD crosshair center
      ctx.strokeStyle = "rgba(16,185,129,0.25)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(W / 2 - 10, horizonY + 4);
      ctx.lineTo(W / 2 + 10, horizonY + 4);
      ctx.moveTo(W / 2, horizonY - 6);
      ctx.lineTo(W / 2, horizonY + 14);
      ctx.stroke();

      // FPS tracking
      fpsFrames++;
      const now = performance.now();
      if (now - lastFpsTime > 500) {
        setFps(Math.round((fpsFrames * 1000) / (now - lastFpsTime)));
        fpsFrames = 0;
        lastFpsTime = now;
      }

      animId = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="relative w-full h-full min-h-[320px] rounded-xl overflow-hidden bg-black">
      <canvas ref={canvasRef} width={960} height={480} className="w-full h-full object-cover" />

      {/* Top-left: LIVE badge */}
      <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/60 backdrop-blur px-2.5 py-1 rounded text-xs border border-white/10">
        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        <span className="text-white font-semibold tracking-wide">LIVE</span>
      </div>

      {/* Top-right: camera id + fps */}
      <div className="absolute top-3 right-3 flex flex-col items-end gap-1 text-xs font-mono">
        <div className="bg-black/60 backdrop-blur px-2 py-1 rounded text-emerald-400 border border-white/10">
          CAM_FRONT_01
        </div>
        <div className="bg-black/60 backdrop-blur px-2 py-1 rounded text-slate-400 border border-white/10">
          {fps} FPS
        </div>
      </div>

      {/* Bottom-left: detection count */}
      <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur px-2.5 py-1 rounded text-xs border border-white/10 text-slate-300">
        Objects Tracked: <span className="text-emerald-400 font-semibold">{objectCount}</span>
      </div>

      {/* Bottom-right: timestamp */}
      <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur px-2.5 py-1 rounded text-xs border border-white/10 text-slate-400 font-mono">
        {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
}