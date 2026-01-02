import React, { useState } from 'react';
import { LabOrder } from '../types';
import { Package, Droplet, AlertTriangle, FileImage, UserPlus, X, Edit3 } from 'lucide-react';
import { SectionHeader } from './SectionHeader';
import { Card } from './Card';

interface Props {
  orders: LabOrder[];
  onAdd?: () => void;
  onRemove?: (id: string) => void;
  onEdit?: (order: LabOrder) => void;
}

export const OrdersReferrals: React.FC<Props> = ({ orders = [], onAdd, onRemove, onEdit }) => {
  const [activeTab, setActiveTab] = useState<'lab' | 'imaging' | 'referral'>('lab');

  const safeOrders = Array.isArray(orders) ? orders : [];
  
  const filteredOrders = safeOrders.filter(order => {
    const type = order?.order_type?.toLowerCase();
    if (activeTab === 'lab') return type === 'lab';
    if (activeTab === 'imaging') return type === 'imaging';
    if (activeTab === 'referral') return type === 'referral';
    return false;
  });

  const getIcon = (type?: string, status?: string) => {
    const t = type?.toLowerCase();
    if (status?.toLowerCase() === 'resulted') return <AlertTriangle size={14} className="text-amber-500 fill-amber-500" />;
    
    switch (t) {
      case 'lab': return <Droplet size={14} className="text-pink-500 fill-pink-500" />;
      case 'imaging': return <FileImage size={14} className="text-indigo-500" />;
      case 'referral': return <UserPlus size={14} className="text-teal-500" />;
      default: return <Package size={14} className="text-slate-500" />;
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <SectionHeader 
        title="Open Orders & Referrals" 
        icon={<Package size={16} className="text-amber-800" />}
        actionLabel="ACTIONS"
        isDropdown
        menuItems={["Add Data", "New Order", "New Referral"]}
        onMenuSelect={(item) => {
          if (item === 'Add Data' && onAdd) onAdd();
        }}
      />

      <div className="flex w-full text-[10px] font-bold text-center border-b border-slate-100 mb-2.5 shrink-0 uppercase tracking-widest">
        <button 
          onClick={() => setActiveTab('lab')}
          className={`flex-1 pb-1 transition-colors ${
            activeTab === 'lab' 
              ? 'border-b-2 border-teal-600 text-teal-700' 
              : 'text-slate-300 hover:text-slate-500'
          }`}
        >
          Labs
        </button>
        <button 
          onClick={() => setActiveTab('imaging')}
          className={`flex-1 pb-1 transition-colors ${
            activeTab === 'imaging' 
              ? 'border-b-2 border-teal-600 text-teal-700' 
              : 'text-slate-300 hover:text-slate-500'
          }`}
        >
          Imaging
        </button>
        <button 
          onClick={() => setActiveTab('referral')}
          className={`flex-1 pb-1 transition-colors ${
            activeTab === 'referral' 
              ? 'border-b-2 border-teal-600 text-teal-700' 
              : 'text-slate-300 hover:text-slate-500'
          }`}
        >
          Referrals
        </button>
      </div>
      
      <div className="space-y-1.5 overflow-y-auto max-h-[300px] pr-1 custom-scrollbar">
        {filteredOrders.length === 0 && (
          <div className="text-center py-6 text-slate-300 italic text-[10px]">
            No items in this category.
          </div>
        )}
        {filteredOrders.map((order, i) => (
          <div key={order?.id || i} className="p-2 border border-slate-100 rounded bg-white flex items-center justify-between shadow-sm group hover:border-slate-200 transition-colors">
            <div className="flex-1 min-w-0 pr-2">
              <h4 className="text-xs font-bold text-slate-800 truncate leading-tight">{order?.name || 'Unknown Order'}</h4>
              <div className="flex items-center gap-2 mt-1">
                 <span className={`px-1 py-0.5 rounded text-[8px] font-bold uppercase ${
                   order?.status?.toLowerCase() === 'open' ? 'bg-amber-50 text-amber-700 border border-amber-100' : 'bg-slate-50 text-slate-500 border border-slate-100'
                 }`}>
                    {order?.status}
                 </span>
                 <span className="text-[9px] text-slate-400 font-bold">{order?.ordered_date}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity gap-1">
                {onEdit && (
                  <button 
                    onClick={() => onEdit(order)}
                    className="p-0.5 hover:bg-teal-50 text-slate-300 hover:text-teal-600 rounded transition-colors"
                  >
                    <Edit3 size={12} />
                  </button>
                )}
                {onRemove && (
                  <button 
                    onClick={() => onRemove(order.id)}
                    className="p-0.5 hover:bg-red-50 text-slate-300 hover:text-red-500 rounded transition-colors"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
              {getIcon(order?.order_type, order?.status)}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
