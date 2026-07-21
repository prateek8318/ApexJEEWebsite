import { ReactNode } from "react";
import Header from "@/components/common/header";
import SidebarWrapper from "@/components/common/SidebarWrapper";

const OthersLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <main className="flex w-full items-stretch justify-between">
      {/* Sidebar — always visible */}
      <SidebarWrapper />

      {/* Main content area */}
      <section className="flex h-screen flex-1 flex-col items-center justify-start w-full max-w-full overflow-hidden">
        <Header logoVisible={false} />
        <div className="flex-1 w-full max-w-full overflow-y-auto">
          {children}
        </div>
      </section>
    </main>
  );
};

export default OthersLayout;