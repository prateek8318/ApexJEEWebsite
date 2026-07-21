"use client";

import { useState, useRef } from "react";
import { Play, Pause, Volume2, Maximize, Settings } from "lucide-react";

interface VideoPlayerProps {
  videoUrl?: string;
  thumbnailUrl?: string;
}

export default function VideoPlayer({
  videoUrl,
  thumbnailUrl,
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hovered, setHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (!videoRef.current) {
      setIsPlaying((p) => !p);
      return;
    }
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying((p) => !p);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const pct =
      (videoRef.current.currentTime / videoRef.current.duration) * 100;
    setProgress(pct || 0);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = pct * videoRef.current.duration;
    setProgress(pct * 100);
  };

  return (
    <div
      className="player-wrapper"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {videoUrl ? (
        <video
          ref={videoRef}
          src={videoUrl}
          poster={thumbnailUrl}
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => setIsPlaying(false)}
          className="video-el"
        />
      ) : (
        <div className="placeholder-bg" />
      )}

      {/* Centre play button */}
      <button
        className={`centre-play ${isPlaying ? "hide" : ""}`}
        onClick={togglePlay}
      >
        <div className="play-circle">
          <Play size={28} fill="white" color="white" />
        </div>
      </button>

      {/* Bottom controls */}
      <div className={`controls ${hovered || !isPlaying ? "visible" : ""}`}>
        <div className="seek-bar" onClick={handleSeek}>
          <div className="seek-fill" style={{ width: `${progress}%` }} />
          <div className="seek-thumb" style={{ left: `${progress}%` }} />
        </div>
        <div className="ctrl-row">
          <div className="ctrl-left">
            <button className="ctrl-btn" onClick={togglePlay}>
              {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            </button>
            <button className="ctrl-btn">
              <Volume2 size={18} />
            </button>
          </div>
          <div className="ctrl-right">
            <button className="ctrl-btn">
              <Settings size={16} />
            </button>
            <button className="ctrl-btn">
              <Maximize size={16} />
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .player-wrapper {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          background: #0d0d1a;
          overflow: hidden;
          cursor: pointer;
        }
        .video-el {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        .placeholder-bg {
          width: 100%;
          height: 100%;
          background: radial-gradient(
            ellipse at center,
            #1a1a3e 0%,
            #0a0a18 100%
          );
        }
        .centre-play {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: opacity 0.2s;
        }
        .centre-play.hide {
          opacity: 0;
          pointer-events: none;
        }
        .play-circle {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: rgba(99, 102, 241, 0.75);
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(4px);
          border: 2px solid rgba(255, 255, 255, 0.2);
          transition:
            transform 0.15s,
            background 0.15s;
        }
        .play-circle:hover {
          transform: scale(1.1);
          background: rgba(99, 102, 241, 0.9);
        }
        .controls {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 16px 16px 12px;
          background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
          opacity: 0;
          transition: opacity 0.25s;
        }
        .controls.visible {
          opacity: 1;
        }
        .seek-bar {
          position: relative;
          height: 4px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 2px;
          cursor: pointer;
          margin-bottom: 10px;
        }
        .seek-bar:hover {
          height: 6px;
        }
        .seek-fill {
          height: 100%;
          background: #6366f1;
          border-radius: 2px;
          pointer-events: none;
        }
        .seek-thumb {
          position: absolute;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #6366f1;
          pointer-events: none;
        }
        .ctrl-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .ctrl-left,
        .ctrl-right {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .ctrl-btn {
          background: transparent;
          border: none;
          color: white;
          padding: 6px;
          cursor: pointer;
          border-radius: 6px;
          display: flex;
          align-items: center;
          transition: background 0.15s;
        }
        .ctrl-btn:hover {
          background: rgba(255, 255, 255, 0.12);
        }
      `}</style>
    </div>
  );
}
