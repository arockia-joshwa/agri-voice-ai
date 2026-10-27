"""
AgriVoice AI - Agricultural Assistant Chat API Router
Handles contextual Q&A in Tamil and English with automatic Tamil TTS synthesis.
"""

import os
from fastapi import APIRouter, HTTPException
from backend.services.agro_advisor import AgroAdvisorService
from backend.services.tts_service import synthesize_speech
from backend.database.crud import update_history_conversation
from backend.models.schemas import ChatRequest, ChatResponse

router = APIRouter(prefix="/api/assistant", tags=["Agricultural Assistant"])

advisor = AgroAdvisorService()

@router.post("/chat", response_model=ChatResponse)
async def chat_with_assistant(req: ChatRequest):
    """
    Agricultural assistant chat endpoint.
    Maintains crop disease context and answers in farmer-friendly Tamil and English.
    Synthesizes Tamil audio response via gTTS if generate_speech is True.
    """
    if not req.question or not req.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty.")

    # Generate context-aware response
    advice = advisor.ask(
        question=req.question,
        disease_context=req.disease_context,
        language=req.language
    )

    audio_url = None
    if req.generate_speech:
        try:
            # Prefer Tamil audio if available
            spoken_text = advice.get("response_ta") if req.language == "ta" else advice.get("response_en")
            target_lang = "ta" if req.language == "ta" else "en"
            audio_path = synthesize_speech(spoken_text, lang=target_lang)
            filename = os.path.basename(audio_path)
            audio_url = f"/uploads/audio/{filename}"
        except Exception as e:
            print(f"[TTS Warning] Audio synthesis failed: {e}")
            audio_url = None

    # Update history log if history_id was provided
    if req.history_id:
        try:
            update_history_conversation(
                record_id=req.history_id,
                question=req.question,
                response=advice.get("response_ta", "")
            )
        except Exception as e:
            print(f"[History Update Error] {e}")

    return ChatResponse(
        response_ta=advice.get("response_ta", ""),
        response_en=advice.get("response_en", ""),
        audio_url=audio_url,
        history_id=req.history_id
    )
