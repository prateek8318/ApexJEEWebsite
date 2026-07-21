"use client";
import Header from "./components/Header";
import DownloadsSection from "./components/DownloadsSection";
import ChaptersTable from "./components/ChaptersTable";

export default function Page() {
  return (
    <main className="bg-slate-100 min-h-screen p-6">
      <div className="max-w-8xl mx-auto space-y-6">
        <Header />
        <DownloadsSection />
        <ChaptersTable />
      </div>
    </main>
  );
}