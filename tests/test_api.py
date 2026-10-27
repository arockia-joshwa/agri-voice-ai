"""
AgriVoice AI - API & ML Integration Test Suite
Validates disease prediction, context-aware Tamil AI assistant, audio synthesis, and SQLite history.
"""

import sys
import os
import unittest
from fastapi.testclient import TestClient

# Ensure root directory is on PYTHONPATH
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.main import app
from backend.database.db import init_db

class TestAgriVoiceAI(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        init_db()
        cls.client = TestClient(app)

    def test_01_health_check(self):
        """Verify health check endpoint returns 200 and healthy status."""
        response = self.client.get("/api/health")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["app"], "AgriVoice AI")
        self.assertEqual(data["status"], "healthy")
        self.assertTrue(data["tamil_voice_supported"])

    def test_02_sample_leaves(self):
        """Verify sample leaves endpoint returns populated list of test leaves."""
        response = self.client.get("/api/disease/samples")
        self.assertEqual(response.status_code, 200)
        samples = response.json()
        self.assertGreaterEqual(len(samples), 5)
        rice_blast = next((s for s in samples if s["id"] == "rice_leaf_blast"), None)
        self.assertIsNotNone(rice_blast)
        self.assertEqual(rice_blast["crop"], "Rice")

    def test_03_predict_crop_disease_sample(self):
        """Verify disease prediction on sample leaf returns clinical agricultural diagnosis."""
        response = self.client.post("/api/disease/predict", data={"sample_id": "rice_leaf_blast"})
        self.assertEqual(response.status_code, 200)
        data = response.json()
        
        self.assertEqual(data["disease_id"], "rice_leaf_blast")
        self.assertEqual(data["crop_en"], "Rice (Paddy)")
        self.assertEqual(data["crop_ta"], "நெல் (பயிர்)")
        self.assertEqual(data["disease_name_en"], "Leaf Blast")
        self.assertIn("பிளாஸ்ட்", data["disease_name_ta"])
        self.assertFalse(data["is_healthy"])
        self.assertGreater(data["confidence"], 0.85)
        self.assertGreater(len(data["symptoms_ta"]), 0)
        self.assertGreater(len(data["treatments_ta"]), 0)
        self.assertIsNotNone(data.get("history_id"))
        self.__class__.saved_history_id = data["history_id"]
        self.__class__.last_prediction = data

    def test_04_context_aware_tamil_chat(self):
        """Verify AI assistant understands relative Tamil question using active disease context."""
        context = getattr(self.__class__, "last_prediction", None)
        history_id = getattr(self.__class__, "saved_history_id", None)
        
        # Farmer asks in Tamil: "இதற்கு என்ன செய்ய வேண்டும்?" (What to do for this?)
        payload = {
            "question": "இதற்கு என்ன செய்ய வேண்டும்?",
            "disease_context": context,
            "history_id": history_id,
            "language": "ta",
            "generate_speech": True
        }
        response = self.client.post("/api/assistant/chat", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        
        # Should reference the disease and provide treatment advice in Tamil
        self.assertIn("இலை கருகல்", data["response_ta"])
        self.assertGreater(len(data["response_en"]), 10)
        # Should generate audio URL for farmer
        self.assertIsNotNone(data.get("audio_url"))
        self.assertTrue(data["audio_url"].endswith(".mp3"))

    def test_05_tts_audio_synthesis(self):
        """Verify standalone Text-to-Speech endpoint generates streamable Tamil audio."""
        payload = {
            "text": "வணக்கம் உழவரே, உங்கள் பயிர் ஆரோக்கியமாக உள்ளது.",
            "language": "ta"
        }
        response = self.client.post("/api/voice/speak", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data["success"])
        self.assertTrue(data["audio_url"].startswith("/uploads/audio/"))

    def test_06_history_retrieval(self):
        """Verify consultation history returns recorded scan and conversation."""
        response = self.client.get("/api/history")
        self.assertEqual(response.status_code, 200)
        history = response.json()
        self.assertGreater(len(history), 0)
        
        history_id = getattr(self.__class__, "saved_history_id", None)
        if history_id:
            record_res = self.client.get(f"/api/history/{history_id}")
            self.assertEqual(record_res.status_code, 200)
            record = record_res.json()
            self.assertEqual(record["crop_en"], "Rice (Paddy)")
            self.assertIn("இதற்கு என்ன", record.get("farmer_question", ""))

if __name__ == "__main__":
    unittest.main()
