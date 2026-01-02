import React, { useState } from 'react';
import { Patient } from '../types';
import { User, Activity } from 'lucide-react';

interface PatientListProps {
  patients: Patient[];
  onSelectPatient: (patient: Patient) => void;
}

export const PatientList: React.FC<PatientListProps> = ({ patients, onSelectPatient }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleRowClick = (id: string) => {
    setSelectedId(id);
  };

  const handleViewDetails = () => {
    const patient = patients.find(p => p.id === selectedId);
    if (patient) {
      onSelectPatient(patient);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 flex flex-col items-center">
        <div className="w-full max-w-5xl">
            {/* Header */}
            <div className="mb-8 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                    <div className="bg-teal-600 p-2 rounded-lg">
                        <Activity className="text-white" size={24} />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900">MediView EMR</h1>
                </div>
                <p className="text-slate-500 text-lg">Select a patient to access their clinical dashboard.</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
                {/* Toolbar */}
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <span className="text-sm font-semibold text-slate-500 pl-2">
                        {patients.length} Patients Found
                    </span>
                    <button
                        disabled={!selectedId}
                        onClick={handleViewDetails}
                        className={`px-6 py-2.5 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${
                            selectedId
                            ? 'bg-teal-600 text-white hover:bg-teal-700 shadow-md hover:-translate-y-0.5'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                    >
                        View Details
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="p-5 w-16 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Select</th>
                                <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Patient Name</th>
                                <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">MRN</th>
                                <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">DOB / Age</th>
                                <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Referring Provider</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {patients.map(patient => (
                                <tr 
                                    key={patient.id} 
                                    onClick={() => handleRowClick(patient.id)}
                                    className={`cursor-pointer transition-colors hover:bg-slate-50 ${selectedId === patient.id ? 'bg-teal-50/60' : ''}`}
                                >
                                    <td className="p-5 text-center relative">
                                        <div className="flex items-center justify-center">
                                            <input 
                                                type="radio" 
                                                name="patientSelect"
                                                checked={selectedId === patient.id}
                                                onChange={() => handleRowClick(patient.id)}
                                                className="w-5 h-5 text-teal-600 focus:ring-teal-500 border-gray-300 cursor-pointer"
                                            />
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold shrink-0">
                                                <User size={18} />
                                            </div>
                                            <div>
                                                <span className="block font-bold text-slate-800 text-base">{patient.firstName} {patient.lastName}</span>
                                                <span className="text-xs text-slate-400">{patient.pharmacy}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <span className="font-mono text-sm text-slate-600 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                                            {patient.mrn}
                                        </span>
                                    </td>
                                    <td className="p-5">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-slate-700">{patient.dateOfBirth}</span>
                                            <span className="text-xs text-slate-500">{patient.age} years old</span>
                                        </div>
                                    </td>
                                    <td className="p-5 text-sm font-medium text-slate-600">
                                        {patient.referringProvider}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                {patients.length === 0 && (
                    <div className="p-10 text-center text-slate-400">
                        No patients found.
                    </div>
                )}
            </div>
            
            <div className="mt-6 text-center text-xs text-slate-400">
                &copy; 2024 MediView EMR Systems. All rights reserved.
            </div>
        </div>
    </div>
  );
};