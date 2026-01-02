import React from 'react';
import { Procedure } from '../types';
import { Microscope, Edit3, X, FileText } from 'lucide-react';
import { SectionHeader } from './SectionHeader';
import { Card } from './Card';

interface Props {
  procedures: Procedure[];
  onAdd?: () => void;
  onRemove?: (id: string) => void;
  onEdit?: (proc: Procedure) => void;
}

export const Procedures: React.FC<Props> = ({ procedures = [], onAdd, onRemove, onEdit }) => {
  const safeProcedures = Array.isArray(procedures) ? procedures : [];

  return (
    <Card className="h-full flex flex-col">
      <SectionHeader 
        title="Procedures" 
        icon={<Microscope size={16} className="text-slate-600" />}
        actionLabel="ACTIONS"
        isDropdown
        menuItems={["Add Data", "Order Colonoscopy", "View Procedure Stats"]}
        onMenuSelect={(item) => {
          if (item === 'Add Data' && onAdd) onAdd();
        }}
      />
      
      <div className="space-y-2 overflow-y-auto max-h-[300px] pr-1 custom-scrollbar">
        {safeProcedures.length === 0 && (
           <div className="text-center py-6 text-slate-300 italic text-[10px]">
             No procedures found.
           </div>
        )}
        {safeProcedures.map((proc, idx) => (
          <div key={proc?.id || idx} className={`p-2 border-l-4 rounded-r bg-sky-50/30 relative group ${idx === 0 ? 'border-l-sky-600' : 'border-l-sky-300'}`}>
            <div className="flex justify-between items-start mb-0.5">
              <div className="overflow-hidden flex-1 pr-2">
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tight leading-none mb-1">{proc?.date || 'Date TBD'}</p>
                <h4 className="text-xs font-bold text-slate-800 truncate leading-tight">{proc?.procedure_name || 'Unnamed Procedure'}</h4>
              </div>
              <div className="flex items-center gap-1">
                  <span className={`text-[8px] px-1 py-0.5 rounded font-bold uppercase tracking-tighter ${proc.status?.toLowerCase() === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {proc.status}
                  </span>
                  <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                    {onEdit && (
                        <button onClick={() => onEdit(proc)} className="p-0.5 hover:bg-teal-50 text-slate-300 hover:text-teal-600 rounded transition-all"><Edit3 size={11} /></button>
                    )}
                    {onRemove && (
                        <button onClick={() => onRemove(proc.id)} className="p-0.5 hover:bg-red-50 text-slate-300 hover:text-red-500 rounded transition-all"><X size={11} /></button>
                    )}
                  </div>
              </div>
            </div>
            
            {proc.indication && (
               <p className="text-[9px] text-indigo-600 font-bold mb-1 truncate">IND: {proc.indication}</p>
            )}

            <div className="flex items-start gap-1.5 text-[10px] text-slate-500">
               <FileText size={10} className="mt-0.5 text-slate-300 shrink-0" />
               <p className="line-clamp-1 italic">{proc?.notes || 'No details.'}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
