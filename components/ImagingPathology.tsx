import React from 'react';
import { Image, Camera, FileText, X, CheckCircle2, Edit3 } from 'lucide-react';
import { SectionHeader } from './SectionHeader';
import { Card } from './Card';
import { ImagingItem } from '../types';

interface Props {
  items?: ImagingItem[];
  onAdd?: () => void;
  onRemove?: (id: string) => void;
  onEdit?: (item: ImagingItem) => void;
}

export const ImagingPathology: React.FC<Props> = ({ items = [], onAdd, onRemove, onEdit }) => {
  const safeItems = Array.isArray(items) ? items : [];

  return (
    <Card className="h-full flex flex-col">
      <SectionHeader 
        title="Imaging & Pathology" 
        icon={<Image size={16} className="text-orange-600" />}
        actionLabel="ACTIONS"
        isDropdown
        menuItems={["Add Data", "Upload Image", "Import Records"]}
        onMenuSelect={(item) => {
          if (item === 'Add Data' && onAdd) onAdd();
        }}
      />
      
      <div className="space-y-1.5 overflow-y-auto max-h-[300px] pr-1 custom-scrollbar">
        {safeItems.length === 0 ? (
          <div className="text-center py-6 text-slate-300 italic text-[10px]">
            No imaging or pathology records found.
          </div>
        ) : (
          <div className="space-y-2">
            {safeItems.map((item, i) => (
               <div key={item?.id || i} className="border border-slate-100 rounded p-2 bg-white shadow-sm relative group hover:border-orange-200 transition-colors">
                  <div className="flex justify-between items-start mb-1">
                     <div className="flex items-center gap-1.5 overflow-hidden">
                        <CheckCircle2 size={12} className="text-orange-500 shrink-0" />
                        <h4 className="text-xs font-bold text-slate-800 truncate" title={item?.study_type}>
                          {item?.study_type || 'Unknown Test'}
                        </h4>
                     </div>
                     <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[9px] font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                          {item?.date || ''}
                        </span>
                        <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
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
                  </div>
                  <div className="flex items-start gap-1.5 mt-1 bg-slate-50/50 p-1.5 rounded border border-slate-50">
                     <FileText size={12} className="text-slate-400 mt-0.5 shrink-0" />
                     <p className="text-[10px] text-slate-600 leading-tight font-medium italic line-clamp-2">
                        {item?.finding || 'No results available.'}
                     </p>
                  </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};
