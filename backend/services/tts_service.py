"""
AgriVoice AI - Tamil & English Text-to-Speech Service
Uses gTTS to synthesize natural Tamil audio for farmer responses.
Includes audio caching and text sanitization.
"""

import os
import re
import hashlib
from typing import Optional
from gtts import gTTS

AUDIO_CACHE_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads", "audio")

def ensure_audio_dir():
    os.makedirs(AUDIO_CACHE_DIR, exist_ok=True)

def clean_text_for_speech(text: str) -> str:
    """Remove markdown symbols, URLs, asterisks, brackets, and extra punctuation."""
    # Remove markdown bold/italic
    clean = re.sub(r'[*_#`~]', '', text)
    # Remove markdown links
    clean = re.sub(r'\[(.*?)\]\(.*?\)', r'\1', clean)
    # Remove percentages like 92% -> replace with percent
    clean = clean.replace('%', ' சதவீதம் ')
    # Normalize multiple whitespaces
    clean = re.sub(r'\s+', ' ', clean).strip()
    return clean

def synthesize_speech(text: str, lang: str = "ta") -> str:
    """
    Synthesize audio from text using gTTS and return file path.
    Caches audio by text hash to avoid regeneration.
    """
    ensure_audio_dir()
    clean_text = clean_text_for_speech(text)
    
    if not clean_text:
        clean_text = "வணக்கம். தங்களுக்கு உதவ நான் தயாராக உள்ளேன்."

    # Cache key based on lang + clean text
    cache_key = hashlib.md5(f"{lang}:{clean_text}".encode("utf-8")).hexdigest()
    filename = f"tts_{cache_key}.mp3"
    filepath = os.path.join(AUDIO_CACHE_DIR, filename)

    if os.path.exists(filepath) and os.path.getsize(filepath) > 0:
        return filepath

    # Detect language: if no Tamil unicode characters, use 'en'
    has_tamil = any(0x0B80 <= ord(char) <= 0x0BFF for char in clean_text)
    target_lang = "ta" if has_tamil or lang == "ta" else "en"

    try:
        tts = gTTS(text=clean_text[:600], lang=target_lang, slow=False)
        tts.save(filepath)
        return filepath
    except Exception as e:
        print(f"[TTS Error] gTTS generation failed: {e}")
        # Return fallback or raise
        raise RuntimeError(f"Text-to-speech generation failed: {str(e)}")
