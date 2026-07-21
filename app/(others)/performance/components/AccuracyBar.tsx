"use client";


interface Props { pct: number }

export default function AccuracyBar({ pct }: Props) {
  const color = pct >= 90 ? "#10B981" : pct >= 80 ? "#10B981" : pct >= 70 ? "#F59E0B" : "#EF4444";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ flex: 1, height: 6, background: "#F1F5F9", borderRadius: 99, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 99 }} />
      </div>
      <span style={{ fontSize: 13, fontWeight: 600, color, minWidth: 32 }}>{pct}%</span>
    </div>
  );
}
