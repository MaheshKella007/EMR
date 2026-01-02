
import React, { useState, useEffect } from 'react';
import { MainDashboard } from './components/Dashboard/MainDashboard';
import { PatientList } from './components/PatientList';
import { Patient } from './types';
import { Loader2, User, Search, Activity, AlertCircle } from 'lucide-react';
import { patientService } from './services/patientService';

const App: React.FC = () => {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showList, setShowList] = useState(false);
  const [patientIdInput, setPatientIdInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [allPatients, setAllPatients] = useState<Patient[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFetchPatient = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!patientIdInput.trim()) return;

    setIsSearching(true);
    setError(null);
    try {
      const response = await patientService.getPatientById(patientIdInput.trim());
      if (response) {
        setSelectedPatient(response);
        setShowList(false);
      } else {
        setError("Invalid patient data received.");
      }
    } catch (error: any) {
      console.error("Could not fetch patient.", error);
      setError("Patient ID not found or server connection failed.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleShowList = async () => {
    setIsSearching(true);
    setError(null);
    try {
      const patients = await patientService.getPatients();
      setAllPatients(patients);
      setShowList(true);
    } catch (err) {
      console.error("Could not fetch patient list.", err);
      setError("Failed to load patient list.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectPatientFromList = async (patient: Patient) => {
    // When a patient is selected from the list, fetch their full clinical data
    setIsSearching(true);
    try {
      const patientId = patient.id || patient.mrn;
      const response = await patientService.getPatientById(patientId);
      if (response) {
        setSelectedPatient(response);
        setShowList(false);
      }
    } catch (err) {
      setError("Failed to load clinical details for selected patient.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleBackToLogin = () => {
    setSelectedPatient(null);
    setShowList(false);
    setPatientIdInput('');
    setError(null);
  };

  // View state management
  if (selectedPatient) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 md:p-6 max-w-[1600px] mx-auto">
        <MainDashboard patient={selectedPatient} onBack={handleBackToLogin} />
      </div>
    );
  }

  if (showList) {
    return <PatientList patients={allPatients} onSelectPatient={handleSelectPatientFromList} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-300">
          {/* Login Header */}
          <div className="bg-teal-600 p-8 text-center">
            <div className="inline-flex items-center justify-center p-3 bg-white/20 rounded-xl mb-4 backdrop-blur-sm">
              <Activity className="text-white" size={32} />
            </div>
            <h1 className="text-2xl font-bold text-white">MediView EMR</h1>
            <p className="text-teal-50 text-sm mt-2">Clinical Portal Access</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleFetchPatient} className="p-8 space-y-6">
            <div>
              <label htmlFor="patientId" className="block text-sm font-bold text-slate-700 mb-2">
                Patient MRN / ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  id="patientId"
                  value={patientIdInput}
                  onChange={(e) => setPatientIdInput(e.target.value)}
                  placeholder="Enter Patient ID (e.g. GI-2024-001)"
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all text-slate-800 placeholder:text-slate-300"
                  autoFocus
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium border border-red-100 animate-in slide-in-from-top-2">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <div className="space-y-4">
              <button
                type="submit"
                disabled={isSearching || !patientIdInput.trim()}
                className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-bold text-white transition-all shadow-md ${
                  isSearching || !patientIdInput.trim()
                    ? 'bg-slate-300 cursor-not-allowed'
                    : 'bg-teal-600 hover:bg-teal-700 active:scale-[0.98]'
                }`}
              >
                {isSearching ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search size={18} />
                    Submit
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={handleShowList}
                  disabled={isSearching}
                  className="text-teal-600 hover:text-teal-700 font-bold text-sm underline transition-all"
                >
                  List of Patients
                </button>
                <span className="text-slate-300">|</span>
                <button
                  type="button"
                  onClick={() => alert("Add New Patient feature is currently under construction.")}
                  disabled={isSearching}
                  className="text-teal-600 hover:text-teal-700 font-bold text-sm underline transition-all"
                >
                  Add Patient
                </button>
              </div>
            </div>
          </form>

          <div className="p-6 bg-slate-50 text-center border-t border-slate-100">
            <p className="text-xs text-slate-400">
              Secure electronic medical record access. Authorized personnel only.
            </p>
          </div>
        </div>
        
        <div className="mt-8 text-center text-xs text-slate-400">
          &copy; 2024 MediView EMR Systems. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default App;
