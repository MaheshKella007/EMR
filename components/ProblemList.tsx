import React, { useState } from 'react';
import { Problem } from '../types';
import { ClipboardList, Edit3, X, Calendar } from 'lucide-react';
import { SectionHeader } from './SectionHeader';
import { Card } from './Card';

interface Props {
  problems: Problem[];
  onAdd?: () => void;
  onRemove?: (id: string) => void;
  onEdit?: (problem: Problem) => void;
}

export const ProblemList: React.FC<Props> = ({ problems = [], onAdd, onRemove, onEdit }) => {
  const [activeTab, setActiveTab] = useState<'active' | 'resolved'>('active');

  const getSeverityColor = (status?: string) => {
    const s = status?.toLowerCase();
    if (s === 'active') return 'bg-emerald-500';
    if (s === 'chronic') return 'bg-amber-400';
    return 'bg-slate-400';
  };

  const safeProblems = Array.isArray(problems) ? problems : [];

  const filteredProblems = safeProblems.filter(p => {
    if (!p) return false;
    const status = p.status?.toLowerCase();
    if (activeTab === 'active') return status === 'active' || status === 'chronic';
    return status === 'resolved' || status === 'acute' || !status;
  });

  return (
    <Card className="h-full flex flex-col">
      <SectionHeader 
        title="Active Problem List" 
        icon={<ClipboardList size={16} className="text-purple-600" />}
        actionLabel="ACTIONS"
        isDropdown={true}
        menuItems={["Add Data", "Import Problems", "View Full List"]}
        onMenuSelect={(item) => {
          if (item === 'Add Data' && onAdd) onAdd();
        }}
      />
      
      <div className="flex gap-4 border-b border-slate-100 mb-2.5 text-[10px] font-bold uppercase tracking-widest shrink-0">
        <button 
          onClick={() => setActiveTab('active')}
          className={`pb-1 transition-colors ${
            activeTab === 'active' 
              ? 'border-b-2 border-teal-500 text-teal-700' 
              : 'text-slate-300 hover:text-slate-500'
          }`}
        >
          Active/Chronic
        </button>
        <button 
          onClick={() => setActiveTab('resolved')}
          className={`pb-1 transition-colors ${
            activeTab === 'resolved' 
              ? 'border-b-2 border-teal-500 text-teal-700' 
              : 'text-slate-300 hover:text-slate-500'
          }`}
        >
          Resolved/Other
        </button>
      </div>

      <div className="space-y-1.5 overflow-y-auto max-h-[300px] pr-1 custom-scrollbar">
        {filteredProblems.length === 0 && (
            <div className="text-center py-4 text-slate-300 text-[10px] italic">
                No entries found.
            </div>
        )}
        {filteredProblems.map((problem, i) => (
          <div key={problem?.id || i} className="group flex flex-col p-2 rounded border border-slate-100 hover:border-slate-200 bg-white relative">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 overflow-hidden flex-1">
                <div className={`w-2 h-2 rounded-full shrink-0 ${getSeverityColor(problem?.status)}`} />
                <span className="text-xs font-bold text-slate-700 truncate leading-tight">{problem?.problem_name || 'Unknown Condition'}</span>
              </div>
              <div className="flex items-center gap-1">
                {problem.onset_date && (
                  <span className="text-[9px] flex items-center gap-0.5 text-slate-400 font-bold whitespace-nowrap mr-1">
                    <Calendar size={9} />
                    {problem.onset_date}
                  </span>
                )}
                <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                  {onEdit && (
                    <button 
                      onClick={() => onEdit(problem)}
                      className="p-1 hover:bg-teal-50 text-slate-300 hover:text-teal-600 rounded transition-colors"
                    >
                      <Edit3 size={12} />
                    </button>
                  )}
                  {onRemove && (
                    <button 
                      onClick={() => onRemove(problem.id)}
                      className="p-1 hover:bg-red-50 text-slate-300 hover:text-red-500 rounded transition-colors"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
              </div>
            </div>
            {problem.notes && (
              <p className="text-[10px] text-slate-400 mt-1 line-clamp-1 pl-4 leading-normal italic">
                {problem.notes}
              </p>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};
