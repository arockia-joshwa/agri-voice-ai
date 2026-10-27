"""
AgriVoice AI - Main FastAPI Application
Smart AI Assistant for Farmers: Computer Vision Leaf Diagnosis + Contextual Tamil Voice AI
"""

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from backend.database.db import init_db
from backend.ml.sample_images import ensure_sample_images
from backend.api import disease, assistant, voice, history

app = FastAPI(
    title="AgriVoice AI",
    description="Smart AI Assistant for Farmers: Crop Leaf Disease Detection & Context-Aware Tamil Voice Assistant",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Base directories
BASE_DIR = os.path.dirname(__file__)
UPLOADS_DIR = os.path.join(BASE_DIR, "uploads")
IMAGES_DIR = os.path.join(UPLOADS_DIR, "images")
SAMPLES_DIR = os.path.join(UPLOADS_DIR, "samples")
AUDIO_DIR = os.path.join(UPLOADS_DIR, "audio")

os.makedirs(IMAGES_DIR, exist_ok=True)
os.makedirs(SAMPLES_DIR, exist_ok=True)
os.makedirs(AUDIO_DIR, exist_ok=True)

# Mount static file directory for serving uploaded leaf images, samples, and audio clips
app.mount("/uploads", StaticFiles(directory=UPLOADS_DIR), name="uploads")

# Include Routers
app.include_router(disease.router)
app.include_router(assistant.router)
app.include_router(voice.router)
app.include_router(history.router)

@app.on_event("startup")
async def startup_event():
    """Initialize database and generate sample leaf images."""
    print("[AgriVoice AI] Starting backend server...")
    init_db()
    ensure_sample_images(SAMPLES_DIR)
    ai_mode = os.environ.get("AI_MODE", "demo")
    print(f"[AgriVoice AI] Operating in mode: {ai_mode.upper()}")
    print("[AgriVoice AI] Ready to serve farmer requests.")

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "app": "AgriVoice AI",
        "version": "1.0.0",
        "ai_mode": os.environ.get("AI_MODE", "demo"),
        "tamil_voice_supported": True,
        "database": "sqlite_ready"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
