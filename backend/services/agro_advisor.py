"""
AgriVoice AI - Agro Advisor Service
Context-aware AI agricultural assistant providing clear, farmer-friendly guidance
in Tamil and English. Integrates with Gemini AI when API key is set, or
uses the built-in Intelligent Agricultural Expert Engine when in demo/offline mode.
"""

import os
import re
from typing import Dict, Any, Optional, List
from backend.ml.knowledge_base import DISEASE_DATABASE, FARMER_GENERAL_QA_TA, get_disease_by_id

class AgroAdvisorService:
    def __init__(self):
        self.api_key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
        self.client = None
        if self.api_key:
            try:
                from google import genai
                self.client = genai.Client(api_key=self.api_key)
                print("[AgroAdvisor] Initialized Gemini AI client successfully.")
            except Exception as e:
                print(f"[AgroAdvisor] Could not initialize Gemini client: {e}")

    def ask(
        self,
        question: str,
        disease_context: Optional[Dict[str, Any]] = None,
        language: str = "ta"
    ) -> Dict[str, str]:
        """
        Main query handler. Answers farmer questions using disease context.
        Returns dict with both 'response_ta' and 'response_en'.
        """
        clean_q = question.strip()
        if not clean_q:
            return {
                "response_ta": "வணக்கம்! உங்கள் பயிரின் படம் அல்லது சந்தேகத்தை கேளுங்கள். உதவ நான் தயாராக உள்ளேன்.",
                "response_en": "Hello! Please upload a crop photo or ask any agricultural question. I'm here to help."
            }

        # If Gemini client is active and configured, use it with structured agricultural system prompt
        if self.client:
            try:
                return self._ask_gemini(clean_q, disease_context)
            except Exception as e:
                print(f"[AgroAdvisor] Gemini API failed ({e}). Falling back to Agricultural Expert Engine.")

        # Built-in context-aware Agricultural Expert Engine
        return self._ask_expert_engine(clean_q, disease_context)

    def _ask_gemini(self, question: str, disease_context: Optional[Dict[str, Any]] = None) -> Dict[str, str]:
        """Call Gemini model with agricultural prompt and crop context."""
        context_str = "No active leaf scan."
        if disease_context:
            crop = disease_context.get("crop_en", "Crop")
            crop_ta = disease_context.get("crop_ta", "பயிர்")
            disease = disease_context.get("disease_name_en", "Disease")
            disease_ta = disease_context.get("disease_name_ta", "நோய்")
            confidence = disease_context.get("confidence_percentage", 90)
            context_str = f"ACTIVE CROP CONTEXT: {crop} ({crop_ta}), Detected Disease: {disease} ({disease_ta}), Confidence: {confidence}%."

        prompt = f"""
You are AgriVoice AI, a compassionate and expert agricultural scientist advising Tamil farmers.
Farmer's current scan: {context_str}
Farmer's Question: "{question}"

Instructions:
1. Provide a warm, practical, farmer-friendly answer in simple spoken Tamil without overly academic jargon.
2. If the farmer uses relative words like 'இதற்கு' (for this), 'இந்த நோய்' (this disease), relate it directly to the active crop context.
3. Include dosage, spray instructions, and organic alternatives where relevant.
4. Also provide a concise English translation.

Format your response EXACTLY as:
TAMIL:
<Tamil answer>
ENGLISH:
<English answer>
"""
        response = self.client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt
        )
        text = response.text or ""
        
        ta_match = re.search(r'TAMIL:\s*(.*?)(?=ENGLISH:|$)', text, re.DOTALL | re.IGNORECASE)
        en_match = re.search(r'ENGLISH:\s*(.*?)$', text, re.DOTALL | re.IGNORECASE)

        res_ta = ta_match.group(1).strip() if ta_match else text
        res_en = en_match.group(1).strip() if en_match else "Here is the agricultural advice for your crop."

        return {"response_ta": res_ta, "response_en": res_en}

    def _ask_expert_engine(self, question: str, disease_context: Optional[Dict[str, Any]] = None) -> Dict[str, str]:
        """
        Rule and pattern based agricultural intelligence engine.
        Handles context resolution (e.g. 'இதற்கு என்ன மருந்து?', 'காரணம் என்ன?')
        and general farming questions in Tamil & English.
        """
        q_lower = question.lower()
        
        # Check if we have active disease context
        has_context = disease_context is not None and "disease_id" in disease_context
        ctx_data = None
        if has_context:
            disease_id = disease_context["disease_id"]
            ctx_data = get_disease_by_id(disease_id) or disease_context

        # 1. Questions asking what disease it is / identity
        # e.g., "இந்த நெற்பயிருக்கு என்ன நோய்?", "என்ன நோய் இது?", "what disease is this?"
        if any(term in question for term in ["என்ன நோய்", "எந்த நோய்", "நோய் என்ன", "என்ன பாதிப்பு"]) or "what disease" in q_lower:
            if ctx_data:
                crop_ta = ctx_data.get("crop_ta", "பயிர்")
                disease_ta = ctx_data.get("disease_name_ta") or ctx_data.get("disease_ta", "நோய்")
                crop_en = ctx_data.get("crop_en", "Crop")
                disease_en = ctx_data.get("disease_name_en") or ctx_data.get("disease_en", "Disease")
                conf = ctx_data.get("confidence_percentage", 92)
                
                if ctx_data.get("is_healthy", False):
                    return {
                        "response_ta": f"மகிழ்ச்சியான செய்தி! உங்கள் {crop_ta} இலைகள் ஆரோக்கியமாக உள்ளன (நம்பகத்தன்மை: {conf}%). எந்தவொரு நோய் தாக்குதலும் இல்லை. வழக்கமான பாசனம் மற்றும் களை எடுப்பை தொடரவும்.",
                        "response_en": f"Great news! Your {crop_en} is healthy ({conf}% confidence). No disease detected. Continue normal irrigation and weeding."
                    }
                else:
                    return {
                        "response_ta": f"உங்கள் {crop_ta} பயிரில் '{disease_ta}' கண்டறியப்பட்டுள்ளது (நம்பகத்தன்மை: {conf}%). இதற்கான அறிகுறிகள் மற்றும் உடனடி சிகிச்சை முறைகளை நீங்கள் கேட்கலாம்.",
                        "response_en": f"Your {crop_en} crop is affected by '{disease_en}' ({conf}% confidence). You can ask for symptoms, causes, or immediate treatment steps."
                    }
            else:
                return {
                    "response_ta": "முதலில் உங்கள் பயிர் இலையின் புகைப்படத்தை பதிவேற்றுங்கள். கணினி பார்வை (AI) மூலம் நோயைக் கண்டறிந்து கூறுகிறேன்.",
                    "response_en": "Please upload a photo of your crop leaf first. Our AI vision will identify the exact disease for you."
                }

        # 2. Questions asking for treatment / medicine / how to control
        # e.g. "இதற்கு என்ன செய்ய வேண்டும்?", "இந்த நோயை எப்படி கட்டுப்படுத்துவது?", "என்ன மருந்து தேவை?", "medicine", "treatment", "control"
        if any(term in question for term in [
            "என்ன செய்ய வேண்டும்", "எப்படி கட்டுப்படுத்துவது", "என்ன மருந்து", "மருந்து என்ன",
            "கட்டுப்படுத்த", "தீர்வு என்ன", "ஸ்பிரே", "தெளிக்க", "இதற்கு என்ன", "எப்படி சரி செய்வது"
        ]) or any(term in q_lower for term in ["treatment", "cure", "medicine", "control", "what to do", "remedy"]):
            if ctx_data and not ctx_data.get("is_healthy", False):
                disease_ta = ctx_data.get("disease_name_ta") or ctx_data.get("disease_ta", "பயிர் நோய்")
                treatments_ta = ctx_data.get("treatments_ta", [])
                treat_text_ta = " ".join(treatments_ta[:2]) if treatments_ta else "பரிந்துரைக்கப்பட்ட பூஞ்சாணக் கொல்லியை தெளிக்கவும்."
                
                disease_en = ctx_data.get("disease_name_en") or ctx_data.get("disease_en", "crop disease")
                treatments_en = ctx_data.get("treatments_en", [])
                treat_text_en = " ".join(treatments_en[:2]) if treatments_en else "Spray recommended fungicide."

                return {
                    "response_ta": f"{disease_ta} நோயைக் கட்டுப்படுத்த உடனடியாக செய்ய வேண்டியவை: {treat_text_ta} மருந்து தெளிக்கும் போது வயலில் போதிய ஈரம் இருப்பதையும், மாலையில் தெளிப்பதையும் உறுதி செய்யவும்.",
                    "response_en": f"To control {disease_en}: {treat_text_en} Ensure adequate soil moisture and spray during late afternoon."
                }
            elif ctx_data and ctx_data.get("is_healthy", False):
                return {
                    "response_ta": "உங்கள் பயிர் ஆரோக்கியமாக உள்ளதால் தற்போது எந்த இரசாயன மருந்தும் தெளிக்க தேவையில்லை. 15 நாட்களுக்கு ஒருமுறை பஞ்சகாவ்யா தெளித்து பயிரை செழிப்பாக வைத்திருக்கலாம்.",
                    "response_en": "Your crop is healthy so no chemical pesticide is needed. Spraying 3% Panchagavya every 15 days will boost vitality."
                }
            else:
                return {
                    "response_ta": "நோயைக் கட்டுப்படுத்த துல்லியமான மருந்தை பரிந்துரைக்க, தயவுசெய்து பாதிக்கப்பட்ட இலையின் புகைப்படத்தை மேலே பதிவேற்றவும்.",
                    "response_en": "To prescribe the exact treatment, please upload a photo of the affected crop leaf above."
                }

        # 3. Questions asking for causes / why did this happen
        # e.g. "ஏன் வந்தது?", "காரணம் என்ன?", "why did this happen?", "cause"
        if any(term in question for term in ["காரணம்", "ஏன் வந்தது", "எதனால்", "ஏன் மஞ்சளாகிறது"]) or any(term in q_lower for term in ["cause", "why", "reason"]):
            if ctx_data and not ctx_data.get("is_healthy", False):
                disease_ta = ctx_data.get("disease_name_ta") or ctx_data.get("disease_ta", "பயிர் நோய்")
                causes_ta = ctx_data.get("causes_ta", [])
                cause_text_ta = " ".join(causes_ta[:2]) if causes_ta else "பூஞ்சாண அல்லது பாக்டீரியா தொற்று."
                
                disease_en = ctx_data.get("disease_name_en") or ctx_data.get("disease_en", "crop disease")
                causes_en = ctx_data.get("causes_en", [])
                cause_text_en = " ".join(causes_en[:2]) if causes_en else "Fungal or bacterial pathogen."

                return {
                    "response_ta": f"{disease_ta} வர முக்கிய காரணங்கள்: {cause_text_ta} மேலும் வயலில் அதிக நீர் தேங்குவதும், அதிகப்படியான யூரியா இடுவதும் நோயை அதிகப்படுத்தும்.",
                    "response_en": f"Main causes for {disease_en}: {cause_text_en} Stagnant field water and excess nitrogen fertilizers accelerate disease development."
                }

        # 4. Questions asking for organic / natural remedies
        # e.g. "இயற்கை முறை", "ஆர்கானிக்", "organic", "natural"
        if any(term in question for term in ["இயற்கை", "ஆர்கானிக்", "பஞ்சகாவ்யா", "நாட்டு மருந்து"]) or "organic" in q_lower:
            if ctx_data and ctx_data.get("organic_remedies_ta"):
                remedies_ta = " ".join(ctx_data["organic_remedies_ta"])
                remedies_en = " ".join(ctx_data.get("organic_remedies_en", []))
                return {
                    "response_ta": f"இயற்கை வழி நிவாரணம்: {remedies_ta}",
                    "response_en": f"Organic remedy: {remedies_en}"
                }

        # 5. Questions asking for prevention / வராமல் தடுக்க
        if any(term in question for term in ["வராமல் தடுக்க", "தடுப்பு", "எதிர்காலம்", "prevention", "prevent"]):
            if ctx_data and ctx_data.get("prevention_ta"):
                prev_ta = " ".join(ctx_data["prevention_ta"])
                prev_en = " ".join(ctx_data.get("prevention_en", []))
                return {
                    "response_ta": f"வருமுன் காக்கும் தடுப்பு முறைகள்: {prev_ta}",
                    "response_en": f"Preventative measures: {prev_en}"
                }

        # 6. General Agricultural questions (fertilizer, irrigation, yellow leaves, pests)
        for qa in FARMER_GENERAL_QA_TA:
            if any(kw in question.lower() for kw in qa["keywords"]):
                return {
                    "response_ta": qa["response_ta"],
                    "response_en": qa["response_en"]
                }

        # Default fallback answer
        if ctx_data:
            disease_ta = ctx_data.get("disease_name_ta", "")
            return {
                "response_ta": f"உங்கள் கேள்வி புரிந்தது. கண்டறியப்பட்ட {disease_ta} தொடர்பான சிகிச்சை மற்றும் தடுப்பு முறைகளை பின்பற்றவும். மேலும் உரம் அல்லது பாசனம் பற்றிய விவரங்களுக்கு குறிப்பிட்ட கேள்வியை கேட்கலாம்.",
                "response_en": f"Understood. Follow the recommended management guidelines for {ctx_data.get('disease_name_en', 'your crop')}. You can ask about fertilizers, pest management, or irrigation."
            }
        
        return {
            "response_ta": "வணக்கம்! நீங்கள் உரம் இடுதல், பூச்சி கட்டுப்பாடு, நீர்ப்பாசனம் அல்லது பயிர் நோய்கள் பற்றி கேட்கலாம். மேலும் உங்கள் பயிர் இலையை படம் எடுத்து காட்டினால் உடனடியாக நோய் கண்டறிந்து வழிகாட்டுவேன்.",
            "response_en": "Hello! You can ask questions about fertilization, pest control, irrigation, or crop diseases. You can also upload a leaf photo to diagnose diseases instantly."
        }
