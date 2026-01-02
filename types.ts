export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  dateOfBirth: string;
  mrn: string;
  referringProvider: string;
  referringProviderFax: string;
  pharmacy: string;
  pharmacyLocation: string;
  state?: string; // Added state from JSON
}

export interface Problem {
  id: string;
  problem_name: string;
  status: string;
  onset_date?: string;
  notes?: string;
  severity?: 'low' | 'medium' | 'high'; // Internal UI helper
  tags?: string[];
}

export interface HealthMaintenanceItem {
  id: string;
  item: string;
  status: string;
  last_date?: string;
  next_due_date?: string;
  reason?: string;
}

export interface ClinicalNote {
  id: string;
  date: string;
  title: string;
  provider: string;
  type: 'office' | 'outside';
  summary?: string;
}

export interface LabOrder {
  id: string;
  order_type: string;
  name: string;
  ordered_date: string;
  status: string;
}

export interface Procedure {
  id: string;
  procedure_name: string;
  date: string;
  indication?: string;
  status: string;
  notes?: string;
}

export interface LabResult {
  id: string;
  date: string;
  test_name: string;
  value: string;
  unit: string;
  interpretation?: string;
}

export interface ImagingItem {
  id: string;
  study_type: string;
  finding: string;
  date: string;
  status: string;
}

export interface Communication {
  id: string;
  communication_type: string;
  date: string;
  summary: string;
  status: string;
  checked?: boolean;
}