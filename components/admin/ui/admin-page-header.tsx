import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface AdminPageHeaderProps {
  title: string;
  description: string;
  buttonText?: string;
  onAdd?: () => void;
  icon?: ReactNode;
  colorTheme?: 'indigo' | 'emerald' | 'amber' | 'violet' | 'cyan' | 'rose' | 'slate' | 'blue';
  extraButtons?: ReactNode;
}

const themeMap = {
  indigo: { button: "bg-indigo-600 hover:bg-indigo-700" },
  emerald: { button: "bg-emerald-600 hover:bg-emerald-700" },
  amber: { button: "bg-amber-600 hover:bg-amber-700" },
  violet: { button: "bg-violet-600 hover:bg-violet-700" },
  cyan: { button: "bg-cyan-600 hover:bg-cyan-700" },
  rose: { button: "bg-rose-600 hover:bg-rose-700" },
  slate: { button: "bg-slate-800 hover:bg-slate-900" },
  blue: { button: "bg-blue-600 hover:bg-blue-700" },
};

export function AdminPageHeader({
  buttonText,
  onAdd,
  icon,
  colorTheme = 'indigo',
  extraButtons
}: AdminPageHeaderProps) {
  const theme = themeMap[colorTheme] || themeMap.indigo;

  return (
    <div className="flex justify-end items-center gap-3 w-full sm:w-auto mb-4">
      {extraButtons}
      {buttonText && onAdd && (
        <Button 
          onClick={onAdd} 
          className={`${theme.button} text-white shadow-md hover:shadow-lg h-10 px-6 rounded-lg font-bold text-sm transition-all w-full sm:w-auto`}
        >
          {icon && <span className="mr-2 h-4 w-4 flex items-center justify-center">{icon}</span>}
          {buttonText}
        </Button>
      )}
    </div>
  );
}
