import { cn } from "@lib/utils";
import { ReactNode } from "react";

export const timetableStyles = {
  page: "min-h-full bg-[#f4f7f9] px-5 py-7 md:px-10 md:py-9",
    container: "mx-auto flex w-full flex-col gap-8",
  card: "rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm md:p-7",
  title: "font-serif text-[1.35rem] font-bold tracking-tight text-slate-900 md:text-[1.5rem]",
  subtitle: "mt-1 max-w-2xl text-[13px] leading-relaxed text-slate-500",
  sectionTitle: "text-[13px] font-bold text-[#1e3a5f]",
  label: "text-[10px] font-bold tracking-wider text-slate-500 uppercase",
  iconBox: "flex size-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600",
  primaryBtn:
    "inline-flex items-center gap-2 rounded-xl bg-[#e8940a] px-5 py-2 text-[13px] font-semibold text-white shadow-sm transition-colors hover:bg-[#d48409]",
  secondaryBtn:
    "inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2 text-[13px] font-semibold text-slate-600 transition-colors hover:bg-slate-50",
  darkBtn:
    "rounded-xl bg-[#0a1628] px-5 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#0f1f3d]",
} as const;

type Props = {
  children: ReactNode;
  className?: string;
};

const TimetableSection = ({ children, className }: Props) => (
  <section className={cn(timetableStyles.card, className)}>{children}</section>
);

export default TimetableSection;
