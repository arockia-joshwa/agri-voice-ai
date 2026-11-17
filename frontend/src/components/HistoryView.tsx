import React, { useState, useEffect } from 'react';
import {
  History, Trash2, ArrowUpRight, Leaf,
  RefreshCw, Calendar
} from 'lucide-react';
import type { HistoryRecord, PredictionResult, Language } from '../types';
import { getConsultationHistory, deleteHistoryItem } from '../services/api';
import { getTranslation } from '../utils/translations';

interface HistoryViewProps {
  language: Language;
  onSelectRecord: (record: PredictionResult) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  language,
  onSelectRecord
}) => {
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getConsultationHistory();
      setHistory(data);
    } catch (err: any) {
      setError(err.message || 'Could not load history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteHistoryItem(id);
      setHistory((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.warn('Could not delete history record:', err);
    }
  };

  const handleOpenRecord = (record: HistoryRecord) => {
    // Reconstruct PredictionResult object
    const reconstructed: PredictionResult = {
      disease_id: record.disease_id,
      crop_en: record.crop_en,
      crop_ta: record.crop_ta,
      disease_name_en: record.disease_name_en,
      disease_name_ta: record.disease_name_ta,
      is_healthy: record.is_healthy,
      severity: (record.severity as any) || 'moderate',
      confidence: record.confidence,
      confidence_percentage: record.confidence_percentage,
      image_url: record.image_url,
      history_id: record.id,
      symptoms_en: record.symptoms || [],
      symptoms_ta: record.symptoms || [],
      causes_en: [],
      causes_ta: [],
      treatments_en: record.treatments || [],
      treatments_ta: record.treatments || [],
      ai_mode: 'demo',
      disclaimer_en: 'AI-assisted diagnosis.',
      disclaimer_ta: 'செயற்கை நுண்ணறிவு வழிகாட்டல்.'
    };

    onSelectRecord(reconstructed);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-agri-lightGreen text-xs font-bold uppercase tracking-wider mb-1">
            <History className="w-4 h-4" />
            <span>{language === 'ta' ? 'கடந்த கால ஆலோசனைகள்' : 'Consultation Archive'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            {getTranslation(language, 'historyTitle')}
          </h2>
        </div>

        <button
          onClick={fetchHistory}
          disabled={loading}
          className="self-start sm:self-auto inline-flex items-center space-x-2 px-4 py-2 bg-agri-card border border-agri-border hover:border-agri-primary text-gray-200 text-xs sm:text-sm font-semibold rounded-xl transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>{language === 'ta' ? 'புதுப்பி' : 'Refresh'}</span>
        </button>
      </div>

      {/* Content */}
      {error && (
        <div className="p-3 bg-red-950/60 border border-red-800/60 rounded-xl text-red-300 text-xs text-center">
          {error}
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-agri-muted">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-agri-primary" />
          <p className="text-sm">{language === 'ta' ? 'பதிவுகள் ஏற்றப்படுகின்றன...' : 'Loading history records...'}</p>
        </div>
      ) : history.length === 0 ? (
        <div className="bg-agri-card/40 border border-agri-border rounded-3xl p-10 text-center">
          <History className="w-12 h-12 text-agri-muted mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">
            {getTranslation(language, 'historyEmpty')}
          </h3>
          <p className="text-xs text-agri-muted">
            {language === 'ta'
              ? 'ஒரு பயிர் இலையை ஸ்கேன் செய்த பிறகு இங்கே அதன் விரிவான தகவல் சேமிக்கப்படும்.'
              : 'Your leaf diagnoses and Tamil Q&A will be saved here automatically.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {history.map((item) => (
            <div
              key={item.id}
              onClick={() => handleOpenRecord(item)}
              className="bg-agri-card hover:bg-agri-cardHover border border-agri-border hover:border-agri-borderBright rounded-2xl p-4 sm:p-5 transition-all shadow-md cursor-pointer group flex flex-col justify-between"
            >
              <div>
                {/* Top bar with timestamp and delete */}
                <div className="flex items-center justify-between text-xs text-agri-muted mb-3">
                  <span className="flex items-center space-x-1.5 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-agri-primary" />
                    <span>{item.timestamp}</span>
                  </span>

                  <button
                    onClick={(e) => handleDelete(item.id, e)}
                    className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-950/40 rounded-lg transition-colors"
                    title={getTranslation(language, 'deleteRecord')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Main diagnosis info */}
                <div className="flex items-start space-x-3.5">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt="Crop leaf"
                      className="w-16 h-16 rounded-xl object-cover border border-agri-border flex-shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-agri-primary/20 border border-agri-primary/30 flex items-center justify-center flex-shrink-0">
                      <Leaf className="w-8 h-8 text-agri-primary" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-gray-300">
                        {language === 'ta' ? item.crop_ta : item.crop_en}
                      </span>
                      <span className="text-[10px] text-agri-muted">•</span>
                      <span className="text-xs text-agri-lightGreen font-bold">
                        {item.confidence_percentage}% {getTranslation(language, 'confidence')}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white truncate mt-0.5">
                      {language === 'ta' ? item.disease_name_ta : item.disease_name_en}
                    </h4>

                    <span
                      className={`inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        item.is_healthy
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-amber-950 text-amber-400 border border-amber-800'
                      }`}
                    >
                      {item.is_healthy
                        ? getTranslation(language, 'healthyStatus')
                        : getTranslation(language, 'diseasedStatus')}
                    </span>
                  </div>
                </div>

                {/* Q&A snippet if present */}
                {item.farmer_question && (
                  <div className="mt-3 pt-3 border-t border-agri-border/60 text-xs text-gray-300 space-y-1 bg-agri-dark/40 p-2.5 rounded-xl">
                    <p className="font-semibold text-emerald-400 truncate">
                      Q: “{item.farmer_question}”
                    </p>
                    {item.ai_response && (
                      <p className="text-gray-400 line-clamp-2">
                        A: {item.ai_response}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Bottom footer button */}
              <div className="mt-4 pt-2 flex items-center justify-between text-xs text-agri-primary font-bold group-hover:text-agri-lightGreen transition-colors">
                <span>{getTranslation(language, 'loadIntoContext')}</span>
                <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
