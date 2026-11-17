"""
AgriVoice AI - Disease Prediction API Router
Handles leaf image uploads, computer vision inference, and sample generation.
"""

import os
import uuid
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import List, Optional

from backend.ml.predictor import DiseasePredictor
from backend.ml.sample_images import SAMPLE_PREVIEWS, ensure_sample_images
from backend.ml.knowledge_base import list_all_diseases
from backend.database.crud import insert_prediction
from backend.models.schemas import DiseasePredictionResponse, SampleLeafResponse

router = APIRouter(prefix="/api/disease", tags=["Disease Detection"])

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads", "images")
SAMPLES_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads", "samples")

os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(SAMPLES_DIR, exist_ok=True)

# Initialize Predictor
ai_mode = os.environ.get("AI_MODE", "demo")
model_path = os.environ.get("CNN_MODEL_PATH", "")
predictor = DiseasePredictor(mode=ai_mode, model_path=model_path if model_path else None)

@router.post("/predict", response_model=DiseasePredictionResponse)
async def predict_crop_disease(
    file: Optional[UploadFile] = File(None),
    sample_id: Optional[str] = Form(None)
):
    """
    Predict crop disease from uploaded leaf image or sample ID.
    Performs image validation, CNN inference, agricultural knowledge lookup, and history logging.
    """
    image_rel_url = ""
    saved_path = ""
    filename_hint = None

    if file and file.filename:
        # Validate mime type
        valid_types = ["image/jpeg", "image/png", "image/webp", "image/bmp", "image/jpg"]
        if file.content_type and file.content_type.lower() not in valid_types:
            raise HTTPException(
                status_code=400,
                detail="Unsupported image format. Please upload a clear JPG, PNG, or WebP photo of the crop leaf."
            )
        
        # Read file contents and validate size (< 15MB)
        contents = await file.read()
        if len(contents) > 15 * 1024 * 1024:
            raise HTTPException(
                status_code=400,
                detail="Image file too large. Please upload a photo under 15MB."
            )
        if len(contents) < 500:
            raise HTTPException(
                status_code=400,
                detail="Invalid image file. Please upload a valid crop leaf photo."
            )

        unique_name = f"{uuid.uuid4().hex}_{file.filename}"
        saved_path = os.path.join(UPLOAD_DIR, unique_name)
        with open(saved_path, "wb") as f:
            f.write(contents)
            
        image_rel_url = f"/uploads/images/{unique_name}"
        filename_hint = file.filename

    elif sample_id:
        ensure_sample_images(SAMPLES_DIR)
        # Find sample
        match = next((s for s in SAMPLE_PREVIEWS if s["id"] == sample_id), None)
        if not match:
            match = SAMPLE_PREVIEWS[0]
        saved_path = os.path.join(SAMPLES_DIR, match["filename"])
        image_rel_url = f"/uploads/samples/{match['filename']}"
        filename_hint = match["id"]
    else:
        raise HTTPException(
            status_code=400,
            detail="No image uploaded or sample leaf selected. Please provide a leaf image."
        )

    try:
        # Run CNN prediction pipeline
        result = predictor.predict(saved_path, filename_hint=filename_hint)
    except Exception as e:
        raise HTTPException(
            status_code=422,
            detail=f"Unable to analyze this image. Please upload a clearer crop leaf photo. Error: {str(e)}"
        )

    result["image_url"] = image_rel_url

    # Store in history database
    try:
        history_id = insert_prediction(result)
        result["history_id"] = history_id
    except Exception as e:
        print(f"[Database Error] Could not save history: {e}")
        result["history_id"] = None

    return result

@router.get("/samples", response_model=List[SampleLeafResponse])
async def get_sample_leaves():
    """Returns pre-loaded sample leaves for quick testing without camera or manual upload."""
    ensure_sample_images(SAMPLES_DIR)
    samples = []
    for s in SAMPLE_PREVIEWS:
        samples.append(SampleLeafResponse(
            id=s["id"],
            crop=s["crop"],
            disease=s["disease"],
            disease_ta=s["disease_ta"],
            badge=s["badge"],
            image_url=f"/uploads/samples/{s['filename']}"
        ))
    return samples

@router.get("/classes")
async def get_disease_classes():
    """Return all supported crops and diseases."""
    return list_all_diseases()
