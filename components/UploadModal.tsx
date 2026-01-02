import React, { useState, useRef } from 'react';
import { X, Folder, Upload, FileText, Trash2, ChevronDown, Tag } from 'lucide-react';

export interface FileWithMetadata {
  file: File;
  reportType: string;
  tag: string;
}

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (filesWithMetadata: FileWithMetadata[]) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onUpload }) => {
  const [reportType, setReportType] = useState('Lab Report');
  const [tag, setTag] = useState('GI Internal');
  const [selectedFiles, setSelectedFiles] = useState<FileWithMetadata[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(file => ({
        file,
        reportType,
        tag
      }));
      setSelectedFiles(prev => [...prev, ...newFiles]);
      // Reset input so user can pick the same file again if they want with different metadata
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUploadSubmit = () => {
    if (selectedFiles.length === 0) return;
    onUpload(selectedFiles);
    setSelectedFiles([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4 animate-in fade-in duration-200 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-[550px] overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-50">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Upload size={22} className="text-indigo-500" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></div>
            </div>
            <h3 className="font-bold text-[#334155] text-xl tracking-tight">Upload Patient Reports</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-1">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {/* Report Type */}
            <div>
              <label className="block text-[13px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Report Type</label>
              <div className="relative">
                <select 
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-slate-700 shadow-sm pr-10"
                >
                  <option>Lab Report</option>
                  <option>Imaging Report (CT, MRI, Ultrasound)</option>
                  <option>Pathology Report</option>
                  <option>Discharge Summary</option>
                  <option>Referral Letter</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                  <ChevronDown size={16} />
                </div>
              </div>
            </div>

            {/* Tag Document */}
            <div>
              <label className="block text-[13px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Tag Document</label>
              <div className="relative">
                <select 
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-slate-700 shadow-sm pr-10"
                >
                  <option>GI Internal</option>
                  <option>General</option>
                  <option>Preventive</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                  <ChevronDown size={16} />
                </div>
              </div>
            </div>
          </div>

          {/* Select File(s) */}
          <div className="relative">
            <div 
              className="border-2 border-dashed border-slate-200 rounded-xl p-8 bg-slate-50/50 hover:bg-slate-50 hover:border-teal-300 transition-all cursor-pointer group text-center"
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                multiple 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400 group-hover:text-teal-500 transition-colors">
                  <Upload size={24} />
                </div>
                <p className="text-sm font-semibold text-slate-600">Click to add files for selected category</p>
                <p className="text-xs text-slate-400">PDF, JPG, PNG or DOCX</p>
              </div>
            </div>
          </div>

          {/* File Queue */}
          {selectedFiles.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Selected Files Queue</h4>
                <span className="text-xs font-medium text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">{selectedFiles.length} items</span>
              </div>
              <div className="space-y-2 max-h-[200px] overflow-y-auto custom-scrollbar pr-1">
                {selectedFiles.map((item, idx) => (
                  <div key={idx} className="flex flex-col bg-white border border-slate-200 p-3 rounded-lg transition-all hover:border-teal-200 shadow-sm relative group/item">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <FileText size={16} className="text-teal-600 shrink-0" />
                        <span className="text-sm text-slate-800 truncate font-bold">{item.file.name}</span>
                        <span className="text-[10px] text-slate-400 shrink-0">({(item.file.size / 1024).toFixed(1)} KB)</span>
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                        className="text-slate-300 hover:text-red-500 transition-colors shrink-0 p-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <div className="flex items-center gap-1.5 px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded text-[10px] font-bold">
                        <Folder size={10} />
                        {item.reportType}
                      </div>
                      <div className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-100 text-slate-600 border border-slate-200 rounded text-[10px] font-bold">
                        <Tag size={10} />
                        {item.tag}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-5 flex items-center justify-end gap-3 border-t border-slate-100">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-all shadow-sm"
          >
            Cancel
          </button>
          <button 
            disabled={selectedFiles.length === 0}
            onClick={handleUploadSubmit}
            className={`flex items-center gap-2 px-8 py-2.5 text-sm font-bold text-white rounded-lg transition-all shadow-md ${
              selectedFiles.length === 0 
              ? 'bg-slate-300 cursor-not-allowed' 
              : 'bg-[#1e7e9a] hover:bg-[#155e75] active:scale-95'
            }`}
          >
            <Folder size={18} fill="currentColor" />
            Upload {selectedFiles.length > 0 ? selectedFiles.length : ''} Files
          </button>
        </div>
      </div>
    </div>
  );
};
