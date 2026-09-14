export interface GenerateCvPayload {
  job_description: string;
  use_photo: boolean;
  custom_role?: string;
  target_phone: string;
}

export interface GenerateCvResponse {
  role_title?: string;
  pdf_base64?: string;
  pdf_filename?: string;
}

export type StepState = 'idle' | 'active' | 'done';

export interface TrackerStep {
  id: number;
  title: string;
  description: string;
  state: StepState;
}

export interface GenerationResult {
  roleTitle: string;
  pdfBase64: string | null;
  pdfFilename: string;
  isNetworkTimeoutWarning?: boolean;
}
