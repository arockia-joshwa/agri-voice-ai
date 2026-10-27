import React from 'react';
import { Camera, Mic, Sparkles, Shield, Cpu } from 'lucide-react';
import type { Language } from '../types';
import { getTranslation } from '../utils/translations';

interface HeroBannerProps {
  language: Language;
  onDetectClick: () => void;
  onVoiceClick: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  language,
  onDetectClick,
  onVoiceClick
}) => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#111A13] via-[#0E150F] to-[#0A0E0B] border border-agri-borderBright/70 p-6 sm:p-10 lg:p-12 shadow-2xl mb-8">
      {/* Background visual accents */}
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-agri-primary/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Top Feature Pill */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-950/70 border border-agri-primary/40 text-agri-lightGreen text-xs sm:text-sm font-semibold mb-6 shadow-sm">
          <Sparkles className="w-4 h-4 text-agri-primary animate-pulse" />
          <span>
            {language === 'ta'
              ? 'கணினி பார்வை (CNN) + தமிழ் குரல் AI'
              : 'Computer Vision (CNN) + Tamil Voice AI'}
          </span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
          AgriVoice <span className="bg-gradient-to-r from-agri-lightGreen via-emerald-400 to-teal-300 bg-clip-text text-transparent">AI</span>
        </h1>

        <p className="mt-3 text-lg sm:text-2xl font-bold text-gray-200">
          {getTranslation(language, 'heroSubtitle')}
        </p>

        {/* Subtext */}
        <p className="mt-4 text-sm sm:text-lg text-agri-muted max-w-2xl mx-auto leading-relaxed">
          “{getTranslation(language, 'heroDesc')}”
        </p>

        {/* Primary Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          <button
            onClick={onDetectClick}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-3 px-7 py-4 bg-gradient-to-r from-emerald-600 to-agri-primary hover:from-emerald-500 hover:to-agri-primaryHover text-white text-base sm:text-lg font-bold rounded-2xl shadow-xl shadow-agri-primary/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Camera className="w-6 h-6 text-white" />
            <span>{getTranslation(language, 'btnDetect')}</span>
          </button>

          <button
            onClick={onVoiceClick}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-3 px-7 py-4 bg-agri-card border-2 border-agri-primary/50 hover:border-agri-primary hover:bg-agri-cardHover text-white text-base sm:text-lg font-bold rounded-2xl shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <Mic className="w-5 h-5 text-emerald-400" />
            </div>
            <span>{getTranslation(language, 'btnVoice')}</span>
          </button>
        </div>

        {/* Feature Badges Grid */}
        <div className="mt-10 pt-8 border-t border-agri-border/60 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
          <div className="p-3 rounded-xl bg-agri-card/60 border border-agri-border/50 flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-950 flex items-center justify-center flex-shrink-0">
              <Camera className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Leaf Vision</p>
              <p className="text-[11px] text-agri-muted">38+ Plant Classes</p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-agri-card/60 border border-agri-border/50 flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-950 flex items-center justify-center flex-shrink-0">
              <Mic className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Tamil Speech</p>
              <p className="text-[11px] text-agri-muted">STT + TTS Engine</p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-agri-card/60 border border-agri-border/50 flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-950 flex items-center justify-center flex-shrink-0">
              <Cpu className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">AgroAI Brain</p>
              <p className="text-[11px] text-agri-muted">Context-Aware Q&A</p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-agri-card/60 border border-agri-border/50 flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-950 flex items-center justify-center flex-shrink-0">
              <Shield className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Safe Advisory</p>
              <p className="text-[11px] text-agri-muted">Organic + Clinical</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
