export type DiseaseResult = {
  crop: string;
  disease: string;
  confidence: number;
  symptoms: string[];
  causes: string[];
  prevention: string[];
  recommendations: string[];
};

const apiKey = () => process.env.AI_API_KEY || process.env.OPENAI_API_KEY;
const baseUrl = () => (process.env.AI_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "");

async function aiRequest(path: string, init: RequestInit) {
  const key = apiKey();
  if (!key) throw new Error("AI provider is not configured");
  const response = await fetch(`${baseUrl()}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${key}`, ...(init.headers || {}) },
  });
  if (!response.ok) {
    const detail = await response.text();
    console.error("AI provider error", response.status, detail.slice(0, 300));
    throw new Error("The AI provider could not complete this request");
  }
  return response;
}

function parseJsonObject(text: string) {
  const cleaned = text.replace(/^```json\s*/i, "").replace(/```$/i, "").trim();
  return JSON.parse(cleaned);
}

export async function detectDisease(file: Express.Multer.File): Promise<DiseaseResult> {
  if (!apiKey()) return demoDisease();
  const prompt = `You are a crop disease vision model for Indian farmers. Analyze this leaf image. Return only valid JSON with: crop (string), disease (string), confidence (integer 0-100), symptoms (string[]), causes (string[]), prevention (string[]), recommendations (string[]). Be conservative and say "Uncertain" when visual evidence is weak. Keep advice practical and never prescribe restricted pesticides.`;
  const response = await aiRequest("/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: process.env.VISION_MODEL || "gpt-4o-mini",
      temperature: 0.1,
      messages: [{ role: "user", content: [{ type: "text", text: prompt }, { type: "image_url", image_url: { url: `data:${file.mimetype};base64,${file.buffer.toString("base64")}` } }] }],
    }),
  });
  const body = await response.json() as { choices?: { message?: { content?: string } }[] };
  const result = parseJsonObject(body.choices?.[0]?.message?.content || "");
  return {
    crop: String(result.crop || "Unknown crop").slice(0, 80),
    disease: String(result.disease || "Uncertain").slice(0, 120),
    confidence: Math.max(0, Math.min(100, Number(result.confidence) || 0)),
    symptoms: cleanList(result.symptoms),
    causes: cleanList(result.causes),
    prevention: cleanList(result.prevention),
    recommendations: cleanList(result.recommendations),
  };
}

export async function transcribeAudio(file: Express.Multer.File) {
  if (!apiKey()) return "இந்த இலை நோய்க்கு என்ன செய்ய வேண்டும்?";
  const form = new FormData();
  form.append("file", new Blob([Uint8Array.from(file.buffer)], { type: file.mimetype }), file.originalname);
  form.append("model", process.env.STT_MODEL || "whisper-1");
  form.append("language", "ta");
  const response = await aiRequest("/audio/transcriptions", { method: "POST", body: form });
  const body = await response.json() as { text?: string };
  return body.text?.trim() || "";
}

export async function answerQuestion(question: string, context?: DiseaseResult | null) {
  if (!apiKey()) return "பாதிக்கப்பட்ட இலைகளை தனியாக அகற்றி அழிக்கவும். செடிக்கு அதிகமாக தண்ணீர் தேங்காமல் பார்த்துக்கொள்ளுங்கள். நோய் பரவல் அதிகமாக இருந்தால், அருகிலுள்ள வேளாண் அலுவலரிடம் ஆலோசித்து சரியான சிகிச்சையைத் தேர்வு செய்யுங்கள்.";
  const contextText = context ? `Latest image result: Crop ${context.crop}; possible disease ${context.disease}; confidence ${context.confidence}%.` : "No image result is available.";
  const response = await aiRequest("/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: process.env.CHAT_MODEL || "gpt-4o-mini",
      temperature: 0.3,
      messages: [
        { role: "system", content: `You are AgriVoice, a careful agricultural assistant for Tamil Nadu farmers. Reply in simple, respectful Tamil, using short sentences and practical steps. Do not invent certainty, dangerous dosages, or claim to replace an agricultural officer. ${contextText}` },
        { role: "user", content: question },
      ],
    }),
  });
  const body = await response.json() as { choices?: { message?: { content?: string } }[] };
  return body.choices?.[0]?.message?.content?.trim() || "மன்னிக்கவும், பதில் கிடைக்கவில்லை.";
}

export async function synthesizeSpeech(text: string) {
  if (!apiKey()) return null;
  const response = await aiRequest("/audio/speech", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: process.env.TTS_MODEL || "gpt-4o-mini-tts", voice: process.env.TTS_VOICE || "alloy", input: text, response_format: "mp3" }),
  });
  return Buffer.from(await response.arrayBuffer());
}

function cleanList(value: unknown) {
  return Array.isArray(value) ? value.slice(0, 6).map((item) => String(item).slice(0, 240)) : [];
}

function demoDisease(): DiseaseResult {
  return {
    crop: "Tomato",
    disease: "Early Blight (demo result)",
    confidence: 91,
    symptoms: ["Brown circular spots with concentric rings", "Yellowing around affected areas", "Older leaves affected first"],
    causes: ["Fungal infection caused by Alternaria solani", "Warm, humid conditions and wet foliage"],
    prevention: ["Rotate crops for at least two seasons", "Water near the soil and keep leaves dry", "Allow airflow between plants"],
    recommendations: ["Remove and safely dispose of affected leaves", "Clean tools after handling infected plants", "Confirm treatment with a local agricultural officer"],
  };
}
