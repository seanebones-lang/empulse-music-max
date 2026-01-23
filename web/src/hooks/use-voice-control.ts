'use client';

import { useEffect, useRef, useState } from 'react';
import type {
  SpeechRecognition,
  SpeechRecognitionEvent,
  WindowWithSpeechRecognition,
} from '@/types/speech';

interface UseVoiceControlOptions {
  isPlaying: boolean;
  togglePlay: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

/**
 * Voice control hook – SRP: speech recognition for play/pause/next/previous
 */
export function useVoiceControl({ isPlaying, togglePlay, onNext, onPrevious }: UseVoiceControlOptions) {
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [isVoiceActive, setIsVoiceActive] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const win = window as WindowWithSpeechRecognition;
    const SR = win.webkitSpeechRecognition || win.SpeechRecognition;
    if (!SR) return;

    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = false;
    rec.lang = 'en-US';

    rec.onresult = (e: SpeechRecognitionEvent) => {
      const t = e.results[e.results.length - 1][0].transcript.toLowerCase();
      if (t.includes('play')) togglePlay();
      if (t.includes('pause') && isPlaying) togglePlay();
      if (t.includes('next')) onNext();
      if (t.includes('previous') || t.includes('back')) onPrevious();
    };

    rec.onerror = () => setIsVoiceActive(false);

    recognitionRef.current = rec;
    return () => {
      recognitionRef.current = null;
    };
  }, [isPlaying, togglePlay, onNext, onPrevious]);

  const toggle = () => {
    const rec = recognitionRef.current;
    if (!rec) return;
    if (isVoiceActive) {
      rec.stop();
      setIsVoiceActive(false);
    } else {
      rec.start();
      setIsVoiceActive(true);
    }
  };

  return { isVoiceActive, toggleVoiceControl: toggle };
}
