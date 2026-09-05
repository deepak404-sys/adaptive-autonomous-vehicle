"use client";

import { Locate, Camera, Maximize2 } from "lucide-react";
import Road from "./Road";
import Vehicle from "./Vehicle";
import PathLine from "./Path";
import Obstacle from "./Obstacle";
import Pedestrian from "./Pedestrian";

const DETECTIONS = [
  { label: "CAR", distance: "18m", x: 8, y: 42, width: 16, height: 22, color: "#38bdf8" },
  { label: "AUTO", distance: "24m", x: 32, y: 30, width: 13, height: 18, color: "#fb923c" },
  { label: "COW", distance: "12m", x: 58, y: 46, width: 12, height: 16, color: "#f87171" },
  { label: "2-WHEELER", distance: "20m", x: 74, y: 34, width: 13, height: 18, color: "#c084fc" },
];

const POTHOLES = [
  { x: 46, y: 68 },
  { x: 61, y: 80 },
];

export default function Scene() {
  return (
    <div className="relative flex-1 min-h-[24rem] overflow-hidden rounded-xl border border-white/10 bg-[#070b12]">
      {/* Header row */}
      <div className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between px-4 py-3">
        <span className="text-xs font-bold uppercase tracking-wide text-white">
          Live Road View / Simulation
        </span>
        <div className="flex items-center gap-2">
          <button className="flex h-7 w-7 items-center justify-center rounded-md bg-white/5 text-slate-300 hover:bg-white/10">
            <Locate size={14} strokeWidth={2} />
          </button>
          <button className="flex h-7 w-7 items-center justify-center rounded-md bg-white/5 text-slate-300 hover:bg-white/10">
            <Camera size={14} strokeWidth={2} />
          </button>
          <button className="flex h-7 w-7 items-center justify-center rounded-md bg-white/5 text-slate-300 hover:bg-white/10">
            <Maximize2 size={14} strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* SVG road scene: static road + ego vehicle + trajectory */}
      <svg
        viewBox="0 0 400 300"
        preserveAspectRatio="xMidYMax slice"
        className="absolute inset-0 h-full w-full"
      >
        <Road />
        <Vehicle />
        <PathLine />
      </svg>

      {/* Pothole markers (India-specific road hazard) */}
      {POTHOLES.map((p, i) => (
        <Obstacle
          key={`pothole-${i}`}
          variant="pothole"
          label="Pothole detected"
          x={p.x}
          y={p.y}
          color="#fbbf24"
        />
      ))}

      {/* Detected object bounding boxes (India-specific: auto-rickshaw, stray animal) */}
      {DETECTIONS.map((d) => (
        <Obstacle
          key={d.label}
          label={d.label}
          distance={d.distance}
          x={d.x}
          y={d.y}
          width={d.width}
          height={d.height}
          color={d.color}
        />
      ))}

      {/* Pedestrian, distinct highlight styling */}
      <Pedestrian distance="8m" x={88} y={38} />
    </div>
  );
}