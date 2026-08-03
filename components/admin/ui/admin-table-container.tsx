import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AdminTableContainerProps {
  searchPlaceholder: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  children: ReactNode;
  colorTheme?: 'indigo' | 'emerald' | 'amber' | 'violet' | 'cyan' | 'rose' | 'slate' | 'blue';
  actionRight?: ReactNode;
}

const ringColorMap = {
  indigo: "focus-visible:ring-indigo-500",
  emerald: "focus-visible:ring-emerald-500",
  amber: "focus-visible:ring-amber-500",
  violet: "focus-visible:ring-violet-500",
  cyan: "focus-visible:ring-cyan-500",
  rose: "focus-visible:ring-rose-500",
  slate: "focus-visible:ring-slate-500",
  blue: "focus-visible:ring-blue-500",
};

export function AdminTableContainer({
  searchPlaceholder,
  searchValue,
  onSearchChange,
  children,
  colorTheme = 'indigo',
  actionRight
}: AdminTableContainerProps) {
  const ringColor = ringColorMap[colorTheme] || ringColorMap.indigo;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col gap-6 mt-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center w-full max-w-md relative">
          <Search className="h-4 w-4 absolute left-3 text-slate-400" />
          <Input 
            placeholder={searchPlaceholder} 
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className={cn(`pl-9 h-10 bg-slate-50/50 border border-slate-200 shadow-sm rounded-lg text-sm outline-none focus:border-blue-500`, ringColor)}
          />
        </div>
        {actionRight && (
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {actionRight}
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        {children}
      </div>
    </div>
  );
}
