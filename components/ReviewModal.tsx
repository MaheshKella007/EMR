import React from 'react';
import { Check, RotateCcw, Eye } from 'lucide-react';

interface ReviewModalProps {
  isOpen: boolean;
  stepCurrent: number;
  stepTotal: number;
  title: string;
  children: React.ReactNode;
  onApprove: () => void;
  onReset: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ 
  isOpen, 
  stepCurrent, 
  stepTotal, 
  title, 
  children, 
  onApprove, 
  onReset 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 p-4 animate-in fade-in duration-200 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200 overflow-hidden ring-1 ring-slate-900/5">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-white">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">
                {stepCurrent}
              </span>
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                of {stepTotal} steps
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">Review: {title}</h2>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-sm text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
            <Eye size={16} />
            <span>Preview Mode</span>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-slate-50/50 p-6">
          <div className="max-w-3xl mx-auto">
             {children}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-5 border-t border-slate-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={onReset}
            className="w-full sm:w-auto flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all focus:ring-2 focus:ring-slate-100 focus:outline-none"
          >
            <RotateCcw size={18} />
            Reset
          </button>
          
          <div className="text-xs text-slate-400 font-medium hidden sm:block">
            Verify or add data manually
          </div>

          <button
            onClick={onApprove}
            className="w-full sm:w-auto flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-3 text-sm font-bold text-white bg-teal-600 rounded-lg hover:bg-teal-700 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all focus:ring-2 focus:ring-teal-100 focus:outline-none"
          >
            <Check size={18} />
            Approve
          </button>
        </div>
      </div>
    </div>
  );
};