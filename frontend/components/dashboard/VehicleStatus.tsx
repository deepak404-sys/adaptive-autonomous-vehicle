"use client";

interface VehicleStatusData {
  speed: number;
  steeringAngle: number;
  acceleration: number;
  battery: number;
  systemHealth: number;
}

const mockData: VehicleStatusData = {
  speed: 32,
  steeringAngle: -3.2,
  acceleration: 0.6,
  battery: 78,
  systemHealth: 98,
};

function barColor(value: number) {
  if (value >= 60) return "bg-green-400";
  if (value >= 30) return "bg-yellow-400";
  return "bg-red-400";
}

export default function VehicleStatus({
  data = mockData,
}: {
  data?: VehicleStatusData;
}) {
  return (
    <div className="bg-[#0d1520] border border-white/10 rounded-xl p-5 flex flex-col gap-4">
      <h2 className="text-sm font-semibold tracking-wide text-white/90">
        VEHICLE STATUS
      </h2>

      <div className="flex gap-5">
        {/* Left: top-down car icon */}
        <div className="shrink-0 w-20 h-36 flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/vehicle-top-view.png"
            alt="Vehicle top view"
            className="w-full h-auto"
          />
        </div>

        {/* Right: stats */}
        <div className="flex-1 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/60">Speed</span>
            <span className="text-sm font-medium text-white/90">
              {data.speed} km/h
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-white/60">Steering Angle</span>
            <span className="text-sm font-medium text-white/90">
              {data.steeringAngle}°
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-white/60">Acceleration</span>
            <span className="text-sm font-medium text-white/90">
              {data.acceleration} m/s²
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/60">Battery</span>
              <span className="text-sm font-medium text-green-400">
                {data.battery}%
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${barColor(
                  data.battery
                )}`}
                style={{ width: `${data.battery}%` }}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/60">System Health</span>
              <span className="text-sm font-medium text-green-400">
                {data.systemHealth}%
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${barColor(
                  data.systemHealth
                )}`}
                style={{ width: `${data.systemHealth}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}