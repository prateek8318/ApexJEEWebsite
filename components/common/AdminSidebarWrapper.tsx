"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@components/common/sidebar";

import { 
  LayoutDashboard, 
  BookOpen, 
  Layers, 
  Library, 
  HelpCircle, 
  Video, 
  FileText 
} from "lucide-react";

const adminMenuItems = [
  { uuid: "admin-1", name: "Dashboard", src: "/admin/dashboard", icon: <LayoutDashboard /> },
  { uuid: "admin-2", name: "Subjects", src: "/admin/subjects", icon: <BookOpen /> },
  { uuid: "admin-3", name: "Chapters", src: "/admin/chapters", icon: <Layers /> },
  { uuid: "admin-4", name: "Topics", src: "/admin/topics", icon: <Library /> },
  { uuid: "admin-5", name: "Questions", src: "/admin/questions", icon: <HelpCircle /> },
  { uuid: "admin-6", name: "Videos", src: "/admin/videos", icon: <Video /> },
  { uuid: "admin-7", name: "Notes", src: "/admin/notes", icon: <FileText /> },
];

export default function AdminSidebarWrapper() {
  const pathname = usePathname();
  if (pathname === "/login" || pathname === "/signin") {
    return null;
  }
  return <Sidebar menuItemsData={adminMenuItems} />;
}
