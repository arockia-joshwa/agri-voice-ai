"""
AgriVoice AI - Database CRUD operations
"""

import json
from datetime import datetime
from typing import List, Dict, Any, Optional
from .db import get_connection

def insert_prediction(data: Dict[str, Any]) -> int:
    """Store leaf analysis prediction in history table."""
    conn = get_connection()
    cursor = conn.cursor()
    
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    symptoms_json = json.dumps(data.get("symptoms_ta", []))
    treatments_json = json.dumps(data.get("treatments_ta", []))
    
    cursor.execute("""
        INSERT INTO consultation_history (
            timestamp, crop_en, crop_ta, disease_name_en, disease_name_ta,
            disease_id, confidence, confidence_percentage, image_url,
            is_healthy, severity, symptoms_json, treatments_json,
            farmer_question, ai_response
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        timestamp,
        data.get("crop_en", "Crop"),
        data.get("crop_ta", "பயிர்"),
        data.get("disease_name_en", "Unknown"),
        data.get("disease_name_ta", "தெரியாத நோய்"),
        data.get("disease_id", ""),
        float(data.get("confidence", 0.0)),
        float(data.get("confidence_percentage", 0.0)),
        data.get("image_url", ""),
        1 if data.get("is_healthy", False) else 0,
        data.get("severity", "moderate"),
        symptoms_json,
        treatments_json,
        data.get("farmer_question", ""),
        data.get("ai_response", "")
    ))
    conn.commit()
    inserted_id = cursor.lastrowid
    conn.close()
    return inserted_id

def get_all_history(limit: int = 50) -> List[Dict[str, Any]]:
    """Retrieve consultation history ordered by recent."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT * FROM consultation_history 
        ORDER BY id DESC LIMIT ?
    """, (limit,))
    rows = cursor.fetchall()
    conn.close()
    
    results = []
    for row in rows:
        item = dict(row)
        try:
            item["symptoms"] = json.loads(item["symptoms_json"]) if item["symptoms_json"] else []
        except:
            item["symptoms"] = []
        try:
            item["treatments"] = json.loads(item["treatments_json"]) if item["treatments_json"] else []
        except:
            item["treatments"] = []
        item["is_healthy"] = bool(item["is_healthy"])
        results.append(item)
    return results

def get_history_by_id(record_id: int) -> Optional[Dict[str, Any]]:
    """Get single history record by ID."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM consultation_history WHERE id = ?", (record_id,))
    row = cursor.fetchone()
    conn.close()
    if not row:
        return None
    item = dict(row)
    try:
        item["symptoms"] = json.loads(item["symptoms_json"]) if item["symptoms_json"] else []
    except:
        item["symptoms"] = []
    try:
        item["treatments"] = json.loads(item["treatments_json"]) if item["treatments_json"] else []
    except:
        item["treatments"] = []
    item["is_healthy"] = bool(item["is_healthy"])
    return item

def update_history_conversation(record_id: int, question: str, response: str) -> bool:
    """Attach farmer voice question and AI response to the history record."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE consultation_history
        SET farmer_question = ?, ai_response = ?
        WHERE id = ?
    """, (question, response, record_id))
    conn.commit()
    updated = cursor.rowcount > 0
    conn.close()
    return updated

def delete_history_record(record_id: int) -> bool:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM consultation_history WHERE id = ?", (record_id,))
    conn.commit()
    deleted = cursor.rowcount > 0
    conn.close()
    return deleted
