import React, { useState, useEffect, useRef } from 'react';
import {
  Mic, Volume2, Send, RefreshCw, AlertCircle,
  User, Bot, Square, HelpCircle
} from 'lucide-react';
import type { Language, PredictionResult, ChatMessage } from '../types';
import { useTamilVoice } from '../hooks/useTamilVoice';
import { askAssistant } from '../services/api';
import { getTranslation } from '../utils/translations';

interface TamilVoiceAssistantProps {
  language: Language;
  diseaseContext: PredictionResult | null;
}

export const TamilVoiceAssistant: React.FC<TamilVoiceAssistantProps> = ({
  language,
  diseaseContext
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement | null>(null);

  // Voice Hook
  const {
    isListening,
    isSpeaking,
    transcript,
    setTranscript,
    error: voiceError,
    startListening,
    stopListening,
    playAudio,
    stopAudio,
    isSupported
  } = useTamilVoice({
    language,
    onTranscriptComplete: (text) => handleSend(text)
  });

  // Welcome message initialization
  useEffect(() => {
    if (messages.length === 0) {
      const initialGreeting: ChatMessage = {
        id: 'welcome',
        sender: 'ai',
        text_ta: diseaseContext
          ? `வணக்கம் உழவரே! உங்கள் ${diseaseContext.crop_ta} பயிரில் '${diseaseContext.disease_name_ta}' கண்டறியப்பட்டுள்ளது. "இதற்கு என்ன மருந்து?", "எப்படி கட்டுப்படுத்துவது?" அல்லது உரம், பாசனம் பற்றி நீங்கள் குரலில் கேட்கலாம்.`
          : 'வணக்கம் உழவரே! நான் உங்கள் AgriVoice AI உதவியாளர். உங்கள் பயிர் இலை நோய், உரம், பாசனம், பூச்சி கட்டுப்பாடு பற்றி தமிழில் பேசலாம்.',
        text_en: diseaseContext
          ? `Welcome! For your ${diseaseContext.crop_en} affected by '${diseaseContext.disease_name_en}', you can speak your questions in Tamil or English.`
          : 'Welcome! I am your AgriVoice AI Assistant. Ask any farming questions about crop disease, fertilizers, irrigation, and pest management.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([initialGreeting]);
    }
  }, [diseaseContext]);

  // When speech recognition ends with transcript, automatically submit after slight pause
  const prevListeningRef = useRef(isListening);
  useEffect(() => {
    if (prevListeningRef.current && !isListening && transcript.trim().length > 1) {
      handleSend(transcript.trim());
      setTranscript('');
    }
    prevListeningRef.current = isListening;
  }, [isListening, transcript]);

  // Auto-scroll chat
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isProcessing]);

  // Handle Question Submission
  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputText;
    if (!textToSend.trim() || isProcessing) return;

    // Create user message
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'farmer',
      text_ta: textToSend,
      text_en: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isAudio: Boolean(queryText)
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setTranscript('');
    setIsProcessing(true);

    try {
      const response = await askAssistant(
        textToSend,
        diseaseContext,
        diseaseContext?.history_id,
        language,
        true // Generate speech
      );

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text_ta: response.response_ta,
        text_en: response.response_en,
        audio_url: response.audio_url,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMsg]);

      // Automatically play audio response
      if (response.audio_url) {
        playAudio(response.audio_url, language === 'ta' ? response.response_ta : response.response_en);
      } else {
        playAudio(null, language === 'ta' ? response.response_ta : response.response_en);
      }
    } catch (err: any) {
      const errMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text_ta: 'மன்னிக்கவும், பதிலை தயாரிப்பதில் சிக்கல் ஏற்பட்டது. தயவுசெய்து மீண்டும் கேட்கவும்.',
        text_en: 'Sorry, I could not process your request. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSampleClick = (questionTa: string, questionEn: string) => {
    const q = language === 'ta' ? questionTa : questionEn;
    handleSend(q);
  };

  const sampleQuestions = [
    {
      ta: diseaseContext ? "இந்த நோயை எப்படி கட்டுப்படுத்துவது?" : "இந்த நெற்பயிருக்கு என்ன நோய்?",
      en: diseaseContext ? "How do I control this disease?" : "What disease is on this rice crop?"
    },
    {
      ta: diseaseContext ? "இந்த பயிருக்கு என்ன மருந்து தேவை?" : "என் பயிரில் இலைகள் மஞ்சளாகிறது, ஏன்?",
      en: diseaseContext ? "What spray or medicine is needed?" : "Why are my leaves turning yellow?"
    },
    {
      ta: "நெல்லுக்கு எப்போது உரம் போட வேண்டும்?",
      en: "When should I apply fertilizer to paddy?"
    },
    {
      ta: "இயற்கை முறையில் பூச்சி விரட்டுவது எப்படி?",
      en: "How to control pests organically?"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title Header */}
      <div className="text-center">
        <div className="inline-flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Mic className="w-4 h-4" />
          <span>{language === 'ta' ? 'குரல் வழி வேளாண் உரையாடல்' : 'Voice-Powered Agri Interaction'}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          {getTranslation(language, 'voiceTitle')}
        </h2>
        <p className="text-sm sm:text-base text-agri-muted mt-1 max-w-xl mx-auto">
          {getTranslation(language, 'voiceDesc')}
        </p>
      </div>

      {/* Prominent Microphone Center Stage */}
      <div className="bg-gradient-to-b from-agri-card via-[#131D15] to-agri-card border border-agri-borderBright rounded-3xl p-6 sm:p-8 text-center shadow-2xl relative overflow-hidden">
        {/* Glow halo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-agri-primary/10 rounded-full blur-3xl pointer-events-none" />

        {/* Big Mic Button */}
        <div className="relative inline-block my-2">
          {/* Ripple wave when listening */}
          {isListening && (
            <>
              <div className="absolute inset-0 rounded-full bg-emerald-500/30 animate-ripple" />
              <div className="absolute -inset-4 rounded-full bg-emerald-500/20 animate-ping" />
            </>
          )}

          <button
            onClick={isListening ? stopListening : startListening}
            className={`relative z-10 w-24 h-24 sm:w-28 sm:h-28 rounded-full flex flex-col items-center justify-center transition-all transform active:scale-95 shadow-2xl ${
              isListening
                ? 'bg-gradient-to-tr from-red-600 to-rose-500 text-white shadow-red-500/40 animate-pulse'
                : 'bg-gradient-to-tr from-emerald-600 via-agri-primary to-emerald-400 text-white shadow-agri-primary/40 hover:scale-105'
            }`}
            title={isListening ? getTranslation(language, 'stopSpeaking') : getTranslation(language, 'clickToSpeak')}
          >
            {isListening ? (
              <>
                <Square className="w-9 h-9 fill-current" />
                <span className="text-[10px] font-black uppercase mt-1 tracking-wider">
                  {language === 'ta' ? 'நிறுத்து' : 'Stop'}
                </span>
              </>
            ) : (
              <>
                <Mic className="w-10 h-10" />
                <span className="text-[10px] font-black uppercase mt-1 tracking-wider">
                  {language === 'ta' ? 'பேசு' : 'Speak'}
                </span>
              </>
            )}
          </button>
        </div>

        {/* Status Text & Audio Visualizer */}
        <div className="mt-4 min-h-[44px] flex flex-col items-center justify-center">
          {isListening ? (
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-2 text-rose-400 font-bold text-sm sm:text-base animate-pulse">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                <span>{getTranslation(language, 'listening')}</span>
              </div>
              {/* Equalizer Wave simulation */}
              <div className="flex items-center justify-center space-x-1 h-6">
                {[40, 70, 100, 60, 90, 50, 80, 45, 95, 60].map((h, i) => (
                  <span
                    key={i}
                    style={{ height: `${h}%`, animationDelay: `${i * 0.1}s` }}
                    className="w-1 bg-emerald-400 rounded-full animate-wave"
                  />
                ))}
              </div>
            </div>
          ) : isProcessing ? (
            <div className="inline-flex items-center space-x-2 text-amber-400 font-bold text-sm">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>{getTranslation(language, 'processingVoice')}</span>
            </div>
          ) : isSpeaking ? (
            <div className="inline-flex items-center space-x-2 text-emerald-400 font-bold text-sm">
              <Volume2 className="w-4 h-4 animate-bounce" />
              <span>{language === 'ta' ? 'பதில் ஒலிக்கிறது...' : 'Speaking answer...'}</span>
              <button
                onClick={stopAudio}
                className="ml-2 text-xs bg-agri-dark px-2 py-0.5 rounded border border-agri-border hover:text-white"
              >
                {getTranslation(language, 'pauseAudio')}
              </button>
            </div>
          ) : (
            <p className="text-xs sm:text-sm text-gray-300 font-medium">
              {getTranslation(language, 'clickToSpeak')}
            </p>
          )}

          {/* Real-time speech transcription preview */}
          {transcript && (
            <div className="mt-2 text-sm text-agri-lightGreen font-semibold italic max-w-lg bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-800/40">
              “{transcript}”
            </div>
          )}
        </div>

        {/* Error notification */}
        {voiceError && (
          <div className="mt-4 p-3 bg-red-950/60 border border-red-800/50 rounded-xl text-xs sm:text-sm text-red-300 flex items-center justify-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{voiceError}</span>
          </div>
        )}

        {/* Suggested Questions Quick Chips */}
        <div className="mt-6 pt-5 border-t border-agri-border/60">
          <p className="text-xs font-bold text-agri-muted uppercase tracking-wider mb-2.5">
            {getTranslation(language, 'suggestedQuestions')}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {sampleQuestions.map((sq, idx) => (
              <button
                key={idx}
                onClick={() => handleSampleClick(sq.ta, sq.en)}
                className="px-3.5 py-2 rounded-xl bg-agri-dark/80 hover:bg-agri-cardHover border border-agri-border hover:border-agri-primary/50 text-xs text-gray-200 hover:text-white font-medium transition-all shadow-sm flex items-center space-x-1.5 active:scale-95"
              >
                <HelpCircle className="w-3.5 h-3.5 text-agri-primary" />
                <span>{language === 'ta' ? sq.ta : sq.en}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Conversation Chat Stream */}
      <div className="bg-agri-card border border-agri-border rounded-3xl p-4 sm:p-6 shadow-xl space-y-4">
        <div
          ref={chatScrollRef}
          className="space-y-4 max-h-[380px] overflow-y-auto pr-1"
        >
          {messages.map((msg) => {
            const isFarmer = msg.sender === 'farmer';
            const displayText = language === 'ta' ? msg.text_ta : msg.text_en;

            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${
                  isFarmer ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 shadow ${
                    isFarmer
                      ? 'bg-amber-600/30 text-amber-400 border border-amber-600/50'
                      : 'bg-emerald-600/30 text-emerald-400 border border-emerald-600/50'
                  }`}
                >
                  {isFarmer ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>

                {/* Message Bubble */}
                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-md ${
                    isFarmer
                      ? 'bg-emerald-950/70 border border-emerald-800/60 text-white rounded-tr-none'
                      : 'bg-[#151F17] border border-agri-borderBright text-gray-100 rounded-tl-none'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 mb-1 text-[11px] text-agri-muted">
                    <span className="font-bold">
                      {isFarmer
                        ? language === 'ta'
                          ? 'விவசாயி'
                          : 'Farmer'
                        : language === 'ta'
                        ? 'AgriVoice AI ஆலோசகர்'
                        : 'AgriVoice AI Advisor'}
                    </span>
                    <span>{msg.timestamp}</span>
                  </div>

                  {/* Message Text */}
                  <p className="whitespace-pre-wrap">{displayText}</p>

                  {/* Play Tamil Audio Button on AI response */}
                  {!isFarmer && (
                    <div className="mt-3 pt-2.5 border-t border-agri-border/50 flex items-center justify-between gap-2">
                      <button
                        onClick={() => playAudio(msg.audio_url, displayText)}
                        className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800/40 text-emerald-300 text-xs font-semibold transition-colors"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>{getTranslation(language, 'listenAudio')}</span>
                      </button>

                      {msg.audio_url && (
                        <span className="text-[10px] text-agri-muted">
                          HQ Tamil Voice
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isProcessing && (
            <div className="flex items-center space-x-3 text-agri-muted text-xs p-3">
              <Bot className="w-5 h-5 text-emerald-400 animate-spin" />
              <span>{getTranslation(language, 'processingVoice')}</span>
            </div>
          )}
        </div>

        {/* Text Input Fallback Bar */}
        <div className="pt-3 border-t border-agri-border flex items-center space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={getTranslation(language, 'speakPlaceholder')}
            className="flex-1 bg-agri-dark border border-agri-border focus:border-agri-primary rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 outline-none transition-colors"
          />

          <button
            onClick={() => handleSend()}
            disabled={!inputText.trim() || isProcessing}
            className={`p-2.5 sm:px-4 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center space-x-1.5 transition-all ${
              !inputText.trim() || isProcessing
                ? 'bg-agri-border/40 text-gray-500 cursor-not-allowed'
                : 'bg-agri-primary hover:bg-agri-primaryHover text-white shadow'
            }`}
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">{getTranslation(language, 'send')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
