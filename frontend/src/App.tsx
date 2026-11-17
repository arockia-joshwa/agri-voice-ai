import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { ContextCard } from './components/ContextCard';
import { DiseaseDetection } from './components/DiseaseDetection';
import { TamilVoiceAssistant } from './components/TamilVoiceAssistant';
import { HistoryView } from './components/HistoryView';
import { AboutSection } from './components/AboutSection';
import type { Language, ActiveTab, PredictionResult } from './types';
import { getTranslation } from './utils/translations';
import { Camera, Mic, Sprout, ArrowRight, Heart } from 'lucide-react';

export function App() {
  const [language, setLanguage] = useState<Language>('ta');
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [activeContext, setActiveContext] = useState<PredictionResult | null>(null);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'ta' ? 'en' : 'ta'));
  };

  const handlePredictionComplete = (result: PredictionResult) => {
    setActiveContext(result);
  };

  const handleAskVoiceAboutPrediction = (result: PredictionResult) => {
    setActiveContext(result);
    setActiveTab('voice');
  };

  const handleSelectHistoryRecord = (record: PredictionResult) => {
    setActiveContext(record);
    setActiveTab('voice');
  };

  return (
    <div className="min-h-screen bg-agri-dark text-gray-100 flex flex-col selection:bg-agri-primary selection:text-white">
      {/* Top Navigation */}
      <Navbar
        language={language}
        onLanguageToggle={toggleLanguage}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        hasActiveContext={Boolean(activeContext)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Active Session Crop Disease Context Card */}
        {activeContext && activeTab !== 'dashboard' && (
          <ContextCard
            context={activeContext}
            language={language}
            onClear={() => setActiveContext(null)}
            onAskVoice={() => setActiveTab('voice')}
          />
        )}

        {/* Tab 1: Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fade-in">
            {/* Hero Section */}
            <HeroBanner
              language={language}
              onDetectClick={() => setActiveTab('detect')}
              onVoiceClick={() => setActiveTab('voice')}
            />

            {/* Context Card if scan is active */}
            {activeContext && (
              <div>
                <h3 className="text-sm font-bold text-agri-lightGreen uppercase tracking-wider mb-2">
                  {language === 'ta' ? 'தற்போது ஸ்கேன் செய்யப்பட்ட பயிர்' : 'Current Active Crop Scan'}
                </h3>
                <ContextCard
                  context={activeContext}
                  language={language}
                  onClear={() => setActiveContext(null)}
                  onAskVoice={() => setActiveTab('voice')}
                />
              </div>
            )}

            {/* Two Main Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card 1: Detect Crop Disease */}
              <div
                onClick={() => setActiveTab('detect')}
                className="group bg-gradient-to-br from-agri-card via-[#141F16] to-agri-card hover:to-[#17251A] border border-agri-border hover:border-agri-primary/60 rounded-3xl p-6 sm:p-8 cursor-pointer shadow-xl transition-all transform hover:-translate-y-1 relative overflow-hidden flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-950 border border-agri-primary/30 flex items-center justify-center text-agri-primary group-hover:scale-110 transition-transform shadow-md">
                    <Camera className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-white">
                      {getTranslation(language, 'btnDetect')}
                    </h3>
                    <p className="text-xs sm:text-sm text-agri-muted mt-2 leading-relaxed">
                      {language === 'ta'
                        ? 'பயிர் இலையை கேமரா மூலம் படம் பிடியுங்கள் அல்லது பதிவேற்றுங்கள். AI அதன் நோய் மற்றும் சிகிச்சை முறைகளை உடனே சொல்லும்.'
                        : 'Upload or snap a leaf photo. Deep learning computer vision identifies fungal, bacterial, and pest symptoms in seconds.'}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-agri-border/60 flex items-center justify-between text-xs sm:text-sm font-bold text-agri-primary group-hover:text-agri-lightGreen">
                  <span>{language === 'ta' ? 'இலையை சோதிக்க கிளிக் செய்' : 'Start Leaf Diagnosis'}</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Card 2: Tamil Voice Assistant */}
              <div
                onClick={() => setActiveTab('voice')}
                className="group bg-gradient-to-br from-agri-card via-[#142217] to-agri-card hover:to-[#17281B] border border-agri-border hover:border-emerald-500/60 rounded-3xl p-6 sm:p-8 cursor-pointer shadow-xl transition-all transform hover:-translate-y-1 relative overflow-hidden flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-950 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform shadow-md">
                    <Mic className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-white">
                      {getTranslation(language, 'btnVoice')}
                    </h3>
                    <p className="text-xs sm:text-sm text-agri-muted mt-2 leading-relaxed">
                      {language === 'ta'
                        ? 'மைக் பொத்தானை அழுத்தி நேரடியாக தமிழில் கேள்வி கேளுங்கள். மருந்து, உரம், நீர் மேலாண்மை பற்றி எளிய தமிழில் பதில் கேளுங்கள்.'
                        : 'Ask your agricultural questions in Tamil using speech recognition and listen to farmer-friendly spoken guidance.'}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-agri-border/60 flex items-center justify-between text-xs sm:text-sm font-bold text-emerald-400 group-hover:text-emerald-300">
                  <span>{language === 'ta' ? 'குரலில் பேச கிளிக் செய்' : 'Open Tamil Voice AI'}</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

            {/* Quick Workflow Stepper */}
            <div className="bg-agri-card/60 border border-agri-border rounded-3xl p-6 sm:p-8">
              <h3 className="text-xs font-bold text-agri-lightGreen uppercase tracking-wider mb-5">
                {language === 'ta' ? 'எளிய 4 படிநிலை செயல்முறை' : 'Simple 4-Step Farmer Journey'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-agri-dark/60 border border-agri-border/50 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-agri-primary/20 text-agri-primary font-black flex items-center justify-center text-sm">
                    1
                  </div>
                  <h4 className="font-bold text-white text-sm">
                    {language === 'ta' ? 'இலை படம் எடு' : 'Show Leaf'}
                  </h4>
                  <p className="text-xs text-agri-muted">
                    {language === 'ta' ? 'பாதிக்கப்பட்ட இலையை கேமராவில் காட்டுங்கள்' : 'Upload or snap a photo of the affected leaf'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-agri-dark/60 border border-agri-border/50 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-agri-primary/20 text-agri-primary font-black flex items-center justify-center text-sm">
                    2
                  </div>
                  <h4 className="font-bold text-white text-sm">
                    {language === 'ta' ? 'AI நோய் அறியும்' : 'AI Diagnosis'}
                  </h4>
                  <p className="text-xs text-agri-muted">
                    {language === 'ta' ? 'கணினி பார்வை துல்லியமாக நோயை கண்டறியும்' : 'CNN vision model classifies disease and confidence'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-agri-dark/60 border border-agri-border/50 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-agri-primary/20 text-agri-primary font-black flex items-center justify-center text-sm">
                    3
                  </div>
                  <h4 className="font-bold text-white text-sm">
                    {language === 'ta' ? 'தமிழில் பேசு' : 'Speak in Tamil'}
                  </h4>
                  <p className="text-xs text-agri-muted">
                    {language === 'ta' ? '“இதற்கு என்ன மருந்து?” என நேரடியாக பேசுங்கள்' : 'Ask questions naturally in Tamil via mic'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-agri-dark/60 border border-agri-border/50 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-agri-primary/20 text-agri-primary font-black flex items-center justify-center text-sm">
                    4
                  </div>
                  <h4 className="font-bold text-white text-sm">
                    {language === 'ta' ? 'குரலில் வழிகாட்டல்' : 'Voice Advice'}
                  </h4>
                  <p className="text-xs text-agri-muted">
                    {language === 'ta' ? 'மருந்து அளவு & இயற்கை வழி ஆடியோவாக கேளுங்கள்' : 'Listen to actionable agricultural answers'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Disease Detection */}
        {activeTab === 'detect' && (
          <DiseaseDetection
            language={language}
            onPredictionComplete={handlePredictionComplete}
            onAskVoice={handleAskVoiceAboutPrediction}
            initialPrediction={activeContext}
          />
        )}

        {/* Tab 3: Tamil Voice Assistant */}
        {activeTab === 'voice' && (
          <TamilVoiceAssistant
            language={language}
            diseaseContext={activeContext}
          />
        )}

        {/* Tab 4: History */}
        {activeTab === 'history' && (
          <HistoryView
            language={language}
            onSelectRecord={handleSelectHistoryRecord}
          />
        )}

        {/* Tab 5: About */}
        {activeTab === 'about' && (
          <AboutSection language={language} />
        )}
      </main>

      {/* Modern Footer */}
      <footer className="mt-16 border-t border-agri-border bg-agri-dark/95 py-8 text-xs text-agri-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Sprout className="w-5 h-5 text-agri-primary" />
            <span className="font-bold text-white text-sm">AgriVoice AI</span>
            <span>—</span>
            <span>{language === 'ta' ? 'விவசாயிகளுக்கான நவீன AI உதவியாளர்' : 'Smart AI Assistant for Farmers'}</span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="inline-flex items-center space-x-1">
              <span>Built with</span>
              <Heart className="w-3.5 h-3.5 text-red-500 fill-current" />
              <span>for Farmers</span>
            </span>
            <span>•</span>
            <span>MobileNetV2 CNN & Tamil Voice AI</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
