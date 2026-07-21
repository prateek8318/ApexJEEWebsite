"use client";


interface Props { pct: number; size?: number; color?: string; label?: string }

export default function DonutChart({ pct, size = 84, color = "#F97316", label = "ACCURACY" }: Props) {
  const r = (size - 14) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  const cx = size / 2;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cx} r={r} fill="none" stroke="#F1F5F9" strokeWidth={9} />
      <circle cx={cx} cy={cx} r={r} fill="none" stroke={color} strokeWidth={9}
        strokeLinecap="round" strokeDasharray={c} strokeDashoffset={offset}
        transform={`rotate(-90 ${cx} ${cx})`} />
      <text x={cx} y={cx - 4} textAnchor="middle" fontSize={15} fontWeight={700} fill="#0F172A">{pct}%</text>
      <text x={cx} y={cx + 11} textAnchor="middle" fontSize={8} fill="#94A3B8">{label}</text>
    </svg>
  );
}
