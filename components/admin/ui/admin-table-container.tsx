import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { ReactNode } from "react";

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
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center w-full max-w-md relative">
          <Search className="h-4 w-4 absolute left-3 text-slate-400" />
          <Input 
            placeholder={searchPlaceholder} 
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className={`pl-9 h-11 bg-white border-slate-200 shadow-sm rounded-lg ${ringColor}`}
          />
        </div>
        {actionRight && (
          <div className="flex items-center gap-2">
            {actionRight}
          </div>
        )}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {children}
      </div>
    </div>
  );
}
