import React from 'react';
import { Sprout, Mic, Languages } from 'lucide-react';
import type { Language, ActiveTab } from '../types';
import { getTranslation } from '../utils/translations';

interface NavbarProps {
  language: Language;
  onLanguageToggle: () => void;
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  hasActiveContext: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onLanguageToggle,
  activeTab,
  onSelectTab,
  hasActiveContext
}) => {
  return (
    <header className="sticky top-0 z-50 bg-agri-dark/95 backdrop-blur border-b border-agri-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Branding */}
          <div 
            onClick={() => onSelectTab('dashboard')} 
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-agri-primary to-emerald-700 flex items-center justify-center shadow-lg shadow-agri-primary/20 group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  AgriVoice<span className="text-agri-primary">AI</span>
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-agri-primary/20 text-agri-lightGreen rounded border border-agri-primary/30">
                  AI 2.0
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-agri-muted font-medium hidden sm:block">
                {language === 'ta' ? 'விவசாயிகளுக்கான நவீன AI உதவியாளர்' : 'Smart Agricultural Assistant'}
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <button
              onClick={() => onSelectTab('dashboard')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-agri-card text-agri-lightGreen border border-agri-borderBright shadow-sm'
                  : 'text-gray-300 hover:text-white hover:bg-agri-card/60'
              }`}
            >
              {getTranslation(language, 'navDashboard')}
            </button>

            <button
              onClick={() => onSelectTab('detect')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center space-x-1.5 ${
                activeTab === 'detect'
                  ? 'bg-agri-card text-agri-lightGreen border border-agri-borderBright shadow-sm'
                  : 'text-gray-300 hover:text-white hover:bg-agri-card/60'
              }`}
            >
              <Sprout className="w-4 h-4 text-agri-primary" />
              <span>{getTranslation(language, 'navDetect')}</span>
            </button>

            <button
              onClick={() => onSelectTab('voice')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center space-x-1.5 ${
                activeTab === 'voice'
                  ? 'bg-agri-card text-agri-lightGreen border border-agri-borderBright shadow-sm'
                  : 'text-gray-300 hover:text-white hover:bg-agri-card/60'
              }`}
            >
              <Mic className="w-4 h-4 text-emerald-400" />
              <span>{getTranslation(language, 'navVoice')}</span>
              {hasActiveContext && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              )}
            </button>

            <button
              onClick={() => onSelectTab('history')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'history'
                  ? 'bg-agri-card text-agri-lightGreen border border-agri-borderBright shadow-sm'
                  : 'text-gray-300 hover:text-white hover:bg-agri-card/60'
              }`}
            >
              {getTranslation(language, 'navHistory')}
            </button>

            <button
              onClick={() => onSelectTab('about')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'about'
                  ? 'bg-agri-card text-agri-lightGreen border border-agri-borderBright shadow-sm'
                  : 'text-gray-300 hover:text-white hover:bg-agri-card/60'
              }`}
            >
              {getTranslation(language, 'navAbout')}
            </button>
          </nav>

          {/* Right Action: Language Switcher & Mobile Voice Link */}
          <div className="flex items-center space-x-3">
            {/* Language Toggle */}
            <button
              onClick={onLanguageToggle}
              className="flex items-center space-x-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-agri-card border border-agri-border hover:border-agri-primary/50 text-white font-medium text-xs sm:text-sm transition-all shadow-sm"
              title="Toggle language / மொழி மாற்றம்"
            >
              <Languages className="w-4 h-4 text-agri-primary" />
              <span className="font-bold">
                {language === 'ta' ? 'தமிழ்' : 'English'}
              </span>
              <span className="text-[11px] text-agri-muted">
                {language === 'ta' ? '/ EN' : '/ தமிழ்'}
              </span>
            </button>

            {/* Status indicator */}
            <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>AI Vision Active</span>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="md:hidden flex items-center justify-around py-2.5 border-t border-agri-border text-xs font-semibold">
          <button
            onClick={() => onSelectTab('dashboard')}
            className={`px-2.5 py-1.5 rounded-md ${
              activeTab === 'dashboard' ? 'text-agri-lightGreen bg-agri-card' : 'text-gray-400'
            }`}
          >
            {getTranslation(language, 'navDashboard')}
          </button>
          <button
            onClick={() => onSelectTab('detect')}
            className={`px-2.5 py-1.5 rounded-md flex items-center space-x-1 ${
              activeTab === 'detect' ? 'text-agri-lightGreen bg-agri-card' : 'text-gray-400'
            }`}
          >
            <Sprout className="w-3.5 h-3.5" />
            <span>{getTranslation(language, 'navDetect')}</span>
          </button>
          <button
            onClick={() => onSelectTab('voice')}
            className={`px-2.5 py-1.5 rounded-md flex items-center space-x-1 ${
              activeTab === 'voice' ? 'text-agri-lightGreen bg-agri-card' : 'text-gray-400'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>{getTranslation(language, 'navVoice')}</span>
          </button>
          <button
            onClick={() => onSelectTab('history')}
            className={`px-2.5 py-1.5 rounded-md ${
              activeTab === 'history' ? 'text-agri-lightGreen bg-agri-card' : 'text-gray-400'
            }`}
          >
            {getTranslation(language, 'navHistory')}
          </button>
        </div>
      </div>
    </header>
  );
};
