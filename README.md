# 🌾 AgriVoice AI — Smart Agricultural Assistant for Farmers

> **"Farmer shows the leaf → AI detects the disease → Farmer speaks in Tamil → AI provides agricultural guidance in Tamil."**

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.3+-61DAFB.svg?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![PyTorch](https://img.shields.io/badge/PyTorch-2.0+-EE4C2C.svg?logo=pytorch&logoColor=white)](https://pytorch.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 📖 Project Overview

**AgriVoice AI** is an intelligent, full-stack, mobile-first agricultural assistant engineered specifically for farmers who may have limited technical literacy. Combining **deep learning computer vision** with **conversational Tamil voice AI**, AgriVoice AI empowers farmers to diagnose crop diseases directly from foliage photos and receive clear, actionable treatments, organic remedies, and prevention advice in **simple, spoken Tamil**—with zero typing required.

---

## 🚨 Problem Statement

Smallholder farmers in India lose up to **30–40%** of crop yield annually to plant pathogens and misdiagnosed diseases. Key challenges include:
1. **Language & Literacy Barriers:** Most digital farming apps are in complex English or technical vocabulary that rural farmers cannot easily navigate.
2. **Delayed Extension Advice:** Agricultural Extension Officers or Krishi Vigyan Kendra (KVK) centers cannot visit every smallholder farm immediately when an outbreak starts.
3. **Pesticide Overuse & Misapplication:** Lacking precise diagnosis, farmers frequently spray expensive or incorrect chemical pesticides, damaging soil ecology and wasting money.

**AgriVoice AI bridges this gap** by putting a specialized plant pathologist and Tamil-speaking agricultural advisor right into the farmer's pocket.

---

## 🌟 Key Features

### 1. 🍃 Crop Foliage Disease Detection
* **Instant Photo Upload & Mobile Camera Capture:** Snap a leaf photo directly in the field using `facingMode="environment"`.
* **Clinical Diagnostic Cards:** Returns disease name (Tamil + English), scientific pathogen, severity level, and confidence percentage.
* **Granular Agronomic Prescriptions:**
  - **Symptoms:** Physical markers to verify on neighboring leaves.
  - **Causes:** Pathogen origins, weather factors, and humidity conditions.
  - **Treatments & Spray Dosage:** Chemical formulations (e.g. Tricyclazole, Mancozeb) with exact per-liter water dosages.
  - **Organic & Biological Remedies:** Non-chemical solutions (Panchagavya, Neem seed kernel extract, *Pseudomonas fluorescens*).
  - **Preventative Sanitation:** Seed treatment, spacing, and crop rotation guidelines.
* **Instant Quick-Test Presets:** 7 pre-rendered realistic sample crops (Rice Leaf Blast, Rice Brown Spot, Rice Bacterial Blight, Tomato Early Blight, Tomato Late Blight, Tomato Leaf Curl, Healthy Rice) to test immediately without uploading photos.

### 2. 🎙️ Tamil Voice Assistant
* **Large Touch-Friendly Microphone:** Visual pulsing glow and real-time audio wave equalizer while listening.
* **Speech-to-Text (STT):** Transcribes spoken Tamil with high accuracy using browser Web Speech API with fallback transcription.
* **Context-Aware Dialogue:** Remembers the active leaf scan! When a farmer asks *"இதற்கு என்ன மருந்து?"* (*"What medicine for this?"*), the AI resolves *"இதற்கு"* directly to the diagnosed disease.
* **Text-to-Speech (TTS):** Generates natural Tamil audio pronunciation using Google gTTS cached audio streams (`.mp3`).
* **Common Farmer Query Chips:** One-touch question shortcuts for farmers who prefer tapping over speaking.

### 3. 🌐 Seamless Bilingual Experience
* One-click toggle between **Tamil (தமிழ்)** and **English** across all headings, cards, diagnoses, questions, and responses.

### 4. 🗄️ Consultation History & Session Memory
* Stores all previous consultations in a lightweight local **SQLite** database.
* View previous image thumbnails, disease diagnoses, confidence scores, and past farmer Q&A.
* Click any history item to reopen the consultation and continue asking questions.

### 5. 🛡️ Responsible Agricultural AI
* Safe AI advisory disclaimers explicitly displayed.
* Distinguishes healthy leaves from infected leaves to prevent unnecessary pesticide purchases.
* Emphasizes sustainable organic options and consulting local Agricultural Extension Officers for emergency epidemics.

---

## 🏗️ System Architecture

```mermaid
flowchart TD
    subgraph Farmer_Client [Farmer Mobile / Web Frontend]
        A[Camera / Leaf Photo] --> B[Disease Detection UI]
        C[Tamil Microphone Voice] --> D[Tamil Voice Assistant]
        B --> E[Active Context Store]
        E -.-> D
    end

    subgraph Backend_FastAPI [FastAPI Backend Service]
        F[/api/disease/predict] --> G[Image Validation & Preprocessing]
        G --> H{AI Mode}
        H -->|production| I[PyTorch MobileNetV2 CNN]
        H -->|demo| J[Feature Extractor & Vision Heuristics]
        I --> K[Plant Pathology Knowledge Layer]
        J --> K
        K --> L[(SQLite History DB)]
        
        M[/api/assistant/chat] --> N[Context-Aware AgroAdvisor]
        N --> O{LLM Available?}
        O -->|Yes| P[Google Gemini Flash]
        O -->|No / Demo| Q[Tamil AgriExpert Knowledge Engine]
        P --> R[gTTS Tamil Audio Synthesizer]
        Q --> R
        R --> S[/uploads/audio/*.mp3]
    end

    B --> F
    D --> M
```

---

## 📁 Project Directory Structure

```
agrivoice-ai/
├── frontend/                     # React + TypeScript + Tailwind CSS Frontend
│   ├── src/
│   │   ├── components/           # UI Components
│   │   │   ├── Navbar.tsx        # Navigation & language switcher
│   │   │   ├── HeroBanner.tsx    # Mobile-first dashboard hero
│   │   │   ├── ContextCard.tsx   # Active crop & pathogen context indicator
│   │   │   ├── DiseaseDetection.tsx # Camera stream & diagnostic report
│   │   │   ├── TamilVoiceAssistant.tsx # Microphone, chat & TTS player
│   │   │   ├── HistoryView.tsx   # Consultation archives
│   │   │   └── AboutSection.tsx  # Vision, tech stack & safety
│   │   ├── hooks/
│   │   │   └── useTamilVoice.ts  # Web Speech STT & TTS abstraction
│   │   ├── services/
│   │   │   └── api.ts            # Type-safe API client
│   │   ├── types/
│   │   │   └── index.ts          # Core TypeScript interfaces
│   │   ├── utils/
│   │   │   └── translations.ts   # Tamil & English localization dictionary
│   │   ├── App.tsx               # Root application coordinator
│   │   ├── main.tsx              # React DOM entry
│   │   └── index.css             # Tailwind v4 theme & audio waveforms
│   ├── vite.config.ts            # Vite bundler & reverse proxy configuration
│   ├── package.json              # Frontend npm dependencies
│   └── Dockerfile                # Multi-stage production Nginx container
│
├── backend/                      # Python FastAPI Backend
│   ├── api/
│   │   ├── disease.py            # POST /api/disease/predict, /samples, /classes
│   │   ├── assistant.py          # POST /api/assistant/chat
│   │   ├── voice.py              # POST /api/voice/speak, /transcribe
│   │   └── history.py            # GET /api/history, /api/history/{id}
│   ├── database/
│   │   ├── db.py                 # SQLite schema initialization
│   │   └── crud.py               # History persistence and updates
│   ├── ml/
│   │   ├── predictor.py          # DiseasePredictor (demo & PyTorch CNN)
│   │   ├── knowledge_base.py     # 25+ diseases clinical English/Tamil database
│   │   └── sample_images.py      # Synthetic sample leaf generator
│   ├── models/
│   │   └── schemas.py            # Pydantic request/response schemas
│   ├── services/
│   │   ├── agro_advisor.py       # Contextual Tamil/English agricultural Q&A
│   │   └── tts_service.py        # gTTS audio generation & MD5 caching
│   ├── uploads/                  # Uploaded leaf scans & synthesized MP3s
│   ├── main.py                   # FastAPI server entry point
│   └── Dockerfile                # Production backend container
│
├── ml/                           # Standalone Machine Learning Pipeline
│   ├── models/
│   │   └── leaf_cnn.py           # PyTorch MobileNetV2 architecture
│   ├── preprocessing/
│   │   └── transforms.py         # Image resizing & ImageNet normalization
│   ├── training/
│   │   └── train.py              # Model training loop on PlantVillage
│   └── inference/
│       └── predict_standalone.py # Standalone CLI inference tool
│
├── tests/
│   └── test_api.py               # Unit & integration test suite (6 tests)
│
├── .env.example                  # Environment configuration template
├── requirements.txt              # Backend pip dependencies
├── docker-compose.yml            # Multi-container orchestration
└── README.md                     # Comprehensive documentation
```

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, TypeScript, Tailwind CSS v4, Lucide Icons, Vite |
| **Backend** | Python 3.11+, FastAPI, Uvicorn, Pydantic v2 |
| **Computer Vision** | PyTorch, MobileNetV2 CNN, Pillow, NumPy |
| **Voice & Speech** | Web Speech API (`ta-IN`), Google gTTS, HTML5 Audio Player |
| **Language AI** | Context-Aware AgroAdvisor Engine, Optional Google Gemini Flash (`google-genai`) |
| **Database** | SQLite3 (zero-configuration development and edge deployments) |
| **DevOps** | Docker, Docker Compose, Nginx |

---

## 🚀 Getting Started

### Prerequisites
* **Node.js**: v18 or higher (tested on Node v24)
* **Python**: v3.10 or higher (tested on Python 3.13)
* **npm**: v9 or higher

---

### Step 1: Clone & Configure

```bash
git clone https://github.com/your-username/agrivoice-ai.git
cd agrivoice-ai

# Copy environment variables
cp .env.example .env
```

---

### Step 2: Set Up Backend

```bash
# Install Python dependencies
pip install -r requirements.txt

# Run Backend Server (Port 8000)
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```

Backend will be available at:
* API Health: [http://127.0.0.1:8000/api/health](http://127.0.0.1:8000/api/health)
* Interactive Swagger Docs: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

### Step 3: Set Up Frontend

In a separate terminal:

```bash
cd frontend

# Install npm dependencies
npm install

# Start Vite Development Server (Port 5173)
npm run dev
```

Open your browser at: **[http://localhost:5173](http://localhost:5173)**

---

### Step 4: Run Automated Tests

To verify end-to-end functionality across all endpoints:

```bash
python -m unittest tests/test_api.py
```

Expected output:
```text
......
----------------------------------------------------------------------
Ran 6 tests in 5.624s

OK
```

---

## 🐳 Docker Deployment

To launch both frontend and backend in isolated Docker containers:

```bash
docker-compose up --build -d
```

* Frontend: `http://localhost:5173`
* Backend API: `http://localhost:8000`

---

## ⚙️ Environment Configuration

| Variable | Default | Description |
|---|---|---|
| `AI_MODE` | `demo` | Set to `demo` for built-in heuristics, or `production` for PyTorch model inference |
| `PORT` | `8000` | Port for FastAPI backend |
| `HOST` | `0.0.0.0` | Host binding for server |
| `GEMINI_API_KEY` | *(optional)* | Google Gemini API key for dynamic conversational Q&A |
| `CNN_MODEL_PATH` | *(optional)* | Absolute or relative path to PyTorch `.pth` checkpoint |

> **Note on Demo Mode vs. Production Mode:**
> In `AI_MODE=demo`, the system operates completely offline without needing external GPU clusters or paid API keys. It extracts leaf color histograms and necrosis ratios, matches symptoms, and delivers genuine clinical agricultural guidance.

---

## 📡 API Reference

### 1. Leaf Disease Prediction
```http
POST /api/disease/predict
Content-Type: multipart/form-data
```
**Request Form Data:**
- `file`: (Binary image file - JPG/PNG/WebP, max 15MB) *OR*
- `sample_id`: `"rice_leaf_blast"` (Optional sample leaf identifier)

**Response (200 OK):**
```json
{
  "disease_id": "rice_leaf_blast",
  "crop_en": "Rice (Paddy)",
  "crop_ta": "நெல் (பயிர்)",
  "disease_name_en": "Leaf Blast",
  "disease_name_ta": "இலை கருகல் நோய் (பிளாஸ்ட் நோய்)",
  "scientific_name": "Magnaporthe oryzae (Pyricularia oryzae)",
  "is_healthy": false,
  "severity": "high",
  "confidence": 0.942,
  "confidence_percentage": 94.2,
  "symptoms_ta": [
    "இலைகளில் கண் வடிவம் அல்லது கதிர் போன்ற பழுப்பு நிறப் புள்ளிகள் தோன்றும்",
    "புள்ளிகளின் நடுப்பகுதி சாம்பல் நிறமாகவும், விளிம்பு அடர் பழுப்பு நிறமாகவும் மாறும்"
  ],
  "treatments_ta": [
    "டிரைசைக்ளசோல் 75% WP மருந்தை ஒரு லிட்டர் தண்ணீருக்கு 1 கிராம் அல்லது ஐசோபுரோதியோலேன் 1.5 மிலி கலந்து தெளிக்கவும்",
    "உடனடியாக யூரியா உரம் இடுவதை தற்காலிகமாக நிறுத்த வேண்டும்"
  ],
  "organic_remedies_ta": [
    "சூடோமோனாஸ் புளோரசன்ஸ் 10 கிராம் ஒரு லிட்டர் தண்ணீரில் கலந்து தெளிக்கவும்",
    "பயிரின் நோய் எதிர்ப்பு சக்தியை அதிகரிக்க 3% பஞ்சகாவ்யா தெளிக்கவும்"
  ],
  "image_url": "/uploads/images/sample_rice_blast.jpg",
  "history_id": 1
}
```

---

### 2. Conversational Agricultural Assistant
```http
POST /api/assistant/chat
Content-Type: application/json
```
**Request Body:**
```json
{
  "question": "இதற்கு என்ன மருந்து தெளிக்க வேண்டும்?",
  "disease_context": {
    "disease_id": "rice_leaf_blast",
    "disease_name_ta": "இலை கருகல் நோய்",
    "treatments_ta": ["டிரைசைக்ளசோல் 1 கிராம்/லிட்டர் தெளிக்கவும்."]
  },
  "language": "ta",
  "generate_speech": true
}
```

**Response (200 OK):**
```json
{
  "response_ta": "இலை கருகல் நோயைக் கட்டுப்படுத்த உடனடியாக செய்ய வேண்டியவை: டிரைசைக்ளசோல் 75% WP மருந்தை ஒரு லிட்டர் தண்ணீருக்கு 1 கிராம் கலந்து தெளிக்கவும். மாலையில் தெளிப்பது சிறந்த பலன் தரும்.",
  "response_en": "To control Leaf Blast: Spray Tricyclazole 75% WP @ 1g/liter of water. Ensure adequate moisture and spray during late afternoon.",
  "audio_url": "/uploads/audio/tts_3b8a1c92.mp3"
}
```

---

### 3. Speech Audio Synthesis
```http
POST /api/voice/speak
Content-Type: application/json
```
**Request Body:**
```json
{
  "text": "வணக்கம் உழவரே, உங்கள் பயிர் ஆரோக்கியமாக உள்ளது.",
  "language": "ta"
}
```

---

### 4. Consultation History
```http
GET /api/history
GET /api/history/{id}
DELETE /api/history/{id}
```

---

## 🌾 Supported Crops & Diseases

AgriVoice AI includes pre-configured clinical knowledge for major crops:

1. **Rice (நெல்)**:
   - Leaf Blast (*இலை கருகல் நோய் / பிளாஸ்ட்*)
   - Brown Spot (*பழுப்பு புள்ளி நோய்*)
   - Bacterial Leaf Blight (*பாக்டீரியா இலை கருகல்*)
   - Healthy Rice (*ஆரோக்கியமான நெற்பயிர்*)
2. **Tomato (தக்காளி)**:
   - Early Blight (*முன் பருவ கருகல்*)
   - Late Blight (*பின் பருவ கருகல்*)
   - Leaf Curl Virus (*இலை சுருட்டு வைரஸ்*)
   - Healthy Tomato (*ஆரோக்கியமான தக்காளி*)
3. **Potato (உருளைக்கிழங்கு)**:
   - Early Blight & Late Blight (*கருகல் நோய்*)
4. **Corn / Maize (மக்காச்சோளம்)**:
   - Common Rust (*துரு நோய்*)
5. **Cotton (பருத்தி)**:
   - Leaf Curl Virus (*இலை சுருட்டு நோய்*)
6. **Chilli (மிளகாய்)**:
   - Leaf Curl & Thrips Complex (*இலை சுருட்டு & இலைப்பேன்*)
7. **Banana (வாழை)**:
   - Sigatoka Leaf Spot (*சிகாடோகா இலைப்புள்ளி நோய்*)

---

## 🔮 Future Expansion Roadmap

- [ ] **Multi-Dialect Tamil:** Support for Kongu Tamil, Nellai Tamil, and Jaffna Tamil speech models.
- [ ] **Real-time Mandi Market Prices:** Live APMC commodity prices across Tamil Nadu (Erode, Madurai, Tiruchirappalli).
- [ ] **Hyperlocal Weather Alerts:** Integrated IMD rain and humidity warnings for fungicide scheduling.
- [ ] **Soil Testing OCR:** Direct camera analysis of Government Soil Health Cards.
- [ ] **WhatsApp & Telegram Bot Integration:** Voice notes over WhatsApp automatically diagnosed by AgriVoice AI.
- [ ] **Edge ML on Mobile:** Offline ONNX Runtime inference directly inside Android APK.

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
