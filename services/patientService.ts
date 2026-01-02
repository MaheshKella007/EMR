import { apiFetch, PATIENT_API_BASE_URL, FILES_API_BASE_URL } from './api';
import { Patient } from '../types';

export interface DashboardData {
  problems: any[];
  procedures: any[];
  healthMaintenance: any[];
  orders: any[];
  imaging: any[];
  communications: any[];
  labs: any[];
  notes: any[];
}

export interface BackendDashboardResponse {
  id: number;
  patient_id: number;
  approval_status: 'APPROVED' | 'NOT_APPROVED';
  extracted_json: {
    labs: any[];
    procedures: any[];
    problem_list: any[];
    resolved_problems: any[];
    logs_or_notes: string;
    imaging_and_pathology: any[];
    open_orders_referrals: any[];
    health_maintenance_and_recalls: any[];
    patient_communications_and_tasks: any[];
  };
  updated_time: string;
  created_time: string;
}

export const patientService = {
  getPatients: async () => {
    const result = await apiFetch<Patient[]>(PATIENT_API_BASE_URL, '/patients');
    return result;
  },

  getPatientById: async (id: string) => {
    const result = await apiFetch<any>(PATIENT_API_BASE_URL, `/patient-data/${id}`);
    return result;
  },

  getPatientDashboard: async (id: string) => {
    // Fetches the specific patient extraction result
    const result = await apiFetch<BackendDashboardResponse>(FILES_API_BASE_URL, `/files/${id}`);
    return result;
  },

  savePatientDashboard: async (id: string, payload: any) => {
    // Actual API endpoint provided: http://127.0.0.1:8000/api/files/save-extracted-data
    const result = await fetch(`http://127.0.0.1:8000/api/files/save-extracted-data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        patient_id: parseInt(id),
        json_data: payload 
      }),
    });
    
    if (!result.ok) throw new Error("Failed to save dashboard data");
    return await result.json();
  }
};