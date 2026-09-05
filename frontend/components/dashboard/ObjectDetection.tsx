"use client";

export type TrafficDensity = "Light" | "Moderate" | "Heavy" | "Jam";
export type SignalJumpRisk = "Low" | "Medium" | "High";

export interface DetectedObjectsData {
  cars: number;
  twoWheelers: number;
  autoRickshaws: number;
  strayAnimals: number;
  pedestrians: number;
  overloadedVehicles: number;
  wrongSideVehicles: number;
  trafficDensity: TrafficDensity;
  signalJumpRisk: SignalJumpRisk;
}

const DEFAULT_DATA: DetectedObjectsData = {
  cars: 2,
  twoWheelers: 1,
  autoRickshaws: 2,
  strayAnimals: 1,
  pedestrians: 1,
  overloadedVehicles: 1,
  wrongSideVehicles: 1,
  trafficDensity: "Heavy",
  signalJumpRisk: "Medium",
};

function densityColor(density: TrafficDensity) {
  switch (density) {
    case "Light":
      return "text-emerald-400";
    case "Moderate":
      return "text-amber-400";
    case "Heavy":
      return "text-orange-400";
    case "Jam":
      return "text-red-400";
  }
}

function riskColor(risk: SignalJumpRisk) {
  switch (risk) {
    case "Low":
      return "text-emerald-400";
    case "Medium":
      return "text-amber-400";
    case "High":
      return "text-red-400";
  }
}

export default function DetectedObjectsCard({
  data = DEFAULT_DATA,
}: {
  data?: DetectedObjectsData;
}) {
  const totalObjects =
    data.cars +
    data.twoWheelers +
    data.autoRickshaws +
    data.strayAnimals +
    data.pedestrians;

  const totalHazards = data.strayAnimals + data.wrongSideVehicles;

  return (
    <div className="bg-[#0b0f14] rounded-xl p-5 w-full max-w-md">
      <h2 className="text-white font-bold text-sm tracking-wide mb-4">
        DETECTED OBJECTS
      </h2>

      <div className="flex items-center justify-between">
        {/* LEFT: stats list */}
        <div className="flex flex-col gap-4 text-gray-300 text-sm">
          <div className="flex items-center gap-2">
            <span>🚗</span>
            <span>Cars</span>
            <span className="text-white ml-6">{data.cars}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🏍️</span>
            <span>Two-Wheelers</span>
            <span className="text-white ml-6">{data.twoWheelers}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🛺</span>
            <span>Auto-rickshaws</span>
            <span className="text-white ml-6">{data.autoRickshaws}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🐄</span>
            <span>Stray Animals</span>
            <span className="text-white ml-6">{data.strayAnimals}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🚶</span>
            <span>Pedestrians</span>
            <span className="text-white ml-6">{data.pedestrians}</span>
          </div>
        </div>

        {/* RIGHT: radar shifted down + right within the card */}
        <div className="relative w-32 h-32 shrink-0 self-end -mb-2 -mr-2">
          <SensorRadar />
        </div>
      </div>

      {/* Total */}
      <div className="mt-5 bg-white/5 rounded-lg px-4 py-3 flex justify-between text-sm">
        <span className="text-gray-400">Total Objects</span>
        <span className="text-white font-semibold">{totalObjects}</span>
      </div>

      {/* Divider */}
      <div className="my-4 h-px bg-white/10" />

      {/* Traffic behavior */}
      <div className="flex flex-col gap-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Traffic Density</span>
          <span className={`font-semibold ${densityColor(data.trafficDensity)}`}>
            {data.trafficDensity}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Signal Jump Risk</span>
          <span className={`font-semibold ${riskColor(data.signalJumpRisk)}`}>
            {data.signalJumpRisk}
          </span>
        </div>
      </div>

      {/* Hazard summary */}
      <div
        className={`mt-4 flex items-center justify-between rounded-lg px-4 py-3 text-sm ${
          totalHazards > 0
            ? "border border-red-500/20 bg-red-500/10"
            : "border border-white/5 bg-white/[0.02]"
        }`}
      >
        <span className={totalHazards > 0 ? "text-red-400 font-medium" : "text-gray-400"}>
          {totalHazards > 0 ? "Unpredictable Hazards" : "No Active Hazards"}
        </span>
        <span className={`font-bold ${totalHazards > 0 ? "text-red-400" : "text-gray-500"}`}>
          {totalHazards}
        </span>
      </div>
    </div>
  );
}

function SensorRadar() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Radar circle */}
      <div className="absolute inset-0 rounded-full border border-white/10" />
      <div className="absolute w-[85%] h-[85%] rounded-full border border-white/10" />
      <div className="absolute w-[58%] h-[58%] rounded-full border border-white/10" />
      <div className="absolute w-[30%] h-[30%] rounded-full border border-white/10" />

      {/* Vertical / horizontal lines */}
      <div className="absolute h-full w-px bg-white/10" />
      <div className="absolute w-full h-px bg-white/10" />

      {/* Rotating sweep (wedge) */}
      <div className="absolute inset-0 rounded-full overflow-hidden animate-[spin_3s_linear_infinite]">
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "conic-gradient(from 0deg, rgba(74,222,128,0.55) 0deg, rgba(74,222,128,0.2) 22deg, transparent 40deg, transparent 360deg)",
          }}
        />
        <div className="absolute left-1/2 top-1/2 w-1/2 h-px origin-left bg-gradient-to-r from-green-300 to-transparent shadow-[0_0_10px_rgba(74,222,128,0.8)]" />
      </div>

      {/* Center sensor */}
      <div className="absolute w-2.5 h-2.5 rounded-full bg-green-300 shadow-[0_0_10px_rgba(74,222,128,1)] z-10" />

      {/* Detected objects */}
      <div className="absolute w-2 h-2 rounded-full bg-blue-400" style={{ top: "17%", left: "69%" }} />
      <div className="absolute w-2 h-2 rounded-full bg-blue-400" style={{ top: "25%", left: "30%" }} />
      <div className="absolute w-2 h-2 rounded-full bg-orange-400" style={{ top: "30%", left: "84%" }} />
      <div className="absolute w-2 h-2 rounded-full bg-purple-400" style={{ top: "55%", left: "59%" }} />
      <div className="absolute w-2 h-2 rounded-full bg-green-500" style={{ top: "64%", left: "5%" }} />
    </div>
  );
}