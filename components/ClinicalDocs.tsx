import React, { useState } from 'react';
import { ClinicalNote } from '../types';
import { FileText, ChevronRight, X, Edit3 } from 'lucide-react';
import { SectionHeader } from './SectionHeader';
import { Card } from './Card';

interface Props {
  notes: ClinicalNote[];
  onAdd?: () => void;
  onRemove?: (id: string) => void;
  onEdit?: (note: ClinicalNote) => void;
}

export const ClinicalDocs: React.FC<Props> = ({ notes = [], onAdd, onRemove, onEdit }) => {
  const [activeTab, setActiveTab] = useState<'office' | 'outside'>('office');

  const safeNotes = Array.isArray(notes) ? notes : [];
  
  const filteredNotes = safeNotes.filter(note => note && note.type === activeTab);

  return (
    <Card className="h-full flex flex-col">
      <SectionHeader 
        title="Clinical Documentation" 
        icon={<FileText size={16} className="text-amber-700" />}
        actionLabel="ACTIONS"
        isDropdown
        menuItems={["Add Data", "New Office Note", "Upload Record"]}
        onMenuSelect={(item) => {
          if (item === 'Add Data' && onAdd) onAdd();
        }}
      />

      <div className="flex gap-4 border-b border-slate-100 mb-2.5 text-[10px] font-bold uppercase tracking-widest shrink-0">
        <button 
          onClick={() => setActiveTab('office')}
          className={`pb-1 transition-colors ${
            activeTab === 'office'
              ? 'border-b-2 border-slate-600 text-slate-700'
              : 'text-slate-300 hover:text-slate-500'
          }`}
        >
          Office Notes
        </button>
        <button 
          onClick={() => setActiveTab('outside')}
          className={`pb-1 transition-colors ${
            activeTab === 'outside'
              ? 'border-b-2 border-slate-600 text-slate-700'
              : 'text-slate-300 hover:text-slate-500'
          }`}
        >
          Outside Records
        </button>
      </div>
      
      <div className="divide-y divide-slate-100 overflow-y-auto max-h-[300px] pr-1 custom-scrollbar">
        {filteredNotes.length === 0 && (
          <div className="py-6 text-center text-slate-300 text-[10px] italic">
            No documents found.
          </div>
        )}
        {filteredNotes.map((note, i) => (
          <div key={note?.id || i} className="py-2 group cursor-pointer hover:bg-slate-50 -mx-1 px-1 rounded transition-colors flex items-center justify-between relative">
            <div className="flex-1 min-w-0">
              <p className="text-[9px] text-slate-400 font-bold mb-0.5">{note?.date || 'No Date'}</p>
              <h4 className="text-xs font-bold text-slate-700 truncate">{note?.title || 'Untitled'}</h4>
              <p className="text-[10px] text-slate-500 mt-0.5 font-medium">{note?.provider || 'Unknown Provider'}</p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                {onEdit && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); onEdit(note); }}
                    className="p-1 hover:bg-teal-50 text-slate-300 hover:text-teal-600 rounded transition-colors"
                  >
                    <Edit3 size={12} />
                  </button>
                )}
                {onRemove && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); onRemove(note.id); }}
                    className="p-1 hover:bg-red-50 text-slate-300 hover:text-red-500 rounded transition-colors"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
              <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-500" />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
