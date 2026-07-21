"use client";

import { AlertTriangle, ArrowLeft, CheckSquare } from "lucide-react";

interface SubmitModalProps {
  stats: {
    answered: number;
    skipped: number;
    marked: number;
    notAttempted: number;
  };
  onClose: () => void;
  onSubmit: () => void;
}

export default function SubmitModal({ stats, onClose, onSubmit }: SubmitModalProps) {
  const totalUnanswered = stats.skipped + stats.notAttempted + stats.marked;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden border border-slate-200 text-slate-800 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Body */}
        <div className="p-6 md:p-8 space-y-6">
          
          {/* Header Warning */}
          <div className="flex gap-4">
            <div className="h-12 w-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 shrink-0 border border-amber-100">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Submit Test?</h3>
              <p className="text-sm text-slate-500 mt-1">
                {totalUnanswered > 0 
                  ? `${totalUnanswered} questions unanswered or flagged. `
                  : "All questions completed. "}
                Submitting is final — your score and expected All-India rank are shown immediately.
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            
            {/* Answered */}
            <div className="bg-emerald-50/70 border border-emerald-100/60 rounded-2xl p-4 text-center">
              <div className="text-3xl font-extrabold text-emerald-600">{stats.answered}</div>
              <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider mt-1">Answered</div>
            </div>

            {/* Skipped */}
            <div className="bg-amber-50/70 border border-amber-100/60 rounded-2xl p-4 text-center">
              <div className="text-3xl font-extrabold text-amber-600">{stats.skipped}</div>
              <div className="text-xs font-bold text-amber-800 uppercase tracking-wider mt-1">Skipped</div>
            </div>

            {/* Marked */}
            <div className="bg-purple-50/70 border border-purple-100/60 rounded-2xl p-4 text-center">
              <div className="text-3xl font-extrabold text-purple-600">{stats.marked}</div>
              <div className="text-xs font-bold text-purple-800 uppercase tracking-wider mt-1">Marked</div>
            </div>

            {/* Not Attempted */}
            <div className="bg-slate-100/80 border border-slate-200/50 rounded-2xl p-4 text-center">
              <div className="text-3xl font-extrabold text-slate-500">{stats.notAttempted}</div>
              <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mt-1">Not attempted</div>
            </div>

          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 p-6 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-slate-100">
          <button 
            onClick={onClose}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-800 font-bold text-xs py-3.5 px-6 rounded-xl border border-slate-200 transition-all active:scale-[0.98] cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" /> Continue Test
          </button>
          
          <button 
            onClick={onSubmit}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs py-3.5 px-7 rounded-xl shadow-md hover:shadow-amber-500/20 transition-all active:scale-[0.98] cursor-pointer"
          >
            <CheckSquare className="h-4 w-4" /> Submit & See Results
          </button>
        </div>

      </div>
    </div>
  );
}
