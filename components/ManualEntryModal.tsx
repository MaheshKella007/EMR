
import React, { useState, useEffect } from 'react';
import { X, Save, ClipboardList, Activity, FileText, FlaskConical, Package, Microscope, Image as ImageIcon, MessageSquare } from 'lucide-react';

const Label = ({ children }: { children?: React.ReactNode }) => (
  <label className="block text-[11px] font-bold text-[#5c6d82] mb-1.5 uppercase tracking-wider">{children}</label>
);

// Use Omit to avoid type conflicts between native HTML attributes and custom props
const Input = ({ field, formData, onChange, ...props }: Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> & { field: string, formData: any, onChange: (field: string, value: string) => void }) => (
  <input 
    {...props}
    value={formData[field] || ''}
    onChange={(e) => onChange(field, e.target.value)}
    className="w-full px-3 py-2.5 border border-[#e2e8f0] rounded-md text-sm text-slate-700 placeholder:text-slate-300 focus:ring-1 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
  />
);

// Use Omit to avoid type conflicts between native HTML attributes and custom props
const Select = ({ field, formData, onChange, options, ...props }: Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange' | 'value'> & { field: string, formData: any, onChange: (field: string, value: string) => void, options: {value: string, label: string}[] }) => (
  <div className="relative">
    <select 
      {...props}
      value={formData[field] || ''}
      onChange={(e) => onChange(field, e.target.value)}
      className="w-full px-3 py-2.5 border border-[#e2e8f0] rounded-md text-sm outline-none bg-white appearance-none focus:ring-1 focus:ring-teal-500 transition-all pr-8 text-slate-700"
    >
      {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
    </select>
    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
    </div>
  </div>
);

// Use Omit to avoid type conflicts between native HTML attributes and custom props
const TextArea = ({ field, formData, onChange, ...props }: Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange' | 'value'> & { field: string, formData: any, onChange: (field: string, value: string) => void }) => (
  <textarea 
    {...props}
    value={formData[field] || ''}
    onChange={(e) => onChange(field, e.target.value)}
    className="w-full px-3 py-2.5 border border-[#e2e8f0] rounded-md text-sm text-slate-700 placeholder:text-slate-300 focus:ring-1 focus:ring-teal-500 outline-none min-h-[100px] transition-all resize-none"
  />
);

interface ManualEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  type: string; 
  title?: string;
  initialData?: any;
}

export const ManualEntryModal: React.FC<ManualEntryModalProps> = ({ isOpen, onClose, onSave, type, title, initialData }) => {
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData(initialData);
      } else {
        const today = new Date().toISOString().split('T')[0];
        const defaults: any = { 
          date: today, 
          onset_date: today, 
          ordered_date: today, 
          last_date: today,
          next_due_date: today
        };
        
        if (type === 'problems') defaults.status = 'Active';
        if (type === 'notes') defaults.type = 'office';
        if (type === 'orders') defaults.status = 'Ordered';
        if (type === 'procedures') defaults.status = 'Scheduled';
        if (type === 'imaging') defaults.status = 'Final';
        if (type === 'communications') defaults.status = 'Completed';
        if (type === 'labs') defaults.interpretation = 'Normal';
        
        setFormData(defaults);
      }
    }
  }, [initialData, isOpen, type]);

  if (!isOpen) return null;

  const handleChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const getIcon = () => {
    switch(type) {
      case 'problems': return <ClipboardList className="text-[#7c3aed]" size={20} />;
      case 'healthMaintenance': return <Activity className="text-amber-500" size={20} />;
      case 'notes': return <FileText className="text-amber-700" size={20} />;
      case 'labs': return <FlaskConical className="text-green-600" size={20} />;
      case 'orders': return <Package className="text-amber-800" size={20} />;
      case 'procedures': return <Microscope className="text-slate-600" size={20} />;
      case 'imaging': return <ImageIcon className="text-orange-600" size={20} />;
      case 'communications': return <MessageSquare className="text-purple-400" size={20} />;
      default: return null;
    }
  };

  const renderFields = () => {
    switch(type) {
      case 'problems':
        return (
          <div className="space-y-4">
            <div>
              <Label>Condition Name</Label>
              <Input field="problem_name" formData={formData} onChange={handleChange} placeholder="e.g., Hypertension" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Status</Label>
                <Select field="status" formData={formData} onChange={handleChange} options={[
                  {value: 'Active', label: 'Active'},
                  {value: 'Chronic', label: 'Chronic'},
                  {value: 'Resolved', label: 'Resolved'}
                ]} />
              </div>
              <div>
                <Label>Onset Date</Label>
                <Input field="onset_date" formData={formData} onChange={handleChange} type="date" />
              </div>
            </div>
            <div>
              <Label>Notes</Label>
              <TextArea field="notes" formData={formData} onChange={handleChange} placeholder="Details..." />
            </div>
          </div>
        );
      case 'labs':
        return (
          <div className="space-y-4">
            <div>
              <Label>Test Name</Label>
              <Input field="test_name" formData={formData} onChange={handleChange} placeholder="e.g., Hemoglobin" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-1">
                <Label>Value</Label>
                <Input field="value" formData={formData} onChange={handleChange} placeholder="14.5" />
              </div>
              <div className="col-span-1">
                <Label>Unit</Label>
                <Input field="unit" formData={formData} onChange={handleChange} placeholder="g/dL" />
              </div>
              <div className="col-span-1">
                <Label>Interpretation</Label>
                <Select field="interpretation" formData={formData} onChange={handleChange} options={[
                  {value: 'Normal', label: 'Normal'},
                  {value: 'Abnormal', label: 'Abnormal'},
                  {value: 'Critical', label: 'Critical'}
                ]} />
              </div>
            </div>
            <div>
              <Label>Result Date</Label>
              <Input field="date" formData={formData} onChange={handleChange} type="date" />
            </div>
          </div>
        );
      case 'healthMaintenance':
        return (
          <div className="space-y-4">
            <div>
              <Label>Item Name</Label>
              <Input field="item" formData={formData} onChange={handleChange} placeholder="e.g., Colonoscopy" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Status</Label>
                <Input field="status" formData={formData} onChange={handleChange} placeholder="e.g., Up to Date" />
              </div>
              <div>
                <Label>Next Due Date</Label>
                <Input field="next_due_date" formData={formData} onChange={handleChange} type="date" />
              </div>
            </div>
            <div>
              <Label>Context/Reason</Label>
              <Input field="reason" formData={formData} onChange={handleChange} placeholder="Details..." />
            </div>
          </div>
        );
      case 'notes':
        return (
          <div className="space-y-4">
            <div>
              <Label>Note Title</Label>
              <Input field="title" formData={formData} onChange={handleChange} placeholder="e.g., Office Visit" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Provider</Label>
                <Input field="provider" formData={formData} onChange={handleChange} placeholder="Dr. Name" />
              </div>
              <div>
                <Label>Date</Label>
                <Input field="date" formData={formData} onChange={handleChange} type="date" />
              </div>
            </div>
            <div>
              <Label>Summary</Label>
              <TextArea field="summary" formData={formData} onChange={handleChange} placeholder="Clinical summary..." />
            </div>
          </div>
        );
      case 'orders':
        return (
          <div className="space-y-4">
            <div>
              <Label>Order Name</Label>
              <Input field="name" formData={formData} onChange={handleChange} placeholder="e.g., CBC" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Type</Label>
                <Select field="order_type" formData={formData} onChange={handleChange} options={[
                  {value: 'lab', label: 'Lab'},
                  {value: 'imaging', label: 'Imaging'},
                  {value: 'referral', label: 'Referral'}
                ]} />
              </div>
              <div>
                <Label>Date Ordered</Label>
                <Input field="ordered_date" formData={formData} onChange={handleChange} type="date" />
              </div>
            </div>
            <div>
              <Label>Status</Label>
              <Input field="status" formData={formData} onChange={handleChange} placeholder="Ordered / Resulted" />
            </div>
          </div>
        );
      case 'procedures':
        return (
          <div className="space-y-4">
            <div>
              <Label>Procedure Name</Label>
              <Input field="procedure_name" formData={formData} onChange={handleChange} placeholder="Procedure name" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Status</Label>
                <Input field="status" formData={formData} onChange={handleChange} placeholder="Scheduled / Completed" />
              </div>
              <div>
                <Label>Date</Label>
                <Input field="date" formData={formData} onChange={handleChange} type="date" />
              </div>
            </div>
            <div>
              <Label>Indication</Label>
              <Input field="indication" formData={formData} onChange={handleChange} placeholder="Reason for procedure" />
            </div>
          </div>
        );
      case 'imaging':
        return (
          <div className="space-y-4">
            <div>
              <Label>Study Type</Label>
              <Input field="study_type" formData={formData} onChange={handleChange} placeholder="e.g., CT Scan" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Status</Label>
                <Input field="status" formData={formData} onChange={handleChange} placeholder="Final" />
              </div>
              <div>
                <Label>Date</Label>
                <Input field="date" formData={formData} onChange={handleChange} type="date" />
              </div>
            </div>
            <div>
              <Label>Finding Summary</Label>
              <TextArea field="finding" formData={formData} onChange={handleChange} placeholder="Impression..." />
            </div>
          </div>
        );
      case 'communications':
        return (
          <div className="space-y-4">
            <div>
              <Label>Communication Subject</Label>
              <Input field="summary" formData={formData} onChange={handleChange} placeholder="e.g., Patient callback" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Type</Label>
                <Select field="communication_type" formData={formData} onChange={handleChange} options={[
                  {value: 'Phone Call', label: 'Phone Call'},
                  {value: 'Portal Message', label: 'Portal Message'},
                  {value: 'In-Person', label: 'In-Person'}
                ]} />
              </div>
              <div>
                <Label>Date</Label>
                <Input field="date" formData={formData} onChange={handleChange} type="date" />
              </div>
            </div>
          </div>
        );
      default:
        return <div className="p-4 text-center text-slate-400">Form for {type} needed.</div>;
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/60 p-4 animate-in fade-in duration-300 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-[480px] overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            {getIcon()}
            <h3 className="text-[14px] font-bold text-[#334155] uppercase tracking-wider">
              {title || (initialData ? 'Edit Details' : `Add New ${type.replace(/([A-Z])/g, ' $1').trim()}s`)}
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-8">
          {renderFields()}
        </div>

        <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 text-[12px] font-bold text-[#5c6d82] bg-white border border-[#e2e8f0] rounded-md hover:bg-slate-50 transition-all uppercase tracking-wider"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="px-6 py-2.5 text-[12px] font-bold text-white bg-[#0f9d8a] rounded-md hover:bg-[#0d8e7d] shadow-sm transition-all uppercase tracking-wider flex items-center gap-2"
          >
            <Save size={16} />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
