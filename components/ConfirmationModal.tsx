import React from 'react';
import { AlertCircle, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/60 p-4 animate-in fade-in duration-300 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <AlertCircle className="text-red-500" size={20} />
            <h3 className="text-[14px] font-bold text-[#334155] uppercase tracking-wider">
              {title}
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-8">
          <p className="text-sm text-slate-600 leading-relaxed">
            {message}
          </p>
        </div>

        <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 text-[12px] font-bold text-[#5c6d82] bg-white border border-[#e2e8f0] rounded-md hover:bg-slate-50 transition-all uppercase tracking-wider"
          >
            Cancel
          </button>
          <button 
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-6 py-2.5 text-[12px] font-bold text-white bg-red-500 rounded-md hover:bg-red-600 shadow-sm transition-all uppercase tracking-wider"
          >
            Remove Item
          </button>
        </div>
      </div>
    </div>
  );
};