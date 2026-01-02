import React, { useState, useEffect } from 'react';
import { PatientHeader } from '../PatientHeader';
import { ProblemList } from '../ProblemList';
import { HealthMaintenance } from '../HealthMaintenance';
import { ClinicalDocs } from '../ClinicalDocs';
import { OrdersReferrals } from '../OrdersReferrals';
import { Procedures } from '../Procedures';
import { ImagingPathology } from '../ImagingPathology';
import { LabTrends } from '../LabTrends';
import { Communications } from '../Communications';
import { ReviewModal } from '../ReviewModal';
import { ManualEntryModal } from '../ManualEntryModal';
import { ConfirmationModal } from '../ConfirmationModal';
import { FileWithMetadata } from '../UploadModal';
import { Patient, Problem, Procedure, HealthMaintenanceItem, LabOrder, LabResult, ImagingItem, Communication, ClinicalNote } from '../../types';
import { UploadCloud, Loader2, ArrowLeft, PlusCircle, Save } from 'lucide-react';

// Import Services
import { patientService, DashboardData, BackendDashboardResponse } from '../../services/patientService';
import { analysisService } from '../../services/analysisService';

interface MainDashboardProps {
  patient: any; 
  onBack: () => void;
}

export const MainDashboard: React.FC<MainDashboardProps> = ({ patient, onBack }) => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const patientId = patient?.data?.id || patient?.id;
  const patientDataObj = patient?.data || patient;

  const [isReviewing, setIsReviewing] = useState(false);
  const [pendingData, setPendingData] = useState<DashboardData | null>(null);
  const [reviewedData, setReviewedData] = useState<Partial<DashboardData>>({});
  const [reviewStep, setReviewStep] = useState(0);

  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [manualEntryType, setManualEntryType] = useState<string>('');
  const [editingItem, setEditingItem] = useState<any | null>(null);

  // Removal confirmation state
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<{ id: string, key: string } | null>(null);

  const reviewSteps = [
    { key: 'problems', label: 'Active Problem List' },
    { key: 'healthMaintenance', label: 'Health Maintenance' },
    { key: 'notes', label: 'Clinical Documentation' },
    { key: 'orders', label: 'Orders & Referrals' },
    { key: 'procedures', label: 'Procedures' },
    { key: 'imaging', label: 'Imaging & Pathology' },
    { key: 'labs', label: 'Lab Trends' },
    { key: 'communications', label: 'Communications & Tasks' }
  ] as const;

  const mapDashboardToBackendResponse = (uiData: DashboardData) => {
    const allProblems = uiData.problems || [];
    const activeProblems = allProblems.filter(p => p.status?.toLowerCase() !== 'resolved').map(p => ({
        problem_name: p.problem_name,
        status: p.status,
        onset_date: p.onset_date || "",
        notes: p.notes || "",
        images: []
    }));
    const resolvedProblems = allProblems.filter(p => p.status?.toLowerCase() === 'resolved').map(p => ({
        problem_name: p.problem_name,
        notes: p.notes || "",
        resolved_date: p.onset_date || "",
        images: []
    }));

    return {
      labs: uiData.labs || [],
      procedures: (uiData.procedures || []).map(p => ({
          procedure_name: p.procedure_name,
          date: p.date,
          status: p.status,
          indication: p.indication || "",
          images: []
      })),
      problem_list: activeProblems,
      logs_or_notes: uiData.notes && uiData.notes.length > 0 ? (uiData.notes[0].summary || uiData.notes[0].notes || "") : "",
      resolved_problems: resolvedProblems,
      imaging_and_pathology: (uiData.imaging || []).map(img => ({
          study_type: img.study_type,
          finding: img.finding,
          date: img.date,
          status: img.status,
          images: []
      })),
      open_orders_referrals: (uiData.orders || []).map(o => ({
          name: o.name,
          status: o.status,
          order_type: o.order_type,
          ordered_date: o.ordered_date,
          images: []
      })),
      health_maintenance_and_recalls: (uiData.healthMaintenance || []).map(h => ({
          item: h.item,
          status: h.status,
          last_date: h.last_date || "",
          next_due_date: h.next_due_date || "",
          reason: h.reason || "",
          images: []
      })),
      patient_communications_and_tasks: (uiData.communications || []).map(c => ({
          communication_type: c.communication_type,
          date: c.date,
          summary: c.summary,
          status: c.status,
          images: []
      }))
    };
  };

  const mapBackendResponseToDashboard = (json: any): DashboardData => {
    const combinedProblems = [
      ...(json.problem_list || []),
      ...(json.resolved_problems || [])
    ].map((p: any, i: number) => ({
      id: p.id || `p-${i}`,
      problem_name: p.problem_name,
      status: p.status || (p.resolved_date ? 'Resolved' : 'Active'),
      notes: p.notes,
      onset_date: p.onset_date || p.resolved_date
    }));

    return {
      problems: combinedProblems,
      procedures: (json.procedures || []).map((p: any, i: number) => ({
        id: p.id || `proc-${i}`,
        ...p
      })),
      healthMaintenance: (json.health_maintenance_and_recalls || []).map((h: any, i: number) => ({
        id: h.id || `hm-${i}`,
        ...h
      })),
      orders: (json.open_orders_referrals || []).map((o: any, i: number) => ({
        id: o.id || `ord-${i}`,
        ...o
      })),
      imaging: (json.imaging_and_pathology || []).map((img: any, i: number) => ({
        id: img.id || `img-${i}`,
        ...img
      })),
      communications: (json.patient_communications_and_tasks || []).map((t: any, i: number) => ({
        id: t.id || `comm-${i}`,
        ...t
      })),
      labs: (json.labs || []).map((l: any, i: number) => ({
        id: l.id || `lab-${i}`,
        ...l
      })),
      notes: json.logs_or_notes || json.summary ? [{
        id: 'note-summary',
        date: new Date().toISOString().split('T')[0],
        title: 'Extracted Record Summary',
        provider: 'AI Scribe',
        type: 'office',
        summary: json.logs_or_notes || json.summary
      }] : []
    };
  };

  const loadDashboardData = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await patientService.getPatientDashboard(id);
      if (response && response.extracted_json) {
        const mappedData = mapBackendResponseToDashboard(response.extracted_json);
        if (response.approval_status !== 'APPROVED') {
          setPendingData(mappedData);
          setReviewedData({});
          setReviewStep(0);
          setIsReviewing(true);
          setData(null);
        } else {
          setData(mappedData);
          setIsReviewing(false);
        }
      } else {
        setData(null);
        setIsReviewing(false);
      }
    } catch (error) {
      console.error("Dashboard fetch error:", error);
      setData(null); 
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (patientId) {
      loadDashboardData(patientId);
    }
  }, [patientId]);

  const handleUpload = async (filesWithMetadata: FileWithMetadata[]) => {
    setIsLoading(true);
    try {
      const uploadRes = await analysisService.analyzeDocuments(filesWithMetadata, patientId);
      if (uploadRes) {
        await loadDashboardData(patientId);
      }
    } catch (e) {
      alert("Failed to process documents.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReviewAction = async () => {
    if (!pendingData) return;
    const currentKey = reviewSteps[reviewStep].key;
    const currentData = pendingData[currentKey as keyof DashboardData];
    const nextReviewedData = { ...reviewedData, [currentKey]: currentData };
    setReviewedData(nextReviewedData);

    if (reviewStep < reviewSteps.length - 1) {
      setReviewStep(prev => prev + 1);
    } else {
      setIsLoading(true);
      const finalUiData = { ...pendingData, ...nextReviewedData } as DashboardData;
      try {
        await patientService.savePatientDashboard(patientId, mapDashboardToBackendResponse(finalUiData));
        await loadDashboardData(patientId);
      } catch (err) {
        alert("Approval/Save failed.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleGlobalSave = async () => {
    if (!data) return;
    setIsSaving(true);
    try {
      await patientService.savePatientDashboard(patientId, mapDashboardToBackendResponse(data));
      alert("All changes saved successfully.");
      await loadDashboardData(patientId);
    } catch (err) {
      alert("Global save failed.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveItem = (id: string, key?: string) => {
    const targetKey = key || (isReviewing ? reviewSteps[reviewStep].key : '');
    if (!targetKey) return;
    
    // Set confirmation modal state instead of direct removal
    setItemToRemove({ id, key: targetKey });
    setIsConfirmModalOpen(true);
  };

  const handleConfirmRemove = () => {
    if (!itemToRemove) return;
    const { id, key } = itemToRemove;

    if (isReviewing && pendingData) {
      const list = pendingData[key as keyof DashboardData] as any[];
      setPendingData({ ...pendingData, [key]: list.filter(item => item.id !== id) });
    } else if (data) {
      const list = data[key as keyof DashboardData] as any[];
      setData({ ...data, [key]: list.filter(item => item.id !== id) });
    }
    setItemToRemove(null);
  };

  const handleEditItem = (item: any, type: string) => {
    setManualEntryType(type);
    setEditingItem(item);
    setIsManualModalOpen(true);
  };

  const handleManualAdd = (type?: string) => {
    const targetType = type || (isReviewing ? reviewSteps[reviewStep].key : '');
    setManualEntryType(targetType);
    setEditingItem(null);
    setIsManualModalOpen(true);
  };

  const handleSaveManualItem = (formData: any) => {
    const key = manualEntryType;
    if (!key) return;

    if (isReviewing && pendingData) {
      const list = pendingData[key as keyof DashboardData] as any[];
      if (editingItem) {
        const updatedList = list.map(item => item.id === editingItem.id ? { ...item, ...formData } : item);
        setPendingData({ ...pendingData, [key]: updatedList });
      } else {
        const newItem = { id: `manual-${Date.now()}`, ...formData };
        setPendingData({ ...pendingData, [key]: [newItem, ...list] });
      }
    } else if (data) {
      const list = data[key as keyof DashboardData] as any[];
      if (editingItem) {
        const updatedList = list.map(item => item.id === editingItem.id ? { ...item, ...formData } : item);
        setData({ ...data, [key]: updatedList });
      } else {
        const newItem = { id: `manual-${Date.now()}`, ...formData };
        setData({ ...data, [key]: [newItem, ...list] });
      }
    }
    setEditingItem(null);
  };

  const renderDashboard = (currentData: DashboardData) => {
    const leftColumn = [
      <ProblemList 
        key="problems" 
        problems={currentData.problems} 
        onAdd={() => handleManualAdd('problems')}
        onEdit={(p) => handleEditItem(p, 'problems')}
        onRemove={(id) => handleRemoveItem(id, 'problems')}
      />,
      <ClinicalDocs 
        key="docs" 
        notes={currentData.notes} 
        onAdd={() => handleManualAdd('notes')}
        onEdit={(n) => handleEditItem(n, 'notes')}
        onRemove={(id) => handleRemoveItem(id, 'notes')}
      />,
      <Procedures 
        key="procedures" 
        procedures={currentData.procedures} 
        onAdd={() => handleManualAdd('procedures')}
        onEdit={(p) => handleEditItem(p, 'procedures')}
        onRemove={(id) => handleRemoveItem(id, 'procedures')}
      />,
      <LabTrends 
        key="labs" 
        labs={currentData.labs} 
        onAdd={() => handleManualAdd('labs')}
        onEdit={(l) => handleEditItem(l, 'labs')}
        onRemove={(id) => handleRemoveItem(id, 'labs')}
      />
    ];

    const rightColumn = [
      <HealthMaintenance 
        key="health" 
        items={currentData.healthMaintenance} 
        onAdd={() => handleManualAdd('healthMaintenance')}
        onEdit={(h) => handleEditItem(h, 'healthMaintenance')}
        onRemove={(id) => handleRemoveItem(id, 'healthMaintenance')}
      />,
      <OrdersReferrals 
        key="orders" 
        orders={currentData.orders} 
        onAdd={() => handleManualAdd('orders')}
        onEdit={(o) => handleEditItem(o, 'orders')}
        onRemove={(id) => handleRemoveItem(id, 'orders')}
      />,
      <ImagingPathology 
        key="imaging" 
        items={currentData.imaging} 
        onAdd={() => handleManualAdd('imaging')}
        onEdit={(i) => handleEditItem(i, 'imaging')}
        onRemove={(id) => handleRemoveItem(id, 'imaging')}
      />,
      <Communications 
        key="communications" 
        items={currentData.communications} 
        onAdd={() => handleManualAdd('communications')}
        onEdit={(c) => handleEditItem(c, 'communications')}
        onRemove={(id) => handleRemoveItem(id, 'communications')}
      />
    ];

    return (
      <div className="flex flex-col gap-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 items-start">
          <div className="flex flex-col gap-2">{leftColumn}</div>
          <div className="flex flex-col gap-2">{rightColumn}</div>
        </div>
        
        <div className="flex justify-center">
          <button 
            onClick={handleGlobalSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-12 py-3 bg-[#0f9d8a] text-white rounded shadow-lg hover:bg-[#0d8e7d] transition-all font-bold uppercase tracking-widest text-sm active:scale-95 disabled:opacity-50"
          >
            {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
            {isSaving ? 'Saving Changes...' : 'Save Patient Summary'}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-1.5">
        <button onClick={onBack} className="flex items-center gap-1 text-[9px] font-bold text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-widest">
          <ArrowLeft size={10} /> Back to Search
        </button>
      </div>

      <PatientHeader patient={patientDataObj} onUpload={handleUpload} />
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-[50vh]">
          <Loader2 size={24} className="animate-spin text-teal-500 mb-3" />
          <p className="text-slate-400 font-bold text-[9px] uppercase tracking-[0.3em]">Loading Clinical Data...</p>
        </div>
      ) : data ? (
        renderDashboard(data)
      ) : isReviewing ? (
         <div className="flex flex-col items-center justify-center h-[50vh] text-slate-400 border-2 border-dashed border-indigo-200 rounded-xl bg-indigo-50/20">
            <Loader2 size={32} className="mb-4 text-indigo-300 animate-spin" />
            <h2 className="text-base font-bold text-indigo-700 uppercase">Review Pending Extracted Records</h2>
            <p className="text-[10px] text-indigo-400 mt-2 uppercase tracking-widest font-bold">Please complete validation in the review portal</p>
         </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[50vh] text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-white/50 animate-in fade-in zoom-in duration-300">
          <UploadCloud size={32} className="mb-4 text-slate-300" />
          <h2 className="text-base font-bold text-slate-700">No Patient Records Found</h2>
          <button 
            onClick={() => {
               const empty = { problems: [], procedures: [], healthMaintenance: [], orders: [], imaging: [], communications: [], labs: [], notes: [] };
               setPendingData(empty);
               setReviewedData({});
               setReviewStep(0);
               setIsReviewing(true);
            }}
            className="mt-6 px-5 py-2 bg-teal-600 text-white rounded font-bold hover:bg-teal-700 transition-all shadow-sm flex items-center gap-2 text-[10px] uppercase tracking-wider"
          >
            <PlusCircle size={12} />
            Initialize Record Manually
          </button>
        </div>
      )}

      <ReviewModal
        isOpen={isReviewing}
        title={reviewSteps[reviewStep]?.label || ''}
        stepCurrent={reviewStep + 1}
        stepTotal={reviewSteps.length}
        onApprove={handleReviewAction}
        onReset={() => setPendingData({ ...pendingData!, [reviewSteps[reviewStep].key]: [] })}
      >
        {isReviewing && pendingData && (
          <div className="scale-[0.98] origin-top">
            {reviewSteps[reviewStep].key === 'problems' && <ProblemList problems={pendingData.problems} onAdd={() => handleManualAdd('problems')} onRemove={handleRemoveItem} onEdit={(item) => handleEditItem(item, 'problems')} />}
            {reviewSteps[reviewStep].key === 'healthMaintenance' && <HealthMaintenance items={pendingData.healthMaintenance} onAdd={() => handleManualAdd('healthMaintenance')} onRemove={handleRemoveItem} onEdit={(item) => handleEditItem(item, 'healthMaintenance')} />}
            {reviewSteps[reviewStep].key === 'notes' && <ClinicalDocs notes={pendingData.notes} onAdd={() => handleManualAdd('notes')} onRemove={handleRemoveItem} onEdit={(item) => handleEditItem(item, 'notes')} />}
            {reviewSteps[reviewStep].key === 'orders' && <OrdersReferrals orders={pendingData.orders} onAdd={() => handleManualAdd('orders')} onRemove={handleRemoveItem} onEdit={(item) => handleEditItem(item, 'orders')} />}
            {reviewSteps[reviewStep].key === 'procedures' && <Procedures procedures={pendingData.procedures} onAdd={() => handleManualAdd('procedures')} onRemove={handleRemoveItem} onEdit={(item) => handleEditItem(item, 'procedures')} />}
            {reviewSteps[reviewStep].key === 'imaging' && <ImagingPathology items={pendingData.imaging} onAdd={() => handleManualAdd('imaging')} onRemove={handleRemoveItem} onEdit={(item) => handleEditItem(item, 'imaging')} />}
            {reviewSteps[reviewStep].key === 'labs' && <LabTrends labs={pendingData.labs} onAdd={() => handleManualAdd('labs')} onRemove={handleRemoveItem} onEdit={(item) => handleEditItem(item, 'labs')} />}
            {reviewSteps[reviewStep].key === 'communications' && <Communications items={pendingData.communications} onAdd={() => handleManualAdd('communications')} onRemove={handleRemoveItem} onEdit={(item) => handleEditItem(item, 'communications')} />}
          </div>
        )}
      </ReviewModal>

      <ManualEntryModal
        isOpen={isManualModalOpen}
        onClose={() => { setIsManualModalOpen(false); setEditingItem(null); }}
        onSave={handleSaveManualItem}
        type={manualEntryType}
        initialData={editingItem}
        title={editingItem ? `Edit Clinical Item` : `Add New ${manualEntryType}`}
      />

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => { setIsConfirmModalOpen(false); setItemToRemove(null); }}
        onConfirm={handleConfirmRemove}
        title="Confirm Removal"
        message="Are you sure you want to remove this data? This action cannot be undone until you refresh without saving."
      />
    </div>
  );
};