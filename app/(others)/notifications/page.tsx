"use client";

import { useState } from "react";
import NotificationCard, {
  NotificationItem,
  NotificationType,
} from "./components/NotificationCard";
import NotificationTabs, { TabType } from "./components/NotificationTabs";

const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "1",
    type: "academic",
    title: "New Mock Test Published",
    description:
      "JEE Advanced Full Mock #18 is now available for attempt. This test focuses on electromagnetics and organic synthesis pathways.",
    time: "2 mins ago",
    isRead: false,
    actionLabel: "Take Test",
    secondaryActionLabel: "Dismiss",
  },
  {
    id: "2",
    type: "community",
    title: "New Reply to your Doubt",
    description:
      'Mentor Arjun responded to your query on "Integration by Parts: Special Cases". He provided a new shortcut for recurring integrals.',
    time: "3 hours ago",
    isRead: false,
    actionLabel: "View Reply",
  },
  {
    id: "3",
    type: "progress",
    title: "Weekly Progress Report",
    description:
      "Your Organic Chemistry mastery increased by 12%! Click here to see your comparative analysis with the top 100 students.",
    time: "Yesterday",
    isRead: true,
    actionLabel: "Open Analytics",
  },
  {
    id: "4",
    type: "security",
    title: "Security Alert",
    description:
      "A new login was detected from a Windows device in Mumbai, India. If this wasn't you, please change your password immediately.",
    time: "2 days ago",
    isRead: true,
  },
];

const TAB_TYPE_MAP: Record<TabType, NotificationType[]> = {
  all: ["academic", "schedule", "community", "security", "progress"],
  academic: ["academic", "progress"],
  schedule: ["schedule"],
  community: ["community"],
};

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [notifications, setNotifications] =
    useState<NotificationItem[]>(MOCK_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filteredNotifications = notifications.filter((n) =>
    TAB_TYPE_MAP[activeTab].includes(n.type),
  );

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleDismiss = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleAction = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
  };

  return (
    <div
      style={{
        minHeight: "1000vh",
        background: "#F0F2F8",
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "6500px",
          margin: "0 auto",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "28px",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "26px",
                fontWeight: 700,
                color: "#0F172A",
                margin: 0,
                letterSpacing: "-0.3px",
              }}
            >
              Notifications
            </h1>
            <p
              style={{
                fontSize: "14px",
                color: "#94A3B8",
                margin: "4px 0 0",
              }}
            >
              Stay updated with your personalized learning journey.
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              style={{
                background: "transparent",
                border: "none",
                color: "#4F46E5",
                fontSize: "13.5px",
                fontWeight: 500,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 0",
                marginTop: "4px",
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Mark all as read
            </button>
          )}
        </div>

        {/* Card container */}
        <div
          style={{
            background: "#fff",
            borderRadius: "16px",
            padding: "24px 24px 12px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          }}
        >
          <NotificationTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            totalCount={notifications.length}
          />

          {filteredNotifications.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "48px 24px",
                color: "#94A3B8",
              }}
            >
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                style={{
                  margin: "0 auto 12px",
                  display: "block",
                  opacity: 0.5,
                }}
              >
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <p style={{ fontSize: "15px", fontWeight: 500 }}>
                No notifications here
              </p>
              <p style={{ fontSize: "13px", marginTop: "4px" }}>
                You&apos;re all caught up!
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onDismiss={handleDismiss}
                onAction={handleAction}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
