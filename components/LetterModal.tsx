import React from 'react';
import { X, Mail, Send } from 'lucide-react';

interface LetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  providerName: string;
  providerFax: string;
}

export const LetterModal: React.FC<LetterModalProps> = ({ isOpen, onClose, providerName, providerFax }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-50 rounded-md">
              <Mail size={18} className="text-indigo-600" />
            </div>
            <h3 className="font-semibold text-slate-800">
              Letter to {providerName} <span className="text-slate-500 font-normal">(Fax: {providerFax})</span>
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Letter Type</label>
            <div className="relative">
              <select className="w-full appearance-none bg-white border border-slate-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-700 shadow-sm">
                <option>Consultation Report</option>
                <option>Procedure Summary</option>
                <option>Follow-up Note</option>
                <option>Custom Letter</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Letter Body</label>
            <textarea 
              className="w-full border border-slate-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent h-32 resize-y text-slate-700 leading-relaxed shadow-sm"
              defaultValue={`Dear Dr. Sharma,\n\nThank you for referring your patient. Please find below the consultation summary:`}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-4 flex items-center justify-end gap-3 border-t border-slate-100">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors shadow-sm"
          >
            Cancel
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#0e7490] rounded-md hover:bg-[#155e75] transition-colors shadow-sm">
            <Send size={14} />
            Send/Fax Letter
          </button>
        </div>
      </div>
    </div>
  );
};