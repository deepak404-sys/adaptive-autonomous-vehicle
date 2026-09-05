export default function Vehicle() {
  return (
    <g transform="translate(200,262)">
      {/* Body */}
      <rect x="-16" y="-24" width="32" height="48" rx="6" fill="#e5e7eb" />
      {/* Windshield */}
      <rect x="-16" y="-24" width="32" height="10" rx="4" fill="#9ca3af" />
      {/* Sensor light */}
      <circle cx="0" cy="-30" r="3" fill="#4ade80" />
    </g>
  );
}