import { ReactNode } from "react";
import AdminSidebar from "@/components/admin/admin-sidebar";
import AdminHeader from "@/components/admin/admin-header";

const AdminLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <main className="flex w-full items-stretch justify-between">
      {/* Sidebar — always visible */}
      <AdminSidebar />

      {/* Main content area */}
      <section className="flex h-screen flex-1 flex-col items-center justify-start w-full max-w-full overflow-hidden bg-[#F8FAFC]">
        <AdminHeader />
        <div className="flex-1 w-full max-w-full overflow-y-auto p-4 md:p-6 lg:p-8 pb-12">
          {children}
        </div>
      </section>
    </main>
  );
};

export default AdminLayout;
