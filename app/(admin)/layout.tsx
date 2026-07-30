import { ReactNode } from "react";
import Header from "@/components/common/header";
import AdminSidebarWrapper from "@/components/common/AdminSidebarWrapper";

const AdminLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <main className="flex w-full items-stretch justify-between">
      {/* Sidebar — always visible */}
      <AdminSidebarWrapper />

      {/* Main content area */}
      <section className="flex h-screen flex-1 flex-col items-center justify-start w-full max-w-full overflow-hidden bg-background">
        <Header logoVisible={false} />
        <div className="flex-1 w-full max-w-full overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </section>
    </main>
  );
};

export default AdminLayout;
