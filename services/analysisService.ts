import { FILES_API_BASE_URL } from './api';
import { FileWithMetadata } from '../components/UploadModal';

export interface AnalysisResponse {
  status: string;
  patient_id: string;
  extracted_data: {
    problem_list?: any[];
    procedures?: any[];
    health_maintenance_and_recalls?: any[];
    open_orders_referrals?: any[];
    imaging_and_pathology?: any[];
    patient_communications_and_tasks?: any[];
    labs?: any[];
    logs_or_notes?: string;
    summary?: string;
  };
}

export const analysisService = {
  analyzeDocuments: async (
    filesWithMetadata: FileWithMetadata[], 
    patientId: string
  ) => {
    const formData = new FormData();
    
    // 1. Construct the metadata array for the files_data field from each item
    const filesDataMetadata = filesWithMetadata.map(item => ({
      report_type: item.reportType,
      tag_document: item.tag,
      file_name: item.file.name
    }));
    
    // 2. Append required metadata fields using snake_case keys
    formData.append('patient_id', patientId);
    formData.append('uploader_details', "12"); 
    formData.append('files_data', JSON.stringify(filesDataMetadata));
    
    // 3. Append each actual file binary using the "files" key
    filesWithMetadata.forEach((item) => {
      formData.append('files', item.file);
    });

    // Send the request to the specified upload endpoint on 127.0.0.1:8000
    const response = await fetch(`${FILES_API_BASE_URL}/files/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    return response.json() as Promise<AnalysisResponse>;
  }
};