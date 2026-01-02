import React, { useState } from 'react';
import { Patient } from '../types';
import { User, AlertTriangle, Bot, Upload } from 'lucide-react';
import { Card } from './Card';
import { LetterModal } from './LetterModal';
import { UploadModal, FileWithMetadata } from './UploadModal';

interface Props {
  patient: Patient;
  onUpload: (filesWithMetadata: FileWithMetadata[]) => void;
}

export const PatientHeader: React.FC<Props> = ({ patient, onUpload }) => {
  const [isLetterModalOpen, setIsLetterModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const calculateAge = (dob: string) => {
    if (!dob) return '';
    const birthDate = new Date(dob);
    if (isNaN(birthDate.getTime())) return '';
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const fullName = `${patient.firstName} ${patient.lastName}`;
  const age = calculateAge(patient.dateOfBirth);

  return (
    <>
      <Card className="mb-4 !border-0 !shadow-sm overflow-visible !p-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-5">
            <div className="h-[68px] w-[68px] rounded-full bg-[#5c67f2] flex items-center justify-center text-white shrink-0 shadow-sm">
              <User size={36} strokeWidth={2.5} />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight leading-tight">{fullName}</h1>
              
              <div className="text-[13px] text-slate-500 mt-1 flex flex-wrap gap-2 lg:gap-3 items-center">
                <span className="font-semibold text-slate-600">Age: {age}</span>
                <span className="text-slate-300 mx-1">|</span>
                <span className="font-semibold text-slate-600">DOB: {patient.dateOfBirth}</span>
                <span className="text-slate-300 mx-1">|</span>
                <span className="font-semibold text-slate-600">MRN: {patient.mrn}</span>
              </div>

              <div className="text-[12px] text-slate-500 mt-1.5 flex flex-wrap items-center gap-x-8 gap-y-1">
                <div className="flex items-center gap-1">
                  <span className="text-slate-400">Referring Provider:</span>
                  <button 
                    onClick={() => setIsLetterModalOpen(true)} 
                    className="text-[#0e7490] hover:underline font-bold"
                  >
                    {patient.referringProvider}
                  </button>
                  <span className="text-slate-400 ml-1">(Fax: {patient.referringProviderFax})</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-slate-400">Pharmacy:</span>
                  <a href="#" className="text-[#0e7490] hover:underline font-bold">
                    {patient.pharmacy} - {patient.pharmacyLocation}
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap lg:flex-nowrap items-center gap-2 w-full lg:w-auto relative z-50">
            <div className="relative group flex-1 lg:flex-none">
              <button className="w-full flex items-center justify-center gap-2 px-3 py-1.5 text-[11px] font-bold text-red-600 border border-red-200 bg-red-50 rounded hover:bg-red-100 transition-colors uppercase tracking-wider">
                <AlertTriangle size={14} />
                Allergies
              </button>
              
              <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-red-100 p-4 z-50 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all transform origin-top duration-200">
                <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2 pb-2 border-b border-red-50">
                  <AlertTriangle size={16} className="text-red-500" />
                  Active Allergies:
                </h4>
                <ul className="space-y-3 text-sm text-slate-600">
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0 shadow-sm"></span>
                    <span><span className="font-semibold text-slate-800">Penicillin</span> <span className="text-slate-400 mx-1">→</span> Anaphylaxis</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0 shadow-sm"></span>
                    <span><span className="font-semibold text-slate-800">Sulfa Drugs</span> <span className="text-slate-400 mx-1">→</span> Severe Rash</span>
                  </li>
                </ul>
              </div>
            </div>

            <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-3 py-1.5 text-[11px] font-bold text-white bg-teal-700 rounded hover:bg-teal-800 transition-colors shadow-sm uppercase tracking-wider">
              <Bot size={14} />
              AI Scribe
            </button>
            
            <button 
              onClick={() => setIsUploadModalOpen(true)}
              className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-3 py-1.5 text-[11px] font-bold text-slate-600 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors shadow-sm uppercase tracking-wider"
            >
              <Upload size={14} />
              Upload Reports
            </button>
          </div>
        </div>
      </Card>

      <LetterModal 
        isOpen={isLetterModalOpen}
        onClose={() => setIsLetterModalOpen(false)}
        providerName={patient.referringProvider}
        providerFax={patient.referringProviderFax}
      />

      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={onUpload}
      />
    </>
  );
};