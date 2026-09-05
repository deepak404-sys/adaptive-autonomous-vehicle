import AlertPanel from "@/components/dashboard/AlertPanel";
import ObjectDetection from "@/components/dashboard/ObjectDetection";
import PathStatus from "@/components/dashboard/PathStatus";
import RiskPanel from "@/components/dashboard/RiskPanel";
import VehicleStatus from "@/components/dashboard/VehicleStatus";
import RoadQualityPanel from "@/components/dashboard/RoadQualityPanel";
import StatCardsRow from "@/components/dashboard/StatCardsRow";
import Scene from "@/components/simulation/Scene";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-black p-6 flex flex-col gap-4">
      {/* Row 1: Top stat cards (Speed, Risk, TTC, Drive Mode) */}
      <StatCardsRow />

      {/* Row 2: Live Road View (2/3 width) + Vehicle Status / Object Detection sidebar (1/3 width) */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 flex flex-col gap-4 h-full">
          {/* Live Road View — Indian road scene */}
          <Scene />
          <PathStatus />
        </div>

        <div className="flex flex-col gap-4">
          <VehicleStatus />
          <ObjectDetection />
        </div>
      </div>

      {/* Row 3: Risk History + Sensor Status + Recent Alerts */}
      <div className="grid grid-cols-3 gap-4">
        <RiskPanel />
        <div className="bg-[#0d1520] border border-white/10 rounded-xl p-4">
          {/* Sensor Status — placeholder, banayenge baad me */}
        </div>
        <AlertPanel />
      </div>

      {/* Row 4: India-specific road intelligence */}
      <div className="grid grid-cols-3 gap-4">
        <RoadQualityPanel />
      </div>
    </div>
  );
}