export default function Road() {
  return (
    <>
      <defs>
        <linearGradient id="roadGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0b1220" />
          <stop offset="100%" stopColor="#1a2436" />
        </linearGradient>
      </defs>

      {/* Background */}
      <rect x="0" y="0" width="400" height="300" fill="url(#roadGrad)" />

      {/* Road surface (perspective trapezoid) */}
      <polygon points="150,60 250,60 340,300 60,300" fill="#20293a" />

      {/* Center lane divider (dashed) */}
      <line
        x1="200"
        y1="60"
        x2="200"
        y2="300"
        stroke="#3a4a63"
        strokeWidth="3"
        strokeDasharray="10 10"
      />

      {/* Road edges */}
      <line x1="150" y1="60" x2="60" y2="300" stroke="#4a5b78" strokeWidth="2" />
      <line x1="250" y1="60" x2="340" y2="300" stroke="#4a5b78" strokeWidth="2" />
    </>
  );
}