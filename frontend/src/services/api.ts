import type { PredictionResult, SampleLeaf, HistoryRecord } from '../types';

const API_BASE = ''; // Uses Vite proxy in development

export async function predictCropDisease(
  fileOrBlob?: File | Blob,
  sampleId?: string
): Promise<PredictionResult> {
  const formData = new FormData();
  if (fileOrBlob) {
    formData.append('file', fileOrBlob, 'leaf_capture.jpg');
  }
  if (sampleId) {
    formData.append('sample_id', sampleId);
  }

  const response = await fetch(`${API_BASE}/api/disease/predict`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to analyze crop leaf image');
  }

  return response.json();
}

export async function getSampleLeaves(): Promise<SampleLeaf[]> {
  const response = await fetch(`${API_BASE}/api/disease/samples`);
  if (!response.ok) {
    throw new Error('Failed to fetch sample leaf images');
  }
  return response.json();
}

export interface ChatApiResponse {
  response_ta: string;
  response_en: string;
  audio_url?: string | null;
  history_id?: number;
}

export async function askAssistant(
  question: string,
  diseaseContext?: PredictionResult | null,
  historyId?: number,
  language: string = 'ta',
  generateSpeech: boolean = true
): Promise<ChatApiResponse> {
  const payload = {
    question,
    disease_context: diseaseContext ? {
      disease_id: diseaseContext.disease_id,
      crop_en: diseaseContext.crop_en,
      crop_ta: diseaseContext.crop_ta,
      disease_name_en: diseaseContext.disease_name_en,
      disease_name_ta: diseaseContext.disease_name_ta,
      confidence_percentage: diseaseContext.confidence_percentage,
      is_healthy: diseaseContext.is_healthy,
      symptoms_ta: diseaseContext.symptoms_ta,
      symptoms_en: diseaseContext.symptoms_en,
      treatments_ta: diseaseContext.treatments_ta,
      treatments_en: diseaseContext.treatments_en,
      causes_ta: diseaseContext.causes_ta,
      causes_en: diseaseContext.causes_en,
      organic_remedies_ta: diseaseContext.organic_remedies_ta,
      organic_remedies_en: diseaseContext.organic_remedies_en,
      prevention_ta: diseaseContext.prevention_ta,
      prevention_en: diseaseContext.prevention_en
    } : null,
    history_id: historyId || null,
    language,
    generate_speech: generateSpeech
  };

  const response = await fetch(`${API_BASE}/api/assistant/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Assistant query failed');
  }

  return response.json();
}

export async function synthesizeSpeechAudio(text: string, language: string = 'ta'): Promise<string> {
  const response = await fetch(`${API_BASE}/api/voice/speak`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, language })
  });

  if (!response.ok) {
    throw new Error('Text to speech failed');
  }

  const data = await response.json();
  return data.audio_url;
}

export async function getConsultationHistory(): Promise<HistoryRecord[]> {
  const response = await fetch(`${API_BASE}/api/history`);
  if (!response.ok) {
    throw new Error('Failed to retrieve consultation history');
  }
  return response.json();
}

export async function deleteHistoryItem(id: number): Promise<boolean> {
  const response = await fetch(`${API_BASE}/api/history/${id}`, {
    method: 'DELETE'
  });
  return response.ok;
}

export async function checkBackendHealth() {
  try {
    const response = await fetch(`${API_BASE}/api/health`);
    return await response.json();
  } catch (e) {
    return null;
  }
}
