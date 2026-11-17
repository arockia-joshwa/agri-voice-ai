export type Language = 'ta' | 'en';

export interface TopPrediction {
  disease_id: string;
  crop_en: string;
  crop_ta: string;
  disease_name_en: string;
  disease_name_ta: string;
  confidence: number;
  confidence_percentage: number;
}

export interface PredictionResult {
  disease_id: string;
  crop_en: string;
  crop_ta: string;
  disease_name_en: string;
  disease_name_ta: string;
  scientific_name?: string;
  is_healthy: boolean;
  severity: 'high' | 'moderate' | 'low' | 'none';
  confidence: number;
  confidence_percentage: number;
  symptoms_en: string[];
  symptoms_ta: string[];
  causes_en: string[];
  causes_ta: string[];
  treatments_en: string[];
  treatments_ta: string[];
  organic_remedies_en?: string[];
  organic_remedies_ta?: string[];
  prevention_en?: string[];
  prevention_ta?: string[];
  image_url: string;
  history_id?: number;
  ai_mode: 'demo' | 'production';
  disclaimer_en: string;
  disclaimer_ta: string;
  top_predictions?: TopPrediction[];
}

export interface ChatMessage {
  id: string;
  sender: 'farmer' | 'ai';
  text_ta: string;
  text_en: string;
  audio_url?: string | null;
  timestamp: string;
  isAudio?: boolean;
}

export interface HistoryRecord {
  id: number;
  timestamp: string;
  crop_en: string;
  crop_ta: string;
  disease_name_en: string;
  disease_name_ta: string;
  disease_id: string;
  confidence: number;
  confidence_percentage: number;
  image_url: string;
  is_healthy: boolean;
  severity: string;
  farmer_question?: string;
  ai_response?: string;
  symptoms?: string[];
  treatments?: string[];
}

export interface SampleLeaf {
  id: string;
  crop: string;
  disease: string;
  disease_ta: string;
  badge: string;
  image_url: string;
}

export type ActiveTab = 'dashboard' | 'detect' | 'voice' | 'history' | 'about';
