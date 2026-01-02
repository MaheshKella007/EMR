import React from 'react';
import { HealthMaintenanceItem } from '../types';
import { AlertTriangle, Mail, X, Calendar, Edit3 } from 'lucide-react';
import { SectionHeader } from './SectionHeader';
import { Card } from './Card';

interface Props {
  items: HealthMaintenanceItem[];
  onAdd?: () => void;
  onRemove?: (id: string) => void;
  onEdit?: (item: HealthMaintenanceItem) => void;
}

export const HealthMaintenance: React.FC<Props> = ({ items = [], onAdd, onRemove, onEdit }) => {
  const getStatusStyles = (status?: string) => {
    const s = status?.toLowerCase();
    if (s?.includes('up to date')) return { dot: 'bg-emerald-500', border: 'border-emerald-100', bg: 'bg-white' };
    if (s?.includes('due soon')) return { dot: 'bg-amber-400', border: 'border-amber-100', bg: 'bg-white' };
    if (s?.includes('overdue')) return { dot: 'bg-red-500', border: 'border-red-100', bg: 'bg-red-50/30' };
    return { dot: 'bg-slate-400', border: 'border-slate-100', bg: 'bg-white' };
  };

  const safeItems = Array.isArray(items) ? items : [];

  return (
    <Card className="h-full flex flex-col">
      <SectionHeader 
        title="Health Maintenance & Recall" 
        icon={<AlertTriangle size={16} className="text-amber-500" />}
        actionLabel="ACTIONS"
        isDropdown
        menuItems={["Add Data", "Schedule Procedure Now", "Send Recall Letter"]}
        onMenuSelect={(item) => {
          if (item === 'Add Data' && onAdd) onAdd();
        }}
      />
      
      <div className="space-y-2 overflow-y-auto max-h-[300px] pr-1 custom-scrollbar">
        {safeItems.length === 0 && (
           <div className="text-center py-6 text-slate-300 italic text-[10px]">
             No health maintenance items found.
           </div>
        )}
        {safeItems.map((item, i) => {
          if (!item) return null;
          const styles = getStatusStyles(item.status);
          return (
            <div key={item.id || i} className={`p-2 rounded border ${styles.border} ${styles.bg} relative group hover:border-slate-300 transition-colors shadow-sm`}>
              <div className="flex items-start gap-2">
                <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${styles.dot}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="text-xs font-bold text-slate-800 leading-tight truncate">{item.item || 'Unknown Item'}</h4>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
                  
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                    <div className="flex items-center gap-1">
                       <p className={`text-[9px] font-bold uppercase tracking-wider ${item.status?.toLowerCase().includes('overdue') ? 'text-red-600' : 'text-slate-500'}`}>
                          {item.status}
                       </p>
                    </div>
                    {item.last_date && (
                       <span className="text-[9px] text-slate-400 flex items-center gap-0.5">
                         <Calendar size={9} />
                         Last: {item.last_date}
                       </span>
                    )}
                  </div>
                 
                  {item.reason && (
                    <p className="text-[10px] text-slate-500 mt-1 font-medium italic line-clamp-1">{item.reason}</p>
                  )}
                  
                  {item.next_due_date && (
                    <div className="mt-1 flex items-center gap-1 text-[9px] font-bold text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded w-fit border border-sky-100 uppercase">
                      Next Due: {item.next_due_date}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
