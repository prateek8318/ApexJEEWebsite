"use client";

interface Point { week: string; videoBacklog: number; questionBacklog: number }

export default function BacklogChart({ data }: { data: Point[] }) {
  const W = 600; const H = 150;
  const pL = 32; const pR = 12; const pT = 10; const pB = 22;

  const maxV = Math.max(...data.flatMap(d => [d.videoBacklog, d.questionBacklog])) * 1.2;
  const bh = (v: number) => (v / maxV) * (H - pT - pB);
  const by = (v: number) => pT + (H - pT - pB) - bh(v);
  const slotW = (W - pL - pR) / data.length;
  const bw = slotW * 0.33;
  const ticks = [0, Math.round(maxV / 2), Math.round(maxV)];

  return (
    <div>
      <div style={{ display: "flex", gap: 18, marginBottom: 8 }}>
        {[{ c: "#F97316", l: "Video backlog" }, { c: "#EF4444", l: "Question backlog" }].map(lk => (
          <div key={lk.l} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: lk.c }} />
            <span style={{ fontSize: 11, color: "#94A3B8" }}>{lk.l}</span>
          </div>
        ))}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: H }}>
        {ticks.map((t, i) => (
          <g key={i}>
            <line x1={pL} y1={by(t || 0.01)} x2={W - pR} y2={by(t || 0.01)} stroke="#F1F5F9" strokeWidth={1} />
            <text x={pL - 4} y={by(t || 0.01) + 4} textAnchor="end" fontSize={9} fill="#94A3B8">{t}</text>
          </g>
        ))}
        {data.map((d, i) => {
          const cx = pL + i * slotW + slotW / 2;
          return (
            <g key={d.week}>
              <rect x={cx - bw - 1} y={by(d.videoBacklog)}    width={bw} height={bh(d.videoBacklog)}    fill="#F97316" rx={2} />
              <rect x={cx + 1}      y={by(d.questionBacklog)}  width={bw} height={bh(d.questionBacklog)} fill="#EF4444" rx={2} />
              <text x={cx} y={H - 5} textAnchor="middle" fontSize={9} fill="#94A3B8">{d.week}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
