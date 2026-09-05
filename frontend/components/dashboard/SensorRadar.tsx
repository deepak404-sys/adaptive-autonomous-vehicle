"use client";

import { useEffect, useState } from "react";

interface RadarObject {
  id: string;
  label: string;
  type: "car" | "bike" | "pedestrian" | "sign";
  bearing: number; // 0 = top (12 o'clock), clockwise
  distance: number; // 0-100 (0 = center, 100 = edge)
}

const typeColor: Record<RadarObject["type"], string> = {
  car: "#60a5fa",
  bike: "#fb923c",
  pedestrian: "#c084fc",
  sign: "#4ade80",
};

const CENTER = 100;
const MAX_RADIUS = 90;
const SWEEP_DURATION = 4; // seconds per rotation

function bearingToCartesian(bearingDeg: number, radius: number) {
  const rad = (bearingDeg * Math.PI) / 180;
  return {
    x: CENTER + radius * Math.sin(rad),
    y: CENTER - radius * Math.cos(rad),
  };
}

const initialObjects: RadarObject[] = [
  { id: "car-1", label: "Car · 24m", type: "car", bearing: 20, distance: 70 },
  { id: "car-2", label: "Car · 18m", type: "car", bearing: 340, distance: 50 },
  { id: "bike-1", label: "Bike · 12m", type: "bike", bearing: 60, distance: 35 },
  { id: "ped-1", label: "Pedestrian · 8m", type: "pedestrian", bearing: 90, distance: 22 },
  { id: "sign-1", label: "Sign · 40m", type: "sign", bearing: 250, distance: 85 },
];

export default function SensorRadar({
  objects,
  size = 160,
  live = true,
}: {
  objects?: RadarObject[];
  size?: number;
  live?: boolean;
}) {
  const [data, setData] = useState<RadarObject[]>(objects ?? initialObjects);
  const [selected, setSelected] = useState<RadarObject | null>(null);

  // Simulate live movement when no external data is supplied
  useEffect(() => {
    if (objects || !live) return;
    const interval = setInterval(() => {
      setData((prev) =>
        prev.map((obj) => ({
          ...obj,
          bearing: (obj.bearing + (Math.random() * 16 - 8) + 360) % 360,
          distance: Math.min(
            92,
            Math.max(15, obj.distance + (Math.random() * 10 - 5))
          ),
        }))
      );
    }, 1800);
    return () => clearInterval(interval);
  }, [objects, live]);

  useEffect(() => {
    if (objects) setData(objects);
  }, [objects]);

  const rings = [18, 36, 54, 72, 90];

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 200 200">
        <defs>
          <radialGradient id="sweepTrail" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(74,222,128,0.35)" />
            <stop offset="100%" stopColor="rgba(74,222,128,0)" />
          </radialGradient>
          <filter id="dotGlow" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* grid rings */}
        {rings.map((r) => (
          <circle
            key={r}
            cx={CENTER}
            cy={CENTER}
            r={r}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={1}
          />
        ))}
        {/* crosshair */}
        <line x1={CENTER} y1={10} x2={CENTER} y2={190} stroke="rgba(255,255,255,0.06)" />
        <line x1={10} y1={CENTER} x2={190} y2={CENTER} stroke="rgba(255,255,255,0.06)" />

        {/* rotating sweep */}
        <g
          style={{
            transformOrigin: "100px 100px",
            animation: `radarSpin ${SWEEP_DURATION}s linear infinite`,
          }}
        >
          <path
            d={`M ${CENTER} ${CENTER} L ${CENTER} ${CENTER - MAX_RADIUS} A ${MAX_RADIUS} ${MAX_RADIUS} 0 0 1 ${
              bearingToCartesian(35, MAX_RADIUS).x
            } ${bearingToCartesian(35, MAX_RADIUS).y} Z`}
            fill="url(#sweepTrail)"
          />
          <line
            x1={CENTER}
            y1={CENTER}
            x2={CENTER}
            y2={CENTER - MAX_RADIUS}
            stroke="rgba(74,222,128,0.7)"
            strokeWidth={1.5}
          />
        </g>

        {/* center dot */}
        <circle cx={CENTER} cy={CENTER} r={4} fill="#5eead4" filter="url(#dotGlow)" />

        {/* object blips */}
        {data.map((obj) => {
          const pos = bearingToCartesian(obj.bearing, obj.distance);
          const color = typeColor[obj.type];
          const delay = -((obj.bearing / 360) * SWEEP_DURATION);
          const isSelected = selected?.id === obj.id;

          return (
            <g
              key={obj.id}
              className="cursor-pointer"
              onClick={() => setSelected(isSelected ? null : obj)}
            >
              <circle
                cx={pos.x}
                cy={pos.y}
                r={isSelected ? 6 : 4}
                fill={color}
                filter="url(#dotGlow)"
                style={{
                  animation: `radarBlipFlash ${SWEEP_DURATION}s linear infinite`,
                  animationDelay: `${delay}s`,
                  transition: "r 0.2s ease",
                }}
              />
              {isSelected && (
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={10}
                  fill="none"
                  stroke={color}
                  strokeWidth={1}
                  opacity={0.6}
                />
              )}
            </g>
          );
        })}
      </svg>

      {selected && (
        <div className="absolute bottom-0 left-0 right-0 text-center text-[11px] text-white/80 bg-black/40 rounded px-2 py-1">
          {selected.label}
        </div>
      )}

      <style jsx>{`
        @keyframes radarSpin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes radarBlipFlash {
          0% {
            opacity: 0.55;
          }
          4% {
            opacity: 1;
          }
          10% {
            opacity: 0.55;
          }
          100% {
            opacity: 0.55;
          }
        }
      `}</style>
    </div>
  );
}