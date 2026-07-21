"use client";


export type TabType = "all" | "academic" | "schedule" | "community";

interface Tab {
  id: TabType;
  label: string;
  count?: number;
}

interface NotificationTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  totalCount: number;
}

export default function NotificationTabs({ activeTab, onTabChange, totalCount }: NotificationTabsProps) {
  const tabs: Tab[] = [
    { id: "all", label: "All", count: totalCount },
    { id: "academic", label: "Academic" },
    { id: "schedule", label: "Schedule" },
    { id: "community", label: "Community" },
  ];

  return (
    <div
      style={{
        display: "flex",
        gap: "4px",
        borderBottom: "1px solid #F1F5F9",
        marginBottom: "20px",
      }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            style={{
              padding: "10px 16px",
              border: "none",
              background: "transparent",
              fontSize: "14px",
              fontWeight: isActive ? 600 : 400,
              color: isActive ? "#1E293B" : "#94A3B8",
              cursor: "pointer",
              borderBottom: isActive ? "2px solid #4F46E5" : "2px solid transparent",
              marginBottom: "-1px",
              borderRadius: 0,
              transition: "color 0.15s",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span
                style={{
                  background: isActive ? "#EEF2FF" : "#F1F5F9",
                  color: isActive ? "#4F46E5" : "#94A3B8",
                  borderRadius: "20px",
                  padding: "1px 8px",
                  fontSize: "12px",
                  fontWeight: 600,
                }}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}