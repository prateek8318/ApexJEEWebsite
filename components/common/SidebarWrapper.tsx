"use client";

import { usePathname } from "next/navigation";
import StudentSidebar from "./StudentSidebar";

export default function SidebarWrapper() {
  const pathname = usePathname();
  if (pathname === "/login" || pathname === "/signin") {
    return null;
  }
  return <StudentSidebar />;
}
