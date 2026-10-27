import React, { useState, useRef, useEffect } from 'react';
import {
  Upload, Camera, RefreshCw, AlertTriangle, ShieldCheck, CheckCircle2,
  AlertCircle, Leaf, Sparkles, ChevronRight, Mic, Info, X
} from 'lucide-react';
import type { PredictionResult, SampleLeaf, Language } from '../types';
import { predictCropDisease, getSampleLeaves } from '../services/api';
import { getTranslation } from '../utils/translations';

interface DiseaseDetectionProps {
  language: Language;
  onPredictionComplete: (result: PredictionResult) => void;
  onAskVoice: (result: PredictionResult) => void;
  initialPrediction?: PredictionResult | null;
}

export const DiseaseDetection: React.FC<DiseaseDetectionProps> = ({
  language,
  onPredictionComplete,
  onAskVoice,
  initialPrediction = null,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(initialPrediction?.image_url || null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedSampleId, setSelectedSampleId] = useState<string | null>(null);
  const [sampleLeaves, setSampleLeaves] = useState<SampleLeaf[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<PredictionResult | null>(initialPrediction);

  // Camera modal state
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Fetch sample leaves on mount
  useEffect(() => {
    getSampleLeaves()
      .then((samples) => setSampleLeaves(samples))
      .catch((err) => console.warn('Could not load sample leaves:', err));
  }, []);

  // Update if initial prediction changes from history
  useEffect(() => {
    if (initialPrediction) {
      setPrediction(initialPrediction);
      setSelectedImage(initialPrediction.image_url);
    }
  }, [initialPrediction]);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setSelectedSampleId(null);
      setError(null);
      const objectUrl = URL.createObjectURL(file);
      setSelectedImage(objectUrl);
    }
  };

  // Handle Drag and Drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      setSelectedSampleId(null);
      setError(null);
      const objectUrl = URL.createObjectURL(file);
      setSelectedImage(objectUrl);
    }
  };

  // Camera Handling
  const startCamera = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;
      setIsCameraOpen(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      }, 200);
    } catch (err: any) {
      console.warn('Camera access denied or failed:', err);
      // Fallback: trigger file input with capture
      if (fileInputRef.current) {
        fileInputRef.current.click();
      } else {
        setError(
          language === 'ta'
            ? 'கேமரா அனுமதி மறுக்கப்பட்டது. தயவுசெய்து புகைப்படத்தை பதிவேற்றவும்.'
            : 'Camera permission denied or not available. Please upload an image.'
        );
      }
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'camera_capture.jpg', { type: 'image/jpeg' });
            setSelectedFile(file);
            setSelectedSampleId(null);
            setSelectedImage(URL.createObjectURL(blob));
            closeCamera();
          }
        }, 'image/jpeg', 0.95);
      }
    }
  };

  const closeCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraOpen(false);
  };

  // Run AI analysis
  const handleAnalyze = async (overrideSampleId?: string) => {
    const targetSample = overrideSampleId || selectedSampleId;
    if (!selectedFile && !targetSample) {
      setError(
        language === 'ta'
          ? 'தயவுசெய்து ஒரு பயிர் இலையின் புகைப்படத்தை பதிவேற்றவும்.'
          : 'Please upload a crop leaf photo or select a sample leaf.'
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await predictCropDisease(
        selectedFile || undefined,
        targetSample || undefined
      );
      setPrediction(result);
      onPredictionComplete(result);
    } catch (err: any) {
      setError(
        err.message ||
          (language === 'ta'
            ? 'இலையை பகுப்பாய்வு செய்வதில் தோல்வி. தயவுசெய்து தெளிவான புகைப்படத்தை பதிவேற்றவும்.'
            : 'Unable to analyze this image. Please upload a clearer crop leaf photo.')
      );
    } finally {
      setLoading(false);
    }
  };

  // Quick-select a sample leaf
  const handleSelectSample = (sample: SampleLeaf) => {
    setSelectedSampleId(sample.id);
    setSelectedFile(null);
    setSelectedImage(sample.image_url);
    setError(null);
    handleAnalyze(sample.id);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Title Header */}
      <div className="text-center sm:text-left">
        <div className="inline-flex items-center space-x-2 text-agri-lightGreen text-xs font-bold uppercase tracking-wider mb-2">
          <Leaf className="w-4 h-4" />
          <span>{language === 'ta' ? 'கணினி பார்வை நுண்ணறிவு' : 'Computer Vision Diagnostic'}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          {getTranslation(language, 'btnDetect')}
        </h2>
        <p className="text-sm sm:text-base text-agri-muted mt-1">
          {language === 'ta'
            ? 'பாதிக்கப்பட்ட பயிர் இலையின் புகைப்படத்தை பதிவேற்றுங்கள். AI அதன் நோயை உடனடியாக கண்டறியும்.'
            : 'Upload or capture a photo of the affected crop leaf to instantly identify diseases.'}
        </p>
      </div>

      {/* Main Upload / Capture Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Upload & Camera Controls */}
        <div className="lg:col-span-5 space-y-4">
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="border-2 border-dashed border-agri-borderBright hover:border-agri-primary/80 bg-agri-card/70 rounded-3xl p-6 text-center transition-all flex flex-col items-center justify-center min-h-[300px] sm:min-h-[340px] relative overflow-hidden"
          >
            {selectedImage ? (
              <div className="relative w-full h-full flex flex-col items-center">
                <img
                  src={selectedImage}
                  alt="Crop Leaf Preview"
                  className="max-h-64 w-full object-contain rounded-2xl border border-agri-border shadow-lg"
                />
                <button
                  onClick={() => {
                    setSelectedImage(null);
                    setSelectedFile(null);
                    setSelectedSampleId(null);
                    setPrediction(null);
                  }}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 hover:bg-black text-white transition-colors"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-4 py-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-950/80 border border-agri-primary/30 flex items-center justify-center mx-auto shadow-inner text-agri-primary">
                  <Upload className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-sm sm:text-base font-bold text-white">
                    {getTranslation(language, 'dropImageHere')}
                  </p>
                  <p className="text-xs text-agri-muted mt-1">
                    JPG, PNG, WebP (Max 15MB)
                  </p>
                </div>
              </div>
            )}

            {/* Hidden native input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Action Buttons: Browse + Camera */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center space-x-2 px-4 py-3 bg-agri-card border border-agri-border hover:border-agri-primary/50 text-white rounded-2xl text-xs sm:text-sm font-bold shadow transition-all active:scale-95"
            >
              <Upload className="w-4 h-4 text-agri-primary" />
              <span>{getTranslation(language, 'browseFiles')}</span>
            </button>

            <button
              onClick={startCamera}
              className="flex items-center justify-center space-x-2 px-4 py-3 bg-agri-card border border-agri-border hover:border-agri-primary/50 text-white rounded-2xl text-xs sm:text-sm font-bold shadow transition-all active:scale-95"
            >
              <Camera className="w-4 h-4 text-emerald-400" />
              <span>{getTranslation(language, 'takePhoto')}</span>
            </button>
          </div>

          {/* Analyze Button */}
          <button
            onClick={() => handleAnalyze()}
            disabled={(!selectedFile && !selectedSampleId) || loading}
            className={`w-full py-4 px-6 rounded-2xl font-bold text-base sm:text-lg flex items-center justify-center space-x-2 shadow-xl transition-all ${
              (!selectedFile && !selectedSampleId) || loading
                ? 'bg-agri-card text-gray-500 cursor-not-allowed border border-agri-border'
                : 'bg-gradient-to-r from-emerald-600 to-agri-primary hover:from-emerald-500 hover:to-agri-primaryHover text-white shadow-agri-primary/30 active:scale-95'
            }`}
          >
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>{getTranslation(language, 'analyzing')}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>{getTranslation(language, 'analyzeButton')}</span>
              </>
            )}
          </button>

          {/* Error Message */}
          {error && (
            <div className="p-3.5 bg-red-950/50 border border-red-800/60 rounded-xl flex items-start space-x-3 text-red-300 text-xs sm:text-sm">
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick-test Sample Leaf Presets */}
          <div className="pt-2">
            <p className="text-xs font-bold text-agri-muted uppercase tracking-wider mb-2">
              {getTranslation(language, 'sampleLeavesTitle')}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {sampleLeaves.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => handleSelectSample(sample)}
                  className={`p-2 rounded-xl text-left border transition-all text-xs flex flex-col justify-between ${
                    selectedSampleId === sample.id
                      ? 'bg-emerald-950/60 border-agri-primary text-agri-lightGreen'
                      : 'bg-agri-card/60 border-agri-border/60 hover:border-agri-primary/40 text-gray-300'
                  }`}
                >
                  <div className="font-bold truncate text-white">{sample.crop}</div>
                  <div className="text-[11px] truncate text-agri-muted">
                    {language === 'ta' ? sample.disease_ta : sample.disease}
                  </div>
                  <span className="mt-1 text-[10px] text-emerald-400 font-semibold inline-block">
                    {sample.badge}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Comprehensive Diagnostic Results */}
        <div className="lg:col-span-7">
          {prediction ? (
            <div className="bg-agri-card border border-agri-borderBright rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl animate-fade-in">
              {/* Header Status Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-agri-border">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      prediction.is_healthy
                        ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-700/50'
                        : 'bg-red-950/80 text-amber-400 border border-amber-700/50'
                    }`}
                  >
                    {prediction.is_healthy ? (
                      <CheckCircle2 className="w-7 h-7" />
                    ) : (
                      <AlertCircle className="w-7 h-7" />
                    )}
                  </div>
                  <div>
                    <span
                      className={`text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                        prediction.is_healthy
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-amber-950 text-amber-400 border border-amber-800'
                      }`}
                    >
                      {prediction.is_healthy
                        ? getTranslation(language, 'healthyStatus')
                        : getTranslation(language, 'diseasedStatus')}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                      {language === 'ta' ? prediction.disease_name_ta : prediction.disease_name_en}
                    </h3>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl sm:text-3xl font-black text-agri-lightGreen">
                    {prediction.confidence_percentage}%
                  </div>
                  <div className="text-[11px] text-agri-muted uppercase font-bold">
                    {getTranslation(language, 'confidence')}
                  </div>
                </div>
              </div>

              {/* Crop & Scientific info */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-agri-dark/60 p-3.5 rounded-2xl border border-agri-border/50">
                <div>
                  <span className="text-agri-muted block">{getTranslation(language, 'currentCrop')}</span>
                  <span className="font-bold text-white text-sm">
                    {language === 'ta' ? prediction.crop_ta : prediction.crop_en}
                  </span>
                </div>
                <div>
                  <span className="text-agri-muted block">{getTranslation(language, 'severity')}</span>
                  <span
                    className={`font-bold text-sm uppercase ${
                      prediction.severity === 'high'
                        ? 'text-red-400'
                        : prediction.severity === 'moderate'
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {getTranslation(language, prediction.severity as any)}
                  </span>
                </div>
                {prediction.scientific_name && (
                  <div className="col-span-2 sm:col-span-1">
                    <span className="text-agri-muted block">{getTranslation(language, 'scientificName')}</span>
                    <span className="font-medium text-gray-300 italic truncate block">
                      {prediction.scientific_name}
                    </span>
                  </div>
                )}
              </div>

              {/* Symptoms */}
              <div className="space-y-2">
                <h4 className="text-xs sm:text-sm font-bold text-white flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-agri-primary" />
                  <span>{getTranslation(language, 'symptoms')}</span>
                </h4>
                <ul className="space-y-1.5 pl-3 text-xs sm:text-sm text-gray-300">
                  {(language === 'ta' ? prediction.symptoms_ta : prediction.symptoms_en).map((sym, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="text-agri-primary font-bold">•</span>
                      <span>{sym}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Causes */}
              <div className="space-y-2">
                <h4 className="text-xs sm:text-sm font-bold text-white flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>{getTranslation(language, 'causes')}</span>
                </h4>
                <ul className="space-y-1.5 pl-3 text-xs sm:text-sm text-gray-300">
                  {(language === 'ta' ? prediction.causes_ta : prediction.causes_en).map((cause, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{cause}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Treatments & Chemical Spray Dosage */}
              <div className="space-y-2 p-4 rounded-2xl bg-emerald-950/30 border border-emerald-800/40">
                <h4 className="text-xs sm:text-sm font-bold text-agri-lightGreen flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>{getTranslation(language, 'treatments')}</span>
                </h4>
                <ul className="space-y-2 pl-1 text-xs sm:text-sm text-gray-200">
                  {(language === 'ta' ? prediction.treatments_ta : prediction.treatments_en).map((trt, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <ChevronRight className="w-4 h-4 text-agri-primary flex-shrink-0 mt-0.5" />
                      <span className="font-medium">{trt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Organic Remedies */}
              {((language === 'ta' ? prediction.organic_remedies_ta : prediction.organic_remedies_en) || []).length > 0 && (
                <div className="space-y-2 p-4 rounded-2xl bg-amber-950/20 border border-amber-800/30">
                  <h4 className="text-xs sm:text-sm font-bold text-amber-300 flex items-center space-x-2">
                    <Leaf className="w-4 h-4 text-amber-400" />
                    <span>{getTranslation(language, 'organicRemedies')}</span>
                  </h4>
                  <ul className="space-y-1.5 pl-1 text-xs sm:text-sm text-gray-300">
                    {((language === 'ta' ? prediction.organic_remedies_ta : prediction.organic_remedies_en) || []).map((org, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <span className="text-amber-400 font-bold">•</span>
                        <span>{org}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Prevention Tips */}
              <div className="space-y-2">
                <h4 className="text-xs sm:text-sm font-bold text-white flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-teal-400" />
                  <span>{getTranslation(language, 'preventionTips')}</span>
                </h4>
                <ul className="space-y-1 pl-3 text-xs sm:text-sm text-gray-300">
                  {(language === 'ta' ? prediction.prevention_ta : prediction.prevention_en)?.map((tip, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="text-teal-400 font-bold">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bottom Action: Seamless Voice Hand-off */}
              <div className="pt-2">
                <button
                  onClick={() => onAskVoice(prediction)}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 to-agri-primary hover:from-emerald-500 hover:to-agri-primaryHover text-white rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center space-x-2 shadow-lg shadow-agri-primary/25 transition-all active:scale-95"
                >
                  <Mic className="w-5 h-5 text-white animate-pulse" />
                  <span>{getTranslation(language, 'askVoiceAboutThis')}</span>
                </button>
              </div>

              {/* Clinical AI Disclaimer */}
              <div className="p-3 bg-agri-dark/80 rounded-xl border border-agri-border/60 flex items-start space-x-2.5 text-[11px] text-agri-muted leading-relaxed">
                <Info className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <span>{getTranslation(language, 'expertDisclaimer')}</span>
              </div>
            </div>
          ) : (
            /* Empty State */
            <div className="border border-agri-border rounded-3xl p-8 sm:p-12 text-center bg-agri-card/30 flex flex-col items-center justify-center h-full min-h-[350px]">
              <div className="w-16 h-16 rounded-2xl bg-agri-card border border-agri-border flex items-center justify-center text-agri-muted mb-4">
                <Leaf className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white">
                {language === 'ta' ? 'இலையை ஸ்கேன் செய்ய தயார்' : 'Leaf Diagnostic Ready'}
              </h3>
              <p className="text-xs sm:text-sm text-agri-muted max-w-sm mt-1">
                {language === 'ta'
                  ? 'இடதுபுறத்தில் ஒரு பயிர் இலையின் புகைப்படத்தை பதிவேற்றவும் அல்லது மாதிரி இலையை கிளிக் செய்து உடனடியாக சோதிக்கவும்.'
                  : 'Upload an image on the left or select a sample leaf to view the clinical disease analysis.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Camera Live Modal */}
      {isCameraOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4">
          <div className="relative max-w-lg w-full bg-agri-card border border-agri-borderBright rounded-3xl overflow-hidden shadow-2xl p-4">
            <div className="flex items-center justify-between pb-3 border-b border-agri-border">
              <span className="font-bold text-white flex items-center space-x-2">
                <Camera className="w-4 h-4 text-agri-primary" />
                <span>{getTranslation(language, 'takePhoto')}</span>
              </span>
              <button
                onClick={closeCamera}
                className="p-1 rounded-lg text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative mt-3 rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              {/* Target box guide */}
              <div className="absolute inset-8 border-2 border-dashed border-agri-primary/70 rounded-2xl pointer-events-none" />
            </div>

            <div className="mt-4 flex items-center justify-center gap-4">
              <button
                onClick={capturePhoto}
                className="px-6 py-3 bg-agri-primary hover:bg-agri-primaryHover text-white font-bold rounded-2xl shadow-lg flex items-center space-x-2 text-sm"
              >
                <Camera className="w-5 h-5" />
                <span>{getTranslation(language, 'capturePhoto')}</span>
              </button>
              <button
                onClick={closeCamera}
                className="px-5 py-3 bg-agri-card border border-agri-border text-gray-300 font-bold rounded-2xl text-sm"
              >
                {getTranslation(language, 'closeCamera')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
