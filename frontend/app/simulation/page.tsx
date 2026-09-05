import Scene from "@/components/simulation/Scene";

export default function SimulationPage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-bold text-white">Simulation</h1>
        <p className="text-sm text-slate-400">
          Live road scene with India-specific object detection — potholes,
          stray animals, auto-rickshaws, and mixed traffic.
        </p>
      </div>

      <div className="flex h-[75vh] flex-col">
        <Scene />
      </div>
    </div>
  );
}