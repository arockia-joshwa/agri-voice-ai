"""
AgriVoice AI - Pydantic Schemas for API Requests & Responses
"""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class DiseasePredictionResponse(BaseModel):
    disease_id: str
    crop_en: str
    crop_ta: str
    disease_name_en: str
    disease_name_ta: str
    scientific_name: Optional[str] = ""
    is_healthy: bool
    severity: str
    confidence: float
    confidence_percentage: float
    symptoms_en: List[str]
    symptoms_ta: List[str]
    causes_en: List[str]
    causes_ta: List[str]
    treatments_en: List[str]
    treatments_ta: List[str]
    organic_remedies_en: List[str] = []
    organic_remedies_ta: List[str] = []
    prevention_en: List[str] = []
    prevention_ta: List[str] = []
    image_url: str
    history_id: Optional[int] = None
    ai_mode: str = "demo"
    disclaimer_en: str
    disclaimer_ta: str

class ChatRequest(BaseModel):
    question: str
    disease_context: Optional[Dict[str, Any]] = None
    history_id: Optional[int] = None
    language: str = "ta"
    generate_speech: bool = True

class ChatResponse(BaseModel):
    response_ta: str
    response_en: str
    audio_url: Optional[str] = None
    history_id: Optional[int] = None

class TTSRequest(BaseModel):
    text: str
    language: str = "ta"

class TTSResponse(BaseModel):
    audio_url: str
    success: bool = True

class TranscribeResponse(BaseModel):
    transcript: str
    language: str = "ta"
    confidence: float = 0.95

class SampleLeafResponse(BaseModel):
    id: str
    crop: str
    disease: str
    disease_ta: str
    badge: str
    image_url: str
