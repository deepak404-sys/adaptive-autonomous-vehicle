"use client";

const sensors = [
  { name: "Front LiDAR", status: "Active", health: 96 },
  { name: "Rear Camera", status: "Active", health: 91 },
  { name: "IMU", status: "Active", health: 100 },
  { name: "GPS Module", status: "Locked", health: 98 },
  { name: "Ultrasonic Array", status: "Active", health: 87 },
];

export default function SensorStatusPanel() {
  return (
    <div className="bg-[#0d1520] border border-white/10 rounded-xl p-4 h-full">
      <div className="text-sm text-slate-300 font-medium mb-3">Sensor Status</div>
      <div className="space-y-3">
        {sensors.map((s) => (
          <div key={s.name}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">{s.name}</span>
              <span className="text-emerald-400">{s.status}</span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500"
                style={{ width: `${s.health}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}