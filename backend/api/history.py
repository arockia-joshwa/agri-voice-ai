"""
AgriVoice AI - History API Router
Retrieval and management of past farmer disease scans and consultations.
"""

from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from backend.database.crud import get_all_history, get_history_by_id, delete_history_record

router = APIRouter(prefix="/api/history", tags=["Consultation History"])

@router.get("", response_model=List[Dict[str, Any]])
async def list_history(limit: int = 50):
    """Retrieve previous crop analyses with images, diagnosis, and Q&A."""
    return get_all_history(limit=limit)

@router.get("/{record_id}", response_model=Dict[str, Any])
async def retrieve_history_item(record_id: int):
    """Retrieve full details of a specific past consultation."""
    item = get_history_by_id(record_id)
    if not item:
        raise HTTPException(status_code=404, detail="Consultation record not found.")
    return item

@router.delete("/{record_id}")
async def remove_history_item(record_id: int):
    """Delete a past consultation record."""
    deleted = delete_history_record(record_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Consultation record not found.")
    return {"success": True, "message": "Record deleted successfully."}
