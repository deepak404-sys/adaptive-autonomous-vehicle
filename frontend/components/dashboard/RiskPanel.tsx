"use client";

interface RiskPoint {
  time: string;
  value: number; // 0-100
}

const mockHistory: RiskPoint[] = [
  { time: "10:37", value: 25 },
  { time: "10:38", value: 40 },
  { time: "10:39", value: 65 },
  { time: "10:40", value: 55 },
  { time: "10:41", value: 70 },
  { time: "10:42", value: 50 },
];

const WIDTH = 400;
const HEIGHT = 140;
const PADDING_LEFT = 10;
const PADDING_RIGHT = 10;
const PADDING_TOP = 10;
const PADDING_BOTTOM = 10;

function buildPoints(data: RiskPoint[]) {
  const chartWidth = WIDTH - PADDING_LEFT - PADDING_RIGHT;
  const chartHeight = HEIGHT - PADDING_TOP - PADDING_BOTTOM;
  const step = chartWidth / (data.length - 1);

  return data.map((d, i) => {
    const x = PADDING_LEFT + i * step;
    const y = PADDING_TOP + chartHeight - (d.value / 100) * chartHeight;
    return { x, y };
  });
}

function buildLinePath(points: { x: number; y: number }[]) {
  return points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");
}

function buildAreaPath(points: { x: number; y: number }[]) {
  const line = buildLinePath(points);
  const last = points[points.length - 1];
  const first = points[0];
  return `${line} L ${last.x} ${HEIGHT - PADDING_BOTTOM} L ${first.x} ${
    HEIGHT - PADDING_BOTTOM
  } Z`;
}

export default function RiskPanel({
  data = mockHistory,
}: {
  data?: RiskPoint[];
}) {
  const points = buildPoints(data);
  const linePath = buildLinePath(points);
  const areaPath = buildAreaPath(points);

  return (
    <div className="bg-[#0d1520] border border-white/10 rounded-xl p-5 flex flex-col gap-4">
      <h2 className="text-sm font-semibold tracking-wide text-white/90">
        RISK LEVEL HISTORY
      </h2>

      <div className="flex gap-2">
        {/* Y-axis labels */}
        <div className="flex flex-col justify-between text-[10px] text-white/40 py-1 shrink-0">
          <span>HIGH</span>
          <span>MEDIUM</span>
          <span>LOW</span>
        </div>

        {/* Chart */}
        <div className="flex-1 min-w-0">
          <svg
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            className="w-full h-[100px]"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="riskFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#facc15" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#facc15" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* gridlines */}
            {[0.25, 0.5, 0.75].map((f) => (
              <line
                key={f}
                x1={PADDING_LEFT}
                x2={WIDTH - PADDING_RIGHT}
                y1={PADDING_TOP + f * (HEIGHT - PADDING_TOP - PADDING_BOTTOM)}
                y2={PADDING_TOP + f * (HEIGHT - PADDING_TOP - PADDING_BOTTOM)}
                stroke="rgba(255,255,255,0.06)"
                strokeWidth={1}
              />
            ))}

            <path d={areaPath} fill="url(#riskFill)" />
            <path
              d={linePath}
              fill="none"
              stroke="#facc15"
              strokeWidth={2}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </svg>

          {/* X-axis labels */}
          <div className="flex justify-between text-[10px] text-white/40 mt-1">
            {data.map((d) => (
              <span key={d.time}>{d.time}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}