import React from 'react';
import { Leaf, AlertCircle, CheckCircle2, X, Mic, ArrowRight } from 'lucide-react';
import type { PredictionResult, Language } from '../types';
import { getTranslation } from '../utils/translations';

interface ContextCardProps {
  context: PredictionResult | null;
  language: Language;
  onClear: () => void;
  onAskVoice: () => void;
}

export const ContextCard: React.FC<ContextCardProps> = ({
  context,
  language,
  onClear,
  onAskVoice,
}) => {
  if (!context) return null;

  const cropName = language === 'ta' ? context.crop_ta : context.crop_en;
  const diseaseName = language === 'ta' ? context.disease_name_ta : context.disease_name_en;

  return (
    <div className="bg-gradient-to-r from-agri-card via-[#142016] to-agri-card border border-agri-borderBright rounded-2xl p-4 sm:p-5 shadow-xl relative overflow-hidden my-4 transition-all">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-agri-primary/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Left: Leaf thumbnail & Diagnosis Details */}
        <div className="flex items-center space-x-3.5">
          {context.image_url ? (
            <img
              src={context.image_url}
              alt="Leaf"
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover border-2 border-agri-borderBright shadow-md flex-shrink-0"
            />
          ) : (
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-agri-primary/20 border border-agri-primary/30 flex items-center justify-center flex-shrink-0">
              <Leaf className="w-7 h-7 text-agri-primary" />
            </div>
          )}

          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-agri-lightGreen bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/40">
                {getTranslation(language, 'activeContextTitle')}
              </span>
              <span className="text-xs text-agri-muted">
                {context.ai_mode === 'demo' ? '• Demo Model' : '• Production CNN'}
              </span>
            </div>

            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mt-1">
              <h4 className="text-base sm:text-lg font-bold text-white flex items-center gap-1.5">
                <span>{cropName}</span>
                <span className="text-gray-400 font-normal">→</span>
                <span className={context.is_healthy ? 'text-emerald-400' : 'text-amber-400'}>
                  {diseaseName}
                </span>
              </h4>

              <div className="flex items-center gap-1.5 text-xs">
                {context.is_healthy ? (
                  <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {getTranslation(language, 'healthyStatus')}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-amber-400 font-semibold">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {context.confidence_percentage}% {getTranslation(language, 'confidence')}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Actions: Voice Ask + Clear */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
          <button
            onClick={onAskVoice}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-agri-primary hover:from-emerald-500 hover:to-agri-primaryHover text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-agri-primary/20 transition-all active:scale-95"
          >
            <Mic className="w-4 h-4 text-white animate-pulse" />
            <span>{getTranslation(language, 'askVoiceAboutThis')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onClear}
            className="p-2 text-gray-400 hover:text-white hover:bg-agri-border/50 rounded-xl transition-colors"
            title={getTranslation(language, 'clearContext')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
