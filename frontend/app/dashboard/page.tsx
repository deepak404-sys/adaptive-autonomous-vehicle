import AlertPanel from "@/components/dashboard/AlertPanel";
import ObjectDetection from "@/components/dashboard/ObjectDetection";
import PathStatus from "@/components/dashboard/PathStatus";
import RiskPanel from "@/components/dashboard/RiskPanel";
import VehicleStatus from "@/components/dashboard/VehicleStatus";
import RoadQualityPanel from "@/components/dashboard/RoadQualityPanel";
import StatCardsRow from "@/components/dashboard/StatCardsRow";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-black p-6 flex flex-col gap-4">
      {/* Row 1: Top stat cards */}
      <StatCardsRow />

      {/* Row 2: Live Road View + Sidebar (Aligned Heights) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
        <div className="lg:col-span-2 flex flex-col gap-4 h-full">
          {/* Live Road View — flex-1 use kiya hai taaki baki ki bachi hui height fill ho jaye */}
          <div className="bg-[#0d1520] border border-white/10 rounded-xl flex-1 min-h-[320px]" />
          <PathStatus />
        </div>

        <div className="flex flex-col gap-4 h-full">
          <VehicleStatus />
          <ObjectDetection />
        </div>
      </div>

      {/* Row 3: Risk History + Sensor Status + Recent Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <RiskPanel />
        <div className="bg-[#0d1520] border border-white/10 rounded-xl p-4">
          {/* Sensor Status placeholder */}
        </div>
        <AlertPanel />
      </div>

      {/* Row 4: India-specific road intelligence */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <RoadQualityPanel />
      </div>
    </div>
  );
}