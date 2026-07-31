"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@components/common/sidebar";

import { 
  LayoutDashboard, 
  BookOpen, 
  Library, 
  HelpCircle, 
  Crown,
  Users
} from "lucide-react";

const adminMenuItems = [
  { uuid: "admin-1", name: "Dashboard", src: "/admin/dashboard", icon: <LayoutDashboard />, subMenus: [] },
  { 
    uuid: "admin-content", 
    name: "Content Base", 
    src: "/admin/content", 
    icon: <BookOpen />, 
    subMenus: [
      { uuid: "admin-2", name: "Subjects", src: "/admin/subjects", subMenus: [] },
      { uuid: "admin-3", name: "Chapters", src: "/admin/chapters", subMenus: [] },
      { uuid: "admin-4", name: "Topics", src: "/admin/topics", subMenus: [] },
    ] 
  },
  { 
    uuid: "admin-study", 
    name: "Study Material", 
    src: "/admin/study",
    icon: <Library />, 
    subMenus: [
      { uuid: "admin-6", name: "Video Lectures", src: "/admin/videos", subMenus: [] },
      { uuid: "admin-7", name: "Revision Notes", src: "/admin/notes", subMenus: [] },
    ] 
  },
  { 
    uuid: "admin-assessment", 
    name: "Assessment", 
    src: "/admin/assessment",
    icon: <HelpCircle />, 
    subMenus: [
      { uuid: "admin-5", name: "Questions Bank", src: "/admin/questions", subMenus: [] },
      { uuid: "admin-8", name: "Mock Tests", src: "/admin/tests", subMenus: [] },
    ] 
  },
  { 
    uuid: "admin-monetization", 
    name: "Monetization", 
    src: "/admin/monetization",
    icon: <Crown />, 
    subMenus: [
      { uuid: "admin-9", name: "Subscription Plans", src: "/admin/plans", subMenus: [] },
    ] 
  },
  { 
    uuid: "admin-users-group", 
    name: "User Management", 
    src: "/admin/users-management",
    icon: <Users />, 
    subMenus: [
      { uuid: "admin-10", name: "User Master", src: "/admin/users", subMenus: [] },
      { uuid: "admin-11", name: "Admin Approvals", src: "/admin/approvals", subMenus: [] },
    ] 
  },
];

export default function AdminSidebarWrapper() {
  const pathname = usePathname();
  if (pathname === "/login" || pathname === "/signin") {
    return null;
  }
  return <Sidebar menuItemsData={adminMenuItems} />;
}
