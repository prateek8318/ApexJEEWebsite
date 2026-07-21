"use client";

import type { JSX } from "react";

export type NotificationType = "academic" | "schedule" | "community" | "security" | "progress";

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  time: string;
  isRead: boolean;
  actionLabel?: string;
  actionHref?: string;
  secondaryActionLabel?: string;
  accentColor?: string;
}

interface NotificationCardProps {
  notification: NotificationItem;
  onDismiss?: (id: string) => void;
  onAction?: (id: string) => void;
}

const iconMap: Record<NotificationType, JSX.Element> = {
  academic: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  ),
  schedule: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  community: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  security: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  progress: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
};

const colorMap: Record<NotificationType, { bg: string; icon: string; border: string }> = {
  academic: { bg: "#EEF2FF", icon: "#4F46E5", border: "#4F46E5" },
  schedule: { bg: "#FFF7ED", icon: "#EA580C", border: "#EA580C" },
  community: { bg: "#FFF7ED", icon: "#EA580C", border: "#EA580C" },
  security: { bg: "#FEF2F2", icon: "#DC2626", border: "#DC2626" },
  progress: { bg: "#F0FDF4", icon: "#16A34A", border: "#16A34A" },
};

export default function NotificationCard({ notification, onDismiss, onAction }: NotificationCardProps) {
  const colors = colorMap[notification.type];

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "12px",
        padding: "20px 24px",
        marginBottom: "12px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        borderLeft: `3px solid ${notification.isRead ? "transparent" : colors.border}`,
        display: "flex",
        gap: "16px",
        alignItems: "flex-start",
        transition: "box-shadow 0.2s",
        cursor: "default",
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "10px",
          background: colors.bg,
          color: colors.icon,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          marginTop: "2px",
        }}
      >
        {iconMap[notification.type]}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
          <h3
            style={{
              fontSize: "15px",
              fontWeight: 600,
              color: "#1E293B",
              margin: 0,
              lineHeight: 1.4,
            }}
          >
            {notification.title}
          </h3>
          <span
            style={{
              fontSize: "12px",
              color: notification.isRead ? "#94A3B8" : colors.icon,
              whiteSpace: "nowrap",
              flexShrink: 0,
              fontWeight: notification.isRead ? 400 : 500,
            }}
          >
            {!notification.isRead && "● "}{notification.time}
          </span>
        </div>

        <p
          style={{
            fontSize: "13.5px",
            color: "#64748B",
            margin: "6px 0 14px",
            lineHeight: 1.6,
          }}
        >
          {notification.description}
        </p>

        {/* Actions */}
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          {notification.actionLabel && (
            <button
              onClick={() => onAction?.(notification.id)}
              style={{
                padding: "8px 18px",
                borderRadius: "8px",
                background: colors.icon,
                color: "#fff",
                border: "none",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              {notification.actionLabel}
            </button>
          )}

          {notification.secondaryActionLabel && (
            <button
              onClick={() => onDismiss?.(notification.id)}
              style={{
                padding: "8px 14px",
                borderRadius: "8px",
                background: "transparent",
                color: "#94A3B8",
                border: "none",
                fontSize: "13px",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              {notification.secondaryActionLabel}
            </button>
          )}

          {notification.type === "progress" && notification.actionLabel && (
            <span style={{ fontSize: "13px", color: colors.icon, fontWeight: 500, cursor: "pointer" }}>
              {notification.actionLabel} →
            </span>
          )}
        </div>
      </div>
    </div>
  );
}