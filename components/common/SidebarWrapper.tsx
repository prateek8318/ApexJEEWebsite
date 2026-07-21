"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@components/common/sidebar";

// -------------------------------------------------------------------
// Static menu items that are not returned from the backend API.
// Feel free to extend this array with any additional pages you want in the sidebar.
// The shape mirrors the MenuItem type expected by the Sidebar component.
// -------------------------------------------------------------------
const staticMenuItems = [
  { uuid: "static-1", name: "Dashboard", src: "/dashboard" },
  // { uuid: "static-2", name: "Self Learning", src: "/self-learning" },
  { uuid: "static-2b", name: "Study Materials", src: "/study-materials" },
  { uuid: "static-3", name: "Video Lectures", src: "/video-lectures" },
  { uuid: "static-4", name: "Practice Questions", src: "/practice-questions" },
  { uuid: "static-5", name: "Revision Notes", src: "/revision-notes" },
  { uuid: "static-6", name: "Mock Tests", src: "/mock-tests" },
  { uuid: "static-7", name: "My TimeTable", src: "/timetable" },
  { uuid: "static-8", name: "My Performance", src: "/performance" },
  // { uuid: "static-9", name: "Analytics", src: "/analytics" },
  { uuid: "static-10", name: "Subscription & Billing", src: "/subscription-billing" },
  { uuid: "static-11", name: "Doubt Form", src: "/doubt-form" },
  { uuid: "static-12", name: "Notice Board", src: "/notice-board" },
  // { uuid: "static-12", name: "Courses", src: "/courses" },
  // { uuid: "static-13", name: "Lessons", src: "/lessons" },
];

export default function SidebarWrapper({ menuItems }: { menuItems?: any }) {
  const effectiveMenuItems = [...(menuItems ?? []), ...staticMenuItems];
  const pathname = usePathname();
  if (pathname === "/login" || pathname === "/signin") {
    return null;
  }
  return <Sidebar menuItemsData={effectiveMenuItems} />;

}
