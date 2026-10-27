"""
AgriVoice AI - Database Connection & Initialization
SQLite local database setup for storing farmer consultation history.
"""

import os
import sqlite3
from typing import Generator

DB_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")
DB_PATH = os.path.join(DB_DIR, "agrivoice.db")

def init_db():
    """Create data directory and initialize schema."""
    os.makedirs(DB_DIR, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS consultation_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp TEXT NOT NULL,
        crop_en TEXT NOT NULL,
        crop_ta TEXT NOT NULL,
        disease_name_en TEXT NOT NULL,
        disease_name_ta TEXT NOT NULL,
        disease_id TEXT NOT NULL,
        confidence REAL NOT NULL,
        confidence_percentage REAL NOT NULL,
        image_url TEXT NOT NULL,
        is_healthy INTEGER DEFAULT 0,
        severity TEXT DEFAULT 'moderate',
        symptoms_json TEXT,
        treatments_json TEXT,
        farmer_question TEXT,
        ai_response TEXT
    );
    """)
    conn.commit()
    conn.close()
    print(f"[Database] SQLite initialized at {DB_PATH}")

def get_connection():
    """Get SQLite database connection with row factory."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn
