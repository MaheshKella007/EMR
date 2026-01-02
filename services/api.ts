export const PATIENT_API_BASE_URL = 'http://localhost:9095/api';
export const FILES_API_BASE_URL = 'http://127.0.0.1:8000/api';

export async function apiFetch<T>(baseUrl: string, endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${baseUrl}${endpoint}`, options);
  
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || `API Error: ${response.status} ${response.statusText}`);
  }
  
  const json = await response.json();
  return json as T;
}