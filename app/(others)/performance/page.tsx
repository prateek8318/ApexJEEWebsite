"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userFlagApi } from "@/lib/api/user/flag";
import { userTestAttemptApi } from "@/lib/api/user/test-attempt";
import LineChart from "./components/LineChart";
import BacklogChart from "./components/BacklogChart";
import DonutChart from "./components/DonutChart";
import AccuracyBar from "./components/AccuracyBar";
import {
  weeklyData,
  physicsChapters,
  mathsChapters,
  mockTestResults,
  weakAreas,
  type MockTestResult,
  type WeakArea,
} from "./data";

// ─── Shared styles ────────────────────────────────────────────────────────────
const S = {
  page: {
    minHeight: "100vh",
    background: "#F0F2F8",
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    padding: "0 0 60px",
    color: "#0F172A",
  } as React.CSSProperties,
  container: {
    maxWidth: 1550,
    margin: "0 auto",
    padding: "0 20px",
  } as React.CSSProperties,
  card: {
    background: "#fff",
    borderRadius: 12,
    padding: "20px 24px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
  } as React.CSSProperties,
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  } as React.CSSProperties,
  sectionTitle: {
    fontSize: 15,
    fontWeight: 700,
    color: "#0F172A",
    margin: 0,
  } as React.CSSProperties,
  sectionSub: {
    fontSize: 11,
    color: "#94A3B8",
    margin: "2px 0 0",
    textTransform: "uppercase" as const,
    letterSpacing: "0.04em",
  },
  linkBtn: {
    fontSize: 13,
    color: "#F97316",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontWeight: 500,
    padding: 0,
  },
  divider: {
    height: 1,
    background: "#F1F5F9",
    margin: "28px 0",
  } as React.CSSProperties,
  tag: (color: string, bg: string): React.CSSProperties => ({
    display: "inline-block",
    padding: "2px 8px",
    borderRadius: 99,
    fontSize: 11,
    fontWeight: 600,
    color,
    background: bg,
  }),
};

// ─── Period selector ──────────────────────────────────────────────────────────
function PeriodBar() {
  const [active, setActive] = useState("3 Months");
  const opts = ["1 Month", "3 Months", "6 Months"];
  return (
    <div
      style={{
        background: "#fff",
        borderBottom: "1px solid #E2E8F0",
        padding: "14px 20px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        flexWrap: "wrap",
      }}
    >
      <span style={{ fontSize: 13, fontWeight: 500, color: "#475569" }}>
        Analysis Period:
      </span>
      <div style={{ display: "flex", gap: 6 }}>
        {opts.map((o) => (
          <button
            key={o}
            onClick={() => setActive(o)}
            style={{
              padding: "6px 14px",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 500,
              background: active === o ? "#F97316" : "#F1F5F9",
              color: active === o ? "#fff" : "#64748B",
            }}
          >
            {o}
          </button>
        ))}
      </div>
      <span style={{ fontSize: 13, color: "#94A3B8", marginLeft: 4 }}>
        Custom:
      </span>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <input
          type="text"
          defaultValue="01-02-2026"
          style={{
            padding: "5px 10px",
            borderRadius: 7,
            border: "1px solid #E2E8F0",
            fontSize: 13,
            width: 100,
          }}
        />
        <span style={{ color: "#94A3B8" }}>to</span>
        <input
          type="text"
          defaultValue="17-05-2026"
          style={{
            padding: "5px 10px",
            borderRadius: 7,
            border: "1px solid #E2E8F0",
            fontSize: 13,
            width: 100,
          }}
        />
        <button
          style={{
            padding: "6px 16px",
            borderRadius: 8,
            border: "none",
            background: "#F97316",
            color: "#fff",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Apply
        </button>
      </div>
      <span style={{ marginLeft: "auto", fontSize: 11, color: "#94A3B8" }}>
        Showing 17 Feb — 17 May 2026 (3 months)
      </span>
    </div>
  );
}

// ─── Section 1: Performance Summary ──────────────────────────────────────────
function PerformanceSummary() {
  const { data: perfData } = useQuery({
    queryKey: ["practicePerformance"],
    queryFn: () => userTestAttemptApi.getPracticePerformance(),
  });

  const pData = perfData?.data || {
    testsAttempted: 0,
    questionsAttempted: 0,
    correct: 0,
    wrong: 0,
    accuracy: 0,
    subjectWise: [],
  };

  return (
    <div style={{ marginTop: 28 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 16,
        }}
      >
        <div
          style={{
            width: 6,
            height: 28,
            background: "#F97316",
            borderRadius: 3,
          }}
        />
        <div>
          <div style={{ fontSize: 16, fontWeight: 700 }}>
            Performance Summary
          </div>
          <div
            style={{
              fontSize: 11,
              color: "#94A3B8",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            THREE KEY AREAS · SELECTED PERIOD
          </div>
        </div>
      </div>

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}
      >
        {/* Timetable Achievement */}
        <div style={{ ...S.card, borderTop: "3px solid #4F46E5" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 14,
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: "#EEF2FF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width={16}
                height={16}
                viewBox="0 0 24 24"
                fill="none"
                stroke="#4F46E5"
                strokeWidth={2}
              >
                <rect x={3} y={4} width={18} height={18} rx={2} />
                <line x1={16} y1={2} x2={16} y2={6} />
                <line x1={8} y1={2} x2={8} y2={6} />
                <line x1={3} y1={10} x2={21} y2={10} />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>
                Timetable Achievement
              </div>
              <div style={{ fontSize: 10, color: "#94A3B8" }}>
                Schedule adherence & backlog
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 24, marginBottom: 12 }}>
            <div>
              <div
                style={{
                  fontSize: 32,
                  fontWeight: 800,
                  color: "#0F172A",
                  lineHeight: 1,
                }}
              >
                67
              </div>
              <div style={{ fontSize: 10, color: "#94A3B8", marginTop: 2 }}>
                Days Studied
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: 32,
                  fontWeight: 800,
                  color: "#0F172A",
                  lineHeight: 1,
                }}
              >
                44
              </div>
              <div style={{ fontSize: 10, color: "#94A3B8", marginTop: 2 }}>
                Daily Targets Met
              </div>
            </div>
          </div>
          <div style={{ fontSize: 12, color: "#475569", marginBottom: 4 }}>
            <strong style={{ color: "#0F172A" }}>52%</strong> overall adherence
            out of 84 days
          </div>
          <div style={{ fontSize: 12, color: "#94A3B8" }}>
            Current backlog:{" "}
            <span style={{ color: "#F97316", fontWeight: 600 }}>4 videos</span>{" "}
            &{" "}
            <span style={{ color: "#F97316", fontWeight: 600 }}>
              10 questions
            </span>{" "}
            pending
          </div>
        </div>

        {/* Practice Questions */}
        <div style={{ ...S.card, borderTop: "3px solid #F97316" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 14,
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: "#FFF7ED",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width={16}
                height={16}
                viewBox="0 0 24 24"
                fill="none"
                stroke="#F97316"
                strokeWidth={2}
              >
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>
                Practice Questions
              </div>
              <div style={{ fontSize: 10, color: "#94A3B8" }}>
                Current vs total attempted so far
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <DonutChart pct={pData.accuracy} size={80} color="#F97316" label="ACCURACY" />
            <div>
              <div style={{ fontSize: 12, color: "#94A3B8", marginBottom: 6 }}>
                Total Attempted{" "}
                <span
                  style={{ fontWeight: 700, color: "#0F172A", fontSize: 20 }}
                >
                  {pData.questionsAttempted}
                </span>
              </div>
              <div style={{ fontSize: 13, color: "#10B981", fontWeight: 500 }}>
                ✓ Correct <strong>{pData.correct}</strong>
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: "#EF4444",
                  fontWeight: 500,
                  marginTop: 2,
                }}
              >
                ✗ Wrong <strong>{pData.wrong}</strong>
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              gap: 16,
              marginTop: 12,
              paddingTop: 10,
              borderTop: "1px solid #F1F5F9",
              flexWrap: "wrap",
            }}
          >
            {pData.subjectWise.length > 0 ? (
              pData.subjectWise.map((subj: any) => (
                <span key={subj.subjectId} style={{ fontSize: 12, color: "#475569" }}>
                  {subj.name}: <strong style={{ color: "#3B82F6" }}>{subj.accuracy}%</strong>
                </span>
              ))
            ) : (
              <span style={{ fontSize: 12, color: "#94A3B8" }}>No data yet</span>
            )}
          </div>
        </div>

        {/* Mock Test Performance */}
        <div style={{ ...S.card, borderTop: "3px solid #10B981" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 14,
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: "#ECFDF5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width={16}
                height={16}
                viewBox="0 0 24 24"
                fill="none"
                stroke="#10B981"
                strokeWidth={2}
              >
                <circle cx={12} cy={12} r={10} />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>
                Mock Test Performance
              </div>
              <div style={{ fontSize: 10, color: "#94A3B8" }}>
                Avg expected rank · last 2 tests
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              gap: 28,
              alignItems: "flex-end",
              marginBottom: 14,
            }}
          >
            <div>
              <div style={{ fontSize: 11, color: "#94A3B8", marginBottom: 2 }}>
                Avg Rank (last 2)
              </div>
              <div
                style={{
                  fontSize: 30,
                  fontWeight: 800,
                  color: "#EF4444",
                  lineHeight: 1,
                }}
              >
                #4,363
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "#94A3B8", marginBottom: 2 }}>
                Tests Taken
              </div>
              <div
                style={{
                  fontSize: 30,
                  fontWeight: 800,
                  color: "#0F172A",
                  lineHeight: 1,
                }}
              >
                9
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              paddingTop: 10,
              borderTop: "1px solid #F1F5F9",
            }}
          >
            <span style={{ fontSize: 12, color: "#475569" }}>
              Best rank: <strong style={{ color: "#10B981" }}>#2,821</strong>
            </span>
            <span style={{ fontSize: 12, color: "#475569" }}>
              Latest score: <strong>214/300</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Section 2: Timetable Adherence Charts ────────────────────────────────────
function TimetableAdherence() {
  return (
    <div style={{ marginTop: 28 }}>
      <div style={{ ...S.card }}>
        <div style={S.sectionHeader}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 6,
                height: 24,
                background: "#4F46E5",
                borderRadius: 3,
              }}
            />
            <div>
              <div style={S.sectionTitle}>Timetable Adherence — Detail</div>
              <div style={S.sectionSub}>
                Videos & Practice Questions · Actual vs Target · Backlog Trend
              </div>
            </div>
          </div>
          <button style={S.linkBtn}>View Timetable →</button>
        </div>

        {/* Videos chart */}
        <div style={{ marginBottom: 28 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#475569",
              marginBottom: 8,
            }}
          >
            Videos Covered vs Target (per week)
          </div>
          <LineChart
            data={weeklyData.map((d) => ({
              week: d.week,
              actual: d.actualVideos,
              target: d.targetVideos,
            }))}
            actualColor="#3B82F6"
            targetColor="#94A3B8"
            actualLabel="Actual videos"
            targetLabel="Weekly target"
          />
        </div>

        <div style={S.divider} />

        {/* Questions chart */}
        <div style={{ marginBottom: 28 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#475569",
              marginBottom: 8,
            }}
          >
            Practice Questions Done vs Target (per week)
          </div>
          <LineChart
            data={weeklyData.map((d) => ({
              week: d.week,
              actual: d.actualQuestions,
              target: d.targetQuestions,
            }))}
            actualColor="#10B981"
            targetColor="#94A3B8"
            actualLabel="Actual questions"
            targetLabel="Weekly target"
          />
        </div>

        <div style={S.divider} />

        {/* Backlog chart */}
        <div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#475569",
              marginBottom: 8,
            }}
          >
            Backlog — Videos & Practice Questions (week-end)
          </div>
          <BacklogChart data={weeklyData} />
        </div>
      </div>
    </div>
  );
}

// ─── Section 3: Chapter Performance ──────────────────────────────────────────
function ChapterPerformance() {
  return (
    <div style={{ marginTop: 28 }}>
      <div style={{ ...S.card }}>
        <div style={S.sectionHeader}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 6,
                height: 24,
                background: "#F59E0B",
                borderRadius: 3,
              }}
            />
            <div>
              <div style={S.sectionTitle}>
                Practice Question Performance — by Chapter
              </div>
              <div style={S.sectionSub}>
                Correct answers vs total attempted · each chapter covered so far
              </div>
            </div>
          </div>
          <button style={S.linkBtn}>Practice Now →</button>
        </div>

        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}
        >
          {[
            { label: "PHYSICS", chapters: physicsChapters, accent: "#3B82F6" },
            {
              label: "MATHEMATICS",
              chapters: mathsChapters,
              accent: "#8B5CF6",
            },
          ].map(({ label, chapters, accent }) => (
            <div
              key={label}
              style={{
                border: "1px solid #E2E8F0",
                borderRadius: 10,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  background: "#F8FAFC",
                  padding: "10px 16px",
                  borderBottom: "1px solid #E2E8F0",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: accent,
                  }}
                />
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    color: "#475569",
                  }}
                >
                  {label}
                </span>
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#F8FAFC" }}>
                    {["CHAPTER", "ATTEMPTED", "CORRECT", "ACCURACY"].map(
                      (h) => (
                        <th
                          key={h}
                          style={{
                            padding: "8px 12px",
                            textAlign: h === "CHAPTER" ? "left" : "center",
                            fontSize: 10,
                            fontWeight: 600,
                            color: "#94A3B8",
                            letterSpacing: "0.04em",
                            borderBottom: "1px solid #F1F5F9",
                          }}
                        >
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {chapters.map((ch, i) => (
                    <tr
                      key={i}
                      style={{
                        borderBottom:
                          i < chapters.length - 1
                            ? "1px solid #F8FAFC"
                            : "none",
                      }}
                    >
                      <td
                        style={{
                          padding: "10px 12px",
                          fontSize: 13,
                          color: "#1E293B",
                        }}
                      >
                        {ch.chapter}
                      </td>
                      <td
                        style={{
                          padding: "10px 12px",
                          fontSize: 13,
                          color: "#475569",
                          textAlign: "center",
                        }}
                      >
                        {ch.attempted}
                      </td>
                      <td
                        style={{
                          padding: "10px 12px",
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#10B981",
                          textAlign: "center",
                        }}
                      >
                        {ch.correct}
                      </td>
                      <td style={{ padding: "10px 12px", minWidth: 120 }}>
                        <AccuracyBar pct={ch.accuracy} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Section 4: Mock Test Results ────────────────────────────────────────────
function MockTestSection() {
  return (
    <div style={{ marginTop: 28 }}>
      {/* Summary cards */}
      <div style={{ ...S.card, marginBottom: 16 }}>
        <div style={S.sectionHeader}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 6,
                height: 24,
                background: "#10B981",
                borderRadius: 3,
              }}
            />
            <div>
              <div style={S.sectionTitle}>Mock Test Performance</div>
              <div style={S.sectionSub}>
                All tests taken · Physics & Maths correct answers → Expected
                rank
              </div>
            </div>
          </div>
          <button style={S.linkBtn}>Take a Test →</button>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 16,
          }}
        >
          {[
            { icon: "📋", label: "Tests Taken", value: "9", sub: "" },
            { icon: "📊", label: "Average Score", value: "166", sub: "/300" },
            { icon: "📈", label: "Latest Score", value: "214", sub: "/300" },
            {
              icon: "🏆",
              label: "Best Expected Rank",
              value: "#3,821",
              sub: "",
            },
          ].map((card) => (
            <div
              key={card.label}
              style={{
                background: "#F8FAFC",
                borderRadius: 10,
                padding: "16px 20px",
                border: "1px solid #F1F5F9",
              }}
            >
              <div style={{ fontSize: 20, marginBottom: 8 }}>{card.icon}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#0F172A" }}>
                {card.value}
                <span
                  style={{ fontSize: 13, fontWeight: 400, color: "#94A3B8" }}
                >
                  {card.sub}
                </span>
              </div>
              <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>
                {card.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed table */}
      <div style={{ ...S.card }}>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>
          All Mock Tests — Detailed Results
        </div>
        <div style={{ overflowX: "auto" }}>
          <table
            style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}
          >
            <thead>
              <tr style={{ background: "#0F172A" }}>
                {[
                  "TEST NAME",
                  "TYPE",
                  "DATE",
                  "PHY SCORE",
                  "MAT SCORE",
                  "TOTAL /300",
                  "PHY CORRECT",
                  "MAT CORRECT",
                  "EXPECTED RANK",
                  "CHANGE",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "10px 12px",
                      textAlign: "left",
                      fontSize: 10,
                      fontWeight: 600,
                      color: "#94A3B8",
                      letterSpacing: "0.04em",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockTestResults.map((r: MockTestResult, i: number) => (
                <tr
                  key={r.id}
                  style={{
                    background: i % 2 === 0 ? "#fff" : "#F8FAFC",
                    borderBottom: "1px solid #F1F5F9",
                  }}
                >
                  <td
                    style={{
                      padding: "10px 12px",
                      fontSize: 13,
                      fontWeight: 500,
                      color: "#0F172A",
                    }}
                  >
                    {r.testName}
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <span
                      style={S.tag(
                        r.type === "Advanced" ? "#7C3AED" : "#EA580C",
                        r.type === "Advanced" ? "#EDE9FE" : "#FFF7ED",
                      )}
                    >
                      {r.type}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "10px 12px",
                      fontSize: 12,
                      color: "#64748B",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {r.date}
                  </td>
                  <td
                    style={{
                      padding: "10px 12px",
                      fontSize: 13,
                      color: "#0F172A",
                    }}
                  >
                    {r.phyScore}
                  </td>
                  <td
                    style={{
                      padding: "10px 12px",
                      fontSize: 13,
                      color: "#0F172A",
                    }}
                  >
                    {r.matScore}
                  </td>
                  <td
                    style={{
                      padding: "10px 12px",
                      fontSize: 14,
                      fontWeight: 700,
                      color: "#F97316",
                    }}
                  >
                    {r.total}
                  </td>
                  <td
                    style={{
                      padding: "10px 12px",
                      fontSize: 13,
                      color: "#0F172A",
                    }}
                  >
                    {r.phyCorrect}
                  </td>
                  <td
                    style={{
                      padding: "10px 12px",
                      fontSize: 13,
                      color: "#0F172A",
                    }}
                  >
                    {r.matCorrect}
                  </td>
                  <td
                    style={{
                      padding: "10px 12px",
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#EF4444",
                    }}
                  >
                    {r.expectedRank}
                  </td>
                  <td
                    style={{
                      padding: "10px 12px",
                      fontSize: 13,
                      color: "#10B981",
                      fontWeight: 500,
                    }}
                  >
                    ↑ {Math.abs(r.change)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Section 5: Weak Areas ────────────────────────────────────────────────────
function WeakAreasSection() {
  // const physicsList = weakAreas.filter((w) => w.subject === "PHYSICS");
  // const mathsList = weakAreas.filter((w) => w.subject === "MATHS");
  // // const pairs = Array.from(
  //   { length: Math.max(physicsList.length, mathsList.length) },
  //   (_, i) => [physicsList[i], mathsList[i]],
  // );

  return (
    <div style={{ marginTop: 28 }}>
      <div style={{ ...S.card }}>
        <div style={S.sectionHeader}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 6,
                height: 24,
                background: "#EF4444",
                borderRadius: 3,
              }}
            />
            <div>
              <div style={S.sectionTitle}>Weak Areas — Priority Focus</div>
              <div style={S.sectionSub}>
                Based on wrong answers in practice questions & mock tests ·
                sorted by urgency
              </div>
            </div>
          </div>
          <button style={S.linkBtn}>Practice Weak Topics →</button>
        </div>

        {/* Summary banner */}
        <div
          style={{
            background: "#0F172A",
            borderRadius: 10,
            padding: "16px 24px",
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          <span style={{ fontSize: 16, marginRight: 4 }}>⚠️</span>
          <span
            style={{ fontSize: 13, fontWeight: 600, color: "#F8FAFC", flex: 1 }}
          >
            Topics requiring your attention before the exam
          </span>
          <div
            style={{ display: "flex", gap: 12, marginTop: 8, width: "100%" }}
          >
            {[
              { n: 4, l: "Physics Topics" },
              { n: 4, l: "Maths Topics" },
              { n: 53, l: "Mock Test Errors" },
              { n: 69, l: "Practice Errors" },
            ].map((st) => (
              <div
                key={st.l}
                style={{
                  background: "rgba(255,255,255,0.08)",
                  borderRadius: 8,
                  padding: "8px 16px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>
                  {st.n}
                </div>
                <div style={{ fontSize: 10, color: "#94A3B8" }}>{st.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Weak area cards grid */}
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
        >
          {weakAreas.map((w: WeakArea) => (
            <div
              key={w.id}
              style={{
                border: "1px solid #E2E8F0",
                borderRadius: 10,
                padding: "16px 18px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 8,
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: w.subject === "PHYSICS" ? "#3B82F6" : "#8B5CF6",
                      letterSpacing: "0.06em",
                      marginBottom: 2,
                    }}
                  >
                    {w.subject}
                  </div>
                  <div
                    style={{ fontSize: 15, fontWeight: 700, color: "#0F172A" }}
                  >
                    {w.topic}
                  </div>
                  <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 1 }}>
                    {w.chapter}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div
                    style={{ fontSize: 20, fontWeight: 800, color: "#EF4444" }}
                  >
                    {w.accuracy}%
                  </div>
                  <div style={{ fontSize: 9, color: "#94A3B8" }}>ACCURACY</div>
                  <span
                    style={S.tag(
                      w.priority === "Critical" ? "#DC2626" : "#B45309",
                      w.priority === "Critical" ? "#FEF2F2" : "#FFFBEB",
                    )}
                  >
                    {w.priority}
                  </span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                <span
                  style={{
                    fontSize: 11,
                    color: "#3B82F6",
                    background: "#EFF6FF",
                    borderRadius: 6,
                    padding: "2px 8px",
                  }}
                >
                  📝 Practice Q
                </span>
                <span
                  style={{
                    fontSize: 11,
                    color: "#10B981",
                    background: "#ECFDF5",
                    borderRadius: 6,
                    padding: "2px 8px",
                  }}
                >
                  📋 Mock Test
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 12,
                  color: "#64748B",
                  marginBottom: 8,
                }}
              >
                <span>
                  Practice errors:{" "}
                  <strong style={{ color: "#EF4444" }}>
                    {w.practiceErrors}
                  </strong>
                </span>
                <span>
                  Mock errors:{" "}
                  <strong style={{ color: "#EF4444" }}>{w.mockErrors}</strong>
                </span>
              </div>
              {/* Error bar */}
              <div
                style={{
                  height: 4,
                  background: "#FEE2E2",
                  borderRadius: 99,
                  marginBottom: 8,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${(w.practiceErrors / (w.practiceErrors + w.mockErrors)) * 100}%`,
                    height: "100%",
                    background: "#EF4444",
                    borderRadius: 99,
                  }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: 11, color: "#94A3B8" }}>
                  {w.totalWrong} wrong answers total
                </span>
                <button
                  style={{
                    padding: "6px 12px",
                    background: "#F97316",
                    border: "none",
                    borderRadius: 7,
                    color: "#fff",
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Check Questions Wrongly Answered
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Section 6: Flagged Items / Revision Queue ────────────────────────────────
type TabType = "All" | "Videos" | "Questions" | "Topics";

function RevisionQueue() {
  const [activeTab, setActiveTab] = useState<TabType>("All");
  const queryClient = useQueryClient();

  const { data: statsData } = useQuery({
    queryKey: ["flag-stats"],
    queryFn: () => userFlagApi.getFlagStats()
  });

  const { data: itemsData, isLoading } = useQuery({
    queryKey: ["flagged-items", activeTab],
    queryFn: () => {
      const type = activeTab === "Videos" ? "video" : activeTab === "Questions" ? "question" : activeTab === "Topics" ? "topic" : undefined;
      return userFlagApi.getFlaggedItems(type);
    }
  });

  const clearMutation = useMutation({
    mutationFn: (type?: string) => userFlagApi.clearFlags(type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flag-stats"] });
      queryClient.invalidateQueries({ queryKey: ["flagged-items"] });
    }
  });

  const unflagMutation = useMutation({
    mutationFn: (item: any) => {
      if (item.contentType === "question") return userFlagApi.unflagQuestion(item.contentId);
      // fallback for other types if we add specific unflag methods, or use a generic delete
      return Promise.resolve({ data: null, success: true } as any); 
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flag-stats"] });
      queryClient.invalidateQueries({ queryKey: ["flagged-items"] });
    }
  });

  const counts = statsData?.data || { videos: 0, questions: 0, topics: 0, total: 0 };
  const filtered = itemsData?.data || [];

  const typeColor: Record<string, { bg: string; color: string }> = {
    VIDEO: { bg: "#EDE9FE", color: "#7C3AED" },
    QUESTION: { bg: "#ECFDF5", color: "#059669" },
    TOPIC: { bg: "#EFF6FF", color: "#2563EB" },
  };

  return (
    <div style={{ marginTop: 28 }}>
      <div style={{ ...S.card }}>
        <div style={S.sectionHeader}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: "#FFF7ED",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              🏷️
            </div>
            <div>
              <div style={S.sectionTitle}>Flagged Items — Revision Queue</div>
              <div style={S.sectionSub}>
                Videos and questions marked as difficult or flagged for later
                review
              </div>
            </div>
          </div>
          <button 
            style={S.linkBtn} 
            onClick={() => {
              if (confirm("Are you sure you want to clear all resolved items?")) {
                const type = activeTab === "Videos" ? "video" : activeTab === "Questions" ? "question" : activeTab === "Topics" ? "topic" : undefined;
                clearMutation.mutate(type);
              }
            }}
          >
            Clear Resolved →
          </button>
        </div>

        {/* Summary chips */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 12,
            marginBottom: 20,
          }}
        >
          {[
            {
              icon: "🎬",
              n: counts.videos || 0,
              l: "Flagged Videos",
              c: "#7C3AED",
              bg: "#EDE9FE",
            },
            {
              icon: "❓",
              n: counts.questions || 0,
              l: "Flagged Questions",
              c: "#059669",
              bg: "#ECFDF5",
            },
            {
              icon: "📚",
              n: counts.topics || 0,
              l: "Flagged Topics",
              c: "#2563EB",
              bg: "#EFF6FF",
            },
          ].map((chip) => (
            <div
              key={chip.l}
              style={{
                background: chip.bg,
                borderRadius: 10,
                padding: "14px 18px",
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <span style={{ fontSize: 22 }}>{chip.icon}</span>
              <div>
                <div
                  style={{ fontSize: 24, fontWeight: 800, color: "#0F172A" }}
                >
                  {chip.n}
                </div>
                <div style={{ fontSize: 11, color: "#64748B" }}>{chip.l}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            gap: 6,
            marginBottom: 20,
            borderBottom: "1px solid #F1F5F9",
            paddingBottom: 0,
          }}
        >
          {(["All", "Videos", "Questions", "Topics"] as TabType[]).map(
            (tab) => {
              const count =
                tab === "All"
                  ? counts.total
                  : tab === "Videos" ? counts.videos : tab === "Questions" ? counts.questions : counts.topics;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: "8px 14px",
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    fontSize: 13,
                    fontWeight: activeTab === tab ? 600 : 400,
                    color: activeTab === tab ? "#0F172A" : "#94A3B8",
                    borderBottom:
                      activeTab === tab
                        ? "2px solid #F97316"
                        : "2px solid transparent",
                    marginBottom: -1,
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  {tab}
                  {count !== undefined && (
                    <span
                      style={{
                        background: activeTab === tab ? "#FFF7ED" : "#F1F5F9",
                        color: activeTab === tab ? "#F97316" : "#94A3B8",
                        borderRadius: 99,
                        padding: "1px 7px",
                        fontSize: 11,
                        fontWeight: 600,
                      }}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            },
          )}
        </div>

        {/* Cards grid */}
        {isLoading ? (
          <div style={{ padding: 20, textAlign: "center", color: "#94A3B8" }}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 20, textAlign: "center", color: "#94A3B8" }}>No flagged items found.</div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 14,
            }}
          >
            {filtered.map((item: any) => {
              const typeUpper = item.contentType.toUpperCase();
              const tc = typeColor[typeUpper] || typeColor["QUESTION"];
              const title = item.content?.title || item.content?.questionText || "Unknown";
              const subject = item.content?.subject?.name || "Subject";
              const chapter = item.content?.chapter?.title || "Chapter";
              
              return (
                <div
                  key={item._id}
                  style={{
                    border: "1px solid #E2E8F0",
                    borderRadius: 10,
                    padding: "14px 14px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  <span
                    style={{
                      ...S.tag(tc.color, tc.bg),
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.04em",
                      alignSelf: "flex-start",
                    }}
                  >
                    {typeUpper}
                  </span>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#0F172A",
                      lineHeight: 1.4,
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                    dangerouslySetInnerHTML={{ __html: title }}
                  />
                  <div style={{ fontSize: 11, color: "#94A3B8" }}>
                    {subject} · {chapter}
                  </div>
                  <div style={{ fontSize: 11, color: "#CBD5E1" }}>
                    Tagged {item.flaggedAtIST || "Recently"}
                  </div>
                  <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                    <button
                      style={{
                        flex: 1,
                        padding: "6px 0",
                        background: "#F97316",
                        border: "none",
                        borderRadius: 7,
                        color: "#fff",
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      Open
                    </button>
                    <button
                      onClick={() => unflagMutation.mutate(item)}
                      disabled={unflagMutation.isPending}
                      style={{
                        flex: 1,
                        padding: "6px 0",
                        background: "#F1F5F9",
                        border: "none",
                        borderRadius: 7,
                        color: "#64748B",
                        fontSize: 12,
                        fontWeight: 500,
                        cursor: "pointer",
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {filtered.length > 8 && (
          <div style={{ textAlign: "center", marginTop: 20 }}>
            <button
              style={{
                padding: "10px 28px",
                border: "1px solid #E2E8F0",
                borderRadius: 8,
                background: "#fff",
                color: "#475569",
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              Show more items ∨
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Root Page ─────────────────────────────────────────────────────────────────
export default function PerformancePage() {
  return (
    <div style={S.page} className="w-full">
      <PeriodBar />
      <div style={S.container}>
        <PerformanceSummary />
        <TimetableAdherence />
        <ChapterPerformance />
        <MockTestSection />
        <WeakAreasSection />
        <RevisionQueue />
      </div>
    </div>
  );
}
