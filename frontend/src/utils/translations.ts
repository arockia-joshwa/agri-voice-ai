import type { Language } from '../types';

export const translations = {
  ta: {
    appName: "AgriVoice AI",
    tagline: "விவசாயிகளுக்கான நவீன AI உதவியாளர்",
    heroTitle: "AgriVoice AI",
    heroSubtitle: "உங்கள் மொழியில் இயங்கும் விவசாய செயற்கை நுண்ணறிவு உதவியாளர்",
    heroDesc: "பயிர் இலையைக் காட்டுங்கள். தமிழில் பேசுங்கள். உடனடி வேளாண் ஆலோசனையைப் பெறுங்கள்.",
    btnDetect: "பயிர் நோய் கண்டறிதல்",
    btnVoice: "தமிழில் கேளுங்கள்",
    
    // Nav
    navDashboard: "முகப்பு",
    navDetect: "நோய் கண்டறிதல்",
    navVoice: "தமிழ் குரல் உதவியாளர்",
    navHistory: "முந்தைய பதிவுகள்",
    navAbout: "எங்களைப் பற்றி",
    
    // Context Card
    activeContextTitle: "தற்போதைய பயிர் நிலை",
    currentCrop: "பயிர்",
    detectedDisease: "கண்டறியப்பட்ட நோய்",
    confidence: "துல்லியம்",
    clearContext: "அகற்று",
    noActiveContext: "பயிர் இலை இன்னும் ஸ்கேன் செய்யப்படவில்லை. இலையை பதிவேற்றவும்.",
    
    // Detection
    dropImageHere: "இலை புகைப்படத்தை இங்கே இழுத்து விடவும் அல்லது தேர்ந்தெடுக்கவும்",
    browseFiles: "புகைப்படத்தை தேர்வு செய்",
    takePhoto: "கேமரா மூலம் படம் எடு",
    closeCamera: "கேமராவை மூடு",
    capturePhoto: "புகைப்படம் எடு",
    analyzeButton: "AI மூலம் நோயைக் கண்டறி",
    analyzing: "இலை ஆய்வு செய்யப்படுகிறது...",
    sampleLeavesTitle: "மாதிரி இலைகள் மூலம் உடனடியாக சோதிக்க:",
    healthyStatus: "ஆரோக்கியமான பயிர்",
    diseasedStatus: "நோய் தாக்கப்பட்ட பயிர்",
    severity: "தீவிரம்",
    scientificName: "அறிவியல் பெயர்",
    symptoms: "நோயின் அறிகுறிகள்",
    causes: "நோய் உருவாவதற்கான காரணங்கள்",
    treatments: "பரிந்துரைக்கப்படும் சிகிச்சை & மருந்து அளவு",
    organicRemedies: "இயற்கை மற்றும் நாட்டுப்புற தீர்வுகள்",
    preventionTips: "வருமுன் காக்கும் தடுப்பு முறைகள்",
    expertDisclaimer: "கவனத்திற்கு: இது AI தொழில்நுட்ப அடிப்படையிலான வழிகாட்டல் மட்டுமே. தீவிர பாதிப்புகளுக்கு உங்கள் வட்டார வேளாண்மை அலுவலரை அல்லது வேளாண் அறிவியல் மையத்தை அணுகவும்.",
    askVoiceAboutThis: "இந்த நோயைப் பற்றி தமிழில் குரலில் கேட்க",
    
    // Voice Assistant
    voiceTitle: "தமிழ் குரல் உதவியாளர்",
    voiceDesc: "மைக் பொத்தானை அழுத்தி உங்கள் சந்தேகத்தை தமிழில் நேரடியாக பேசுங்கள்.",
    listening: "உங்கள் குரலைக் கேட்கிறது... பேசுங்கள்",
    processingVoice: "பதில் தயாராகிறது...",
    clickToSpeak: "பேச அழுத்தவும்",
    stopSpeaking: "பேசி முடித்தேன்",
    suggestedQuestions: "விவசாயிகளின் பொதுவான கேள்விகள்:",
    listenAudio: "ஆடியோ கேட்க",
    pauseAudio: "நிறுத்து",
    speakPlaceholder: "அல்லது உங்கள் கேள்வியை இங்கே தட்டச்சு செய்யவும்...",
    send: "அனுப்பு",
    voiceNotSupported: "உங்கள் உலாவியில் நேரடி குரல் அறிதல் ஆதரிக்கப்படவில்லை. கீழே உள்ள பரிந்துரைக்கப்பட்ட கேள்விகளை பயன்படுத்தலாம்.",
    
    // Sample questions
    sampleQ1: "இந்த நெற்பயிருக்கு என்ன நோய்?",
    sampleQ2: "இந்த நோயை எப்படி கட்டுப்படுத்துவது?",
    sampleQ3: "நெல்லுக்கு எப்போது உரம் போட வேண்டும்?",
    sampleQ4: "இந்த பயிருக்கு என்ன மருந்து தேவை?",
    sampleQ5: "என் பயிரில் இலைகள் மஞ்சளாகிறது, ஏன்?",
    sampleQ6: "இயற்கை முறையில் பூச்சி விரட்டுவது எப்படி?",
    
    // History
    historyTitle: "முந்தைய வேளாண் ஆலோசனைகள்",
    historyEmpty: "இன்னும் முந்தைய பதிவுகள் எதுவும் இல்லை. ஒரு இலை புகைப்படத்தை ஆய்வு செய்யவும்.",
    loadIntoContext: "மீண்டும் பார் / கேள்வி கேள்",
    deleteRecord: "நீக்கு",
    
    // Common
    healthy: "ஆரோக்கியம்",
    high: "அதிதீவிரம்",
    moderate: "நடுத்தரம்",
    low: "குறைவு",
    retry: "மீண்டும் முயற்சி",
    errorLoading: "ஏற்றுவதில் பிழை ஏற்பட்டது. தயவுசெய்து மீண்டும் முயற்சிக்கவும்."
  },
  en: {
    appName: "AgriVoice AI",
    tagline: "Smart AI Assistant for Farmers",
    heroTitle: "AgriVoice AI",
    heroSubtitle: "AI-powered agricultural assistance in your language",
    heroDesc: "Show your crop. Speak your question. Get AI-powered agricultural guidance.",
    btnDetect: "Detect Crop Disease",
    btnVoice: "Ask in Tamil",
    
    // Nav
    navDashboard: "Dashboard",
    navDetect: "Disease Detection",
    navVoice: "Tamil Voice Assistant",
    navHistory: "History",
    navAbout: "About",
    
    // Context Card
    activeContextTitle: "Active Crop Context",
    currentCrop: "Current Crop",
    detectedDisease: "Detected Disease",
    confidence: "Confidence",
    clearContext: "Clear Context",
    noActiveContext: "No crop leaf scanned yet. Upload an image to start.",
    
    // Detection
    dropImageHere: "Drag & drop a crop leaf image here, or browse",
    browseFiles: "Browse Files",
    takePhoto: "Open Camera",
    closeCamera: "Close Camera",
    capturePhoto: "Capture Photo",
    analyzeButton: "Analyze with AI Vision",
    analyzing: "Analyzing leaf patterns...",
    sampleLeavesTitle: "Or test instantly with sample crop leaves:",
    healthyStatus: "Healthy Crop",
    diseasedStatus: "Disease Detected",
    severity: "Severity",
    scientificName: "Scientific Name",
    symptoms: "Symptoms",
    causes: "Possible Causes",
    treatments: "Recommended Treatments & Dosage",
    organicRemedies: "Organic & Biological Remedies",
    preventionTips: "Preventative Measures",
    expertDisclaimer: "Notice: AI-assisted guidance for farmer decision support. For severe outbreaks, verify with local Agricultural Extension Officer or KVK center.",
    askVoiceAboutThis: "Ask Tamil Voice Assistant About This",
    
    // Voice Assistant
    voiceTitle: "Tamil Voice Assistant",
    voiceDesc: "Tap the microphone and ask your farming questions naturally in Tamil.",
    listening: "Listening to your voice... Speak now",
    processingVoice: "Consulting AgroAI...",
    clickToSpeak: "Tap to Speak (Tamil)",
    stopSpeaking: "Done Speaking",
    suggestedQuestions: "Common Farmer Inquiries:",
    listenAudio: "Play Audio",
    pauseAudio: "Stop Audio",
    speakPlaceholder: "Or type your question here...",
    send: "Send",
    voiceNotSupported: "Browser voice recognition is not supported on this browser. You can click sample questions or type.",
    
    // Sample questions
    sampleQ1: "What disease is on this crop?",
    sampleQ2: "How do I control this disease?",
    sampleQ3: "When should I apply fertilizer to rice?",
    sampleQ4: "What medicine or spray is needed?",
    sampleQ5: "Why are my crop leaves turning yellow?",
    sampleQ6: "How do I control pests organically?",
    
    // History
    historyTitle: "Consultation History",
    historyEmpty: "No consultations saved yet. Analyze a leaf to start building history.",
    loadIntoContext: "Open Analysis & Ask",
    deleteRecord: "Delete",
    
    // Common
    healthy: "Healthy",
    high: "High",
    moderate: "Moderate",
    low: "Low",
    retry: "Retry",
    errorLoading: "An error occurred. Please try again."
  }
};

export function getTranslation(lang: Language, key: keyof typeof translations['en']): string {
  return translations[lang]?.[key] || translations['en'][key] || key;
}
