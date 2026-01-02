import React from 'react';
import { Communication } from '../types';
import { MessageCircle, Mail, Phone, Calendar, RefreshCw, X, UserCog, Edit3 } from 'lucide-react';
import { SectionHeader } from './SectionHeader';
import { Card } from './Card';

interface Props {
  items: Communication[];
  onAdd?: () => void;
  onRemove?: (id: string) => void;
  onEdit?: (item: Communication) => void;
}

export const Communications: React.FC<Props> = ({ items = [], onAdd, onRemove, onEdit }) => {
  const getIcon = (type?: string, summary?: string) => {
    const msg = summary?.toLowerCase() || '';
    const t = type?.toLowerCase() || '';
    
    if (msg.includes("refill")) return <RefreshCw size={12} className="text-blue-500" />;
    if (msg.includes("appointment") || msg.includes("follow-up")) return <Calendar size={12} className="text-purple-500" />;
    if (t.includes('phone')) return <Phone size={12} className="text-emerald-500" />;
    if (t.includes('provider')) return <UserCog size={12} className="text-indigo-500" />;
    return <Mail size={12} className="text-slate-500" />;
  };

  const getTypeBadge = (type?: string) => {
    const t = type?.toLowerCase() || '';
    if (t.includes('provider')) return 'bg-indigo-50 text-indigo-600 border-indigo-100';
    if (t.includes('in-person')) return 'bg-amber-50 text-amber-600 border-amber-100';
    return 'bg-slate-50 text-slate-500 border-slate-100';
  }

  const safeItems = Array.isArray(items) ? items : [];

  return (
    <Card className="h-full flex flex-col">
      <SectionHeader 
        title="Patient Communications & Tasks" 
        icon={<MessageCircle size={16} className="text-purple-400" />}
        actionLabel="ACTIONS"
        isDropdown
        menuItems={["Add Data", "Log Phone Call", "Send Portal Msg"]}
        onMenuSelect={(item) => {
          if (item === 'Add Data' && onAdd) onAdd();
        }}
      />
      
      <div className="space-y-1.5 overflow-y-auto max-h-[300px] pr-1 custom-scrollbar">
        {safeItems.length === 0 && (
           <div className="text-center py-6 text-slate-300 italic text-[10px]">
             No recent communications or tasks.
           </div>
        )}
        {safeItems.map((item, idx) => (
          <div key={item?.id || idx} className="flex gap-2 p-2 border border-slate-100 rounded bg-white group relative hover:border-purple-200 transition-colors shadow-sm">
            <div className="pt-0.5 shrink-0">
                <div className={`w-4 h-4 rounded border flex items-center justify-center ${item?.status?.toLowerCase() === 'completed' ? 'bg-purple-500 border-purple-500' : 'bg-white border-slate-300'}`}>
                    {item?.status?.toLowerCase() === 'completed' && <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>}
                </div>
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5 min-w-0">
                        <span className={`text-[8px] font-bold px-1 py-0.5 rounded uppercase border truncate max-w-[80px] ${getTypeBadge(item?.communication_type)}`}>
                          {item?.communication_type || 'Unknown'}
                        </span>
                        <span className="text-[9px] text-slate-400 font-bold shrink-0">{item?.date || ''}</span>
                    </div>
                    <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity gap-1">
                      {onEdit && (
                        <button 
                          onClick={() => onEdit(item)}
                          className="p-0.5 hover:bg-teal-50 text-slate-300 hover:text-teal-600 rounded transition-colors"
                        >
                          <Edit3 size={11} />
                        </button>
                      )}
                      {onRemove && (
                        <button 
                          onClick={() => onRemove(item.id)}
                          className="p-0.5 hover:bg-red-50 text-slate-300 hover:text-red-500 rounded transition-colors"
                        >
                          <X size={11} />
                        </button>
                      )}
                    </div>
                </div>
                <div className="flex items-start gap-1.5">
                    <div className="mt-0.5 shrink-0">
                         {getIcon(item?.communication_type, item?.summary)}
                    </div>
                    <p className="text-[11px] text-slate-700 font-bold leading-tight truncate">
                        {item?.summary || 'No content provided.'}
                    </p>
                </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
