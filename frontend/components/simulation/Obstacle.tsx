export interface ObstacleProps {
  label: string;
  distance?: string;
  x: number; // % from left
  y: number; // % from top
  width?: number; // %
  height?: number; // %
  color: string;
  variant?: "box" | "pothole";
}

export default function Obstacle({
  label,
  distance,
  x,
  y,
  width = 12,
  height = 18,
  color,
  variant = "box",
}: ObstacleProps) {
  if (variant === "pothole") {
    return (
      <div
        className="absolute z-10 flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-amber-400/60 bg-amber-400/20"
        style={{ left: `${x}%`, top: `${y}%` }}
        title={label}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
      </div>
    );
  }

  return (
    <div
      className="absolute z-10 rounded-sm"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${width}%`,
        height: `${height}%`,
        border: `1.5px solid ${color}`,
        boxShadow: `0 0 8px ${color}55`,
      }}
    >
      <span
        className="absolute -top-5 left-0 whitespace-nowrap rounded px-1.5 py-0.5 text-[10px] font-bold"
        style={{ backgroundColor: color, color: "#0b1220" }}
      >
        {label} {distance}
      </span>
    </div>
  );
}