"use client";

import { ChevronLeft, ChevronRight, Check, Flag, AlignJustify, Link2 } from "lucide-react";

interface LectureControlsProps {
  onPrev: () => void;
  onNext: () => void;
  onMarkWatched: () => void;
  isWatched: boolean;
  lectureNumber: number;
  lectureTitle: string;
  duration: string;
}

export default function LectureControls({
  onPrev,
  onNext,
  onMarkWatched,
  isWatched,
  lectureNumber,
  lectureTitle,
  duration,
}: LectureControlsProps) {
  return (
    <div className="lecture-controls-wrapper">
      {/* Navigation Row */}
      <div className="nav-row">
        <div className="nav-btns">
          <button className="nav-btn" onClick={onPrev}>
            <ChevronLeft size={15} />
            Previous
          </button>
          <button className="nav-btn" onClick={onNext}>
            Next
            <ChevronRight size={15} />
          </button>
        </div>
        <button
          className={`mark-btn ${isWatched ? "watched" : ""}`}
          onClick={onMarkWatched}
        >
          <Check size={14} strokeWidth={2.5} />
          {isWatched ? "Watched" : "Mark as Watched"}
        </button>
        <button className="flag-btn">
          <Flag size={15} fill="#ef4444" color="#ef4444" />
          Flag Video
        </button>
      </div>

      {/* Lecture Meta Row */}
      <div className="lecture-meta">
        <div className="lecture-title-row">
          <span className="lecture-num">{lectureNumber}.</span>
          <h2 className="lecture-title">{lectureTitle}</h2>
          <div className="meta-actions">
            <button className="meta-btn"><Flag size={14} color="#ef4444" fill="#ef4444" /></button>
            <button className="meta-btn"><AlignJustify size={14} /></button>
            <button className="meta-btn"><Link2 size={14} /></button>
          </div>
        </div>
        <div className="lecture-tags">
          <span className="tag lecture-tag">Lecture</span>
          <span className="tag duration-tag">🕐 {duration}</span>
        </div>
      </div>

      <style jsx>{`
        .lecture-controls-wrapper {
          background: #ffffff;
          border-bottom: 1px solid #e8eaf0;
        }
        .nav-row {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          border-bottom: 1px solid #f0f0f5;
        }
        .nav-btns {
          display: flex;
          gap: 6px;
          flex: 1;
        }
        .nav-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 7px 14px;
          border-radius: 8px;
          border: 1px solid #e0e0ea;
          background: #fff;
          font-size: 13px;
          color: #444;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.15s;
        }
        .nav-btn:hover {
          background: #f5f5ff;
          border-color: #c5c5f0;
        }
        .mark-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 7px 16px;
          border-radius: 8px;
          border: none;
          background: #f59e0b;
          color: #fff;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.15s;
        }
        .mark-btn.watched {
          background: #10b981;
        }
        .mark-btn:hover {
          filter: brightness(1.08);
        }
        .flag-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          border-radius: 8px;
          border: 1px solid #fecaca;
          background: #fff5f5;
          color: #ef4444;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s;
        }
        .flag-btn:hover {
          background: #fee2e2;
        }
        .lecture-meta {
          padding: 14px 16px 12px;
        }
        .lecture-title-row {
          display: flex;
          align-items: flex-start;
          gap: 6px;
          margin-bottom: 8px;
        }
        .lecture-num {
          font-size: 16px;
          font-weight: 700;
          color: #222;
          flex-shrink: 0;
        }
        .lecture-title {
          font-size: 16px;
          font-weight: 700;
          color: #1a1a2e;
          line-height: 1.3;
          margin: 0;
          flex: 1;
        }
        .meta-actions {
          display: flex;
          gap: 4px;
          flex-shrink: 0;
        }
        .meta-btn {
          background: transparent;
          border: none;
          color: #888;
          cursor: pointer;
          padding: 4px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          transition: background 0.15s, color 0.15s;
        }
        .meta-btn:hover {
          background: #f0f0f8;
          color: #444;
        }
        .lecture-tags {
          display: flex;
          gap: 8px;
          align-items: center;
        }
        .tag {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          font-weight: 500;
          border-radius: 6px;
          padding: 3px 10px;
        }
        .lecture-tag {
          background: #ede9fe;
          color: #7c3aed;
          border: 1px solid #ddd6fe;
        }
        .duration-tag {
          background: #f3f4f6;
          color: #555;
          border: 1px solid #e5e7eb;
        }
      `}</style>
    </div>
  );
}