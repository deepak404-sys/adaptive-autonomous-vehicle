export default function Pedestrian({
  distance,
  x,
  y,
  width = 10,
  height = 20,
}: {
  distance: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
}) {
  const color = "#c026d3";

  return (
    <div
      className="absolute z-10 rounded-sm"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${width}%`,
        height: `${height}%`,
        border: `2px solid ${color}`,
        boxShadow: `0 0 10px ${color}66`,
      }}
    >
      <span
        className="absolute -top-6 left-0 whitespace-nowrap rounded px-2 py-0.5 text-[11px] font-bold text-white"
        style={{ backgroundColor: color }}
      >
        PEDESTRIAN {distance}
      </span>
    </div>
  );
}