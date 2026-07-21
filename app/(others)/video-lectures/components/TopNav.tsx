"use client";

import { ChevronDown } from "lucide-react";

interface TopNavProps {
  currentSubject: string;
  currentChapter: string;
  progress: number;
  watched: number;
  total: number;
}

export default function TopNav({
  currentSubject,
  currentChapter,
  progress,
  watched,
  total,
}: TopNavProps) {
  return (
    <div className="top-nav">
      <div className="nav-left">
        <div className="subject-tab active">
          <span className="subject-icon">⚡</span>
          <span>{currentSubject}</span>
          <ChevronDown size={14} />
        </div>
        <div className="subject-tab">
          <span className="subject-icon math">✳</span>
          <span>{currentChapter}</span>
          <ChevronDown size={14} />
        </div>
      </div>
      <div className="nav-right">
        <span className="progress-text">
          {watched} / {total} watched
        </span>
        <div className="progress-bar-track">
          <div
            className="progress-bar-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <style jsx>{`
        .top-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #1a1a2e;
          padding: 0 16px;
          height: 44px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        .nav-left {
          display: flex;
          gap: 8px;
        }
        .subject-tab {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 13px;
          color: #aaa;
          cursor: pointer;
          border: 1px solid transparent;
          transition: all 0.2s;
        }
        .subject-tab.active {
          background: rgba(99, 102, 241, 0.15);
          border-color: rgba(99, 102, 241, 0.4);
          color: #a5b4fc;
        }
        .subject-tab:hover {
          background: rgba(255, 255, 255, 0.06);
        }
        .subject-icon {
          font-size: 12px;
        }
        .subject-icon.math {
          color: #60a5fa;
        }
        .nav-right {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .progress-text {
          font-size: 12px;
          color: #888;
        }
        .progress-bar-track {
          width: 120px;
          height: 5px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 999px;
          overflow: hidden;
        }
        .progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #f59e0b, #fbbf24);
          border-radius: 999px;
          transition: width 0.4s ease;
        }
      `}</style>
    </div>
  );
}
