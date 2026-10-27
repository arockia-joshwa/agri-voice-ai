import { useState, useRef, useEffect, useCallback } from 'react';
import type { Language } from '../types';

interface UseTamilVoiceProps {
  language: Language;
  onTranscriptComplete?: (transcript: string) => void;
}

export function useTamilVoice({ language, onTranscriptComplete }: UseTamilVoiceProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = language === 'ta' ? 'ta-IN' : 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        let isFinal = false;
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            isFinal = true;
          }
        }
        setTranscript(currentTranscript);
        if (isFinal && onTranscriptComplete && currentTranscript.trim()) {
          onTranscriptComplete(currentTranscript.trim());
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('[Speech Recognition Error]', event.error);
        if (event.error === 'not-allowed') {
          setError(
            language === 'ta'
              ? 'குரல் உதவியாளரைப் பயன்படுத்த மைக்ரோஃபோன் அனுமதி தேவை.'
              : 'Microphone permission is required to use the voice assistant.'
          );
        } else if (event.error === 'no-speech') {
          // No speech detected, quietly ignore or allow retry
        } else {
          setError(
            language === 'ta'
              ? 'குரலை அடையாளம் காண்பதில் சிக்கல் ஏற்பட்டது. மீண்டும் பேசவும்.'
              : 'Speech recognition error. Please try again.'
          );
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      console.warn('SpeechRecognition API not supported on this browser.');
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }
    };
  }, [language]);

  const startListening = useCallback(() => {
    setError(null);
    setTranscript('');
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      setIsSpeaking(false);
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.lang = language === 'ta' ? 'ta-IN' : 'en-IN';
        recognitionRef.current.start();
      } catch (err: any) {
        console.warn('Recognition start error:', err);
        // If already started, restart
        try {
          recognitionRef.current.stop();
          setTimeout(() => recognitionRef.current?.start(), 150);
        } catch (e) {}
      }
    } else {
      setError(
        language === 'ta'
          ? 'இந்த உலாவியில் மைக்ரோஃபோன் ஆதரவு இல்லை. தயவுசெய்து Chrome உலாவியைப் பயன்படுத்தவும் அல்லது தட்டச்சு செய்யவும்.'
          : 'Voice input is not supported in this browser. Please use Chrome or type your question.'
      );
    }
  }, [language]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    setIsListening(false);
  }, [isListening]);

  // Audio Playback (Supports Backend generated MP3 stream or Browser SpeechSynthesis)
  const playAudio = useCallback(
    (audioUrl?: string | null, fallbackText?: string) => {
      // Stop current playback
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
        audioPlayerRef.current = null;
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }

      if (audioUrl) {
        const audio = new Audio(audioUrl);
        audioPlayerRef.current = audio;
        setIsSpeaking(true);

        audio.onended = () => {
          setIsSpeaking(false);
          audioPlayerRef.current = null;
        };
        audio.onerror = () => {
          setIsSpeaking(false);
          audioPlayerRef.current = null;
          // Fallback to browser SpeechSynthesis if audio tag fails
          if (fallbackText && window.speechSynthesis) {
            speakWithBrowser(fallbackText, language);
          }
        };

        audio.play().catch((err) => {
          console.warn('Audio play error:', err);
          setIsSpeaking(false);
          if (fallbackText && window.speechSynthesis) {
            speakWithBrowser(fallbackText, language);
          }
        });
      } else if (fallbackText && window.speechSynthesis) {
        speakWithBrowser(fallbackText, language);
      }
    },
    [language]
  );

  const speakWithBrowser = (text: string, lang: Language) => {
    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'ta' ? 'ta-IN' : 'en-US';
      utterance.rate = 0.95;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      setIsSpeaking(false);
    }
  };

  const stopAudio = useCallback(() => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current = null;
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }, []);

  return {
    isListening,
    isSpeaking,
    transcript,
    setTranscript,
    error,
    startListening,
    stopListening,
    playAudio,
    stopAudio,
    isSupported: Boolean((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)
  };
}
