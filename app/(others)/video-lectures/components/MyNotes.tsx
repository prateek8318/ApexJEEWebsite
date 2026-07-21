"use client";

import { useState } from "react";
import { PenLine } from "lucide-react";

interface MyNotesProps {
  initialNote?: string;
  onSave?: (note: string) => void;
}

export default function MyNotes({ initialNote = "", onSave }: MyNotesProps) {
  const [note, setNote] = useState(initialNote);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onSave?.(note);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="notes-wrapper">
      <div className="notes-header">
        <PenLine size={16} color="#f59e0b" />
        <div>
          <p className="notes-title">My Notes</p>
          <p className="notes-sub">Saved per video</p>
        </div>
      </div>

      <textarea
        className="notes-textarea"
        placeholder="Type your notes here while watching... Key formulas, observations, things to remember."
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={4}
      />

      <div className="notes-footer">
        <span className="notes-hint">Notes are saved per video · Use for quick revision later</span>
        <button
          className={`save-btn ${saved ? "saved" : ""}`}
          onClick={handleSave}
        >
          {saved ? "✓ Saved!" : "Save Note"}
        </button>
      </div>

      <style jsx>{`
        .notes-wrapper {
          background: #fff;
          margin: 12px 0;
          border-radius: 12px;
          border: 1px solid #ececf5;
          padding: 16px;
        }
        .notes-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
        }
        .notes-title {
          font-size: 14px;
          font-weight: 700;
          color: #f59e0b;
          margin: 0;
        }
        .notes-sub {
          font-size: 11px;
          color: #aaa;
          margin: 0;
        }
        .notes-textarea {
          width: 100%;
          border: 1px solid #e8eaf0;
          border-radius: 8px;
          padding: 12px;
          font-size: 13px;
          color: #333;
          resize: vertical;
          font-family: inherit;
          line-height: 1.6;
          background: #fafafa;
          transition: border-color 0.2s;
          box-sizing: border-box;
          outline: none;
        }
        .notes-textarea:focus {
          border-color: #a5b4fc;
          background: #fff;
        }
        .notes-textarea::placeholder {
          color: #bbb;
        }
        .notes-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 10px;
        }
        .notes-hint {
          font-size: 11px;
          color: #bbb;
        }
        .save-btn {
          padding: 8px 20px;
          border-radius: 8px;
          border: none;
          background: linear-gradient(135deg, #6366f1, #818cf8);
          color: #fff;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .save-btn:hover {
          filter: brightness(1.1);
          transform: translateY(-1px);
        }
        .save-btn.saved {
          background: linear-gradient(135deg, #10b981, #34d399);
        }
      `}</style>
    </div>
  );
}