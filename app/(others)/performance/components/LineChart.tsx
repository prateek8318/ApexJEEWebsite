"use client";


interface Point { week: string; actual: number; target: number }
interface Props {
  data: Point[];
  actualColor: string;
  targetColor: string;
  actualLabel: string;
  targetLabel: string;
}

export default function LineChart({ data, actualColor, targetColor, actualLabel, targetLabel }: Props) {
  const W = 600; const H = 110;
  const pL = 36; const pR = 16; const pT = 10; const pB = 22;

  const vals = data.flatMap(d => [d.actual, d.target]);
  const mn = Math.min(...vals) * 0.75;
  const mx = Math.max(...vals) * 1.12;

  const x = (i: number) => pL + (i / (data.length - 1)) * (W - pL - pR);
  const y = (v: number) => pT + (H - pT - pB) - ((v - mn) / (mx - mn)) * (H - pT - pB);

  const path = (key: "actual" | "target") =>
    data.map((d, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(d[key]).toFixed(1)}`).join(" ");

  const ticks = [mn, (mn + mx) / 2, mx].map(Math.round);

  return (
    <div>
      <div style={{ display: "flex", gap: 18, justifyContent: "flex-end", marginBottom: 6 }}>
        {[{ c: actualColor, l: actualLabel, dash: false }, { c: targetColor, l: targetLabel, dash: true }].map(lk => (
          <div key={lk.l} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <svg width={22} height={10}>
              <line x1={0} y1={5} x2={22} y2={5} stroke={lk.c} strokeWidth={2} strokeDasharray={lk.dash ? "4 3" : undefined} />
            </svg>
            <span style={{ fontSize: 11, color: "#94A3B8" }}>{lk.l}</span>
          </div>
        ))}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: H, overflow: "visible" }}>
        {ticks.map((t, i) => (
          <g key={i}>
            <line x1={pL} y1={y(t)} x2={W - pR} y2={y(t)} stroke="#F1F5F9" strokeWidth={1} />
            <text x={pL - 4} y={y(t) + 4} textAnchor="end" fontSize={10} fill="#94A3B8">{t}</text>
          </g>
        ))}
        <path d={path("target")} fill="none" stroke={targetColor} strokeWidth={1.5} strokeDasharray="5 4" opacity={0.65} />
        <path d={path("actual")} fill="none" stroke={actualColor} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={x(data.length - 1)} cy={y(data[data.length - 1].actual)} r={4} fill={actualColor} />
        {data.map((d, i) => (
          <text key={i} x={x(i)} y={H - 4} textAnchor="middle" fontSize={9} fill="#94A3B8">{d.week}</text>
        ))}
      </svg>
    </div>
  );
}
