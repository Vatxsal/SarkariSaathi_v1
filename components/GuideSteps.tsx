'use client';

import { useState, useEffect, useCallback } from 'react';
import { Volume2, Pause, Play, VolumeX } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Step {
  step_number: number;
  title: string;
  description: string;
}

export default function GuideSteps({ steps }: { steps: Step[] }) {
  const { t, i18n } = useTranslation();
  const sortedSteps = [...steps].sort((a, b) => a.step_number - b.step_number);

  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);
    }
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  const speak = useCallback((text: string, onEnd?: () => void) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = i18n.language === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.9;

    const voices = window.speechSynthesis.getVoices();
    const targetVoice = voices.find(v =>
      v.lang === utterance.lang || v.lang.startsWith(i18n.language)
    );
    if (targetVoice) utterance.voice = targetVoice;

    if (onEnd) {
      utterance.onend = onEnd;
    }

    window.speechSynthesis.speak(utterance);
  }, [i18n.language]);

  const handlePlayAll = () => {
    if (isPlayingAll && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    } else if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    } else {
      setIsPlayingAll(true);
      playStep(0);
    }
  };

  const playStep = (index: number) => {
    if (index >= sortedSteps.length) {
      setIsPlayingAll(false);
      setCurrentStepIndex(null);
      return;
    }

    setCurrentStepIndex(index);
    const step = sortedSteps[index];
    const textToRead = `${step.title}. ${step.description}`;

    speak(textToRead, () => {
      setTimeout(() => {
        if (isPlayingAll) playStep(index + 1);
      }, 1000);
    });
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsPlayingAll(false);
    setIsPaused(false);
    setCurrentStepIndex(null);
  };

  const playIndividualStep = (index: number) => {
    if (isPlayingAll) handleStop();
    setCurrentStepIndex(index);
    const step = sortedSteps[index];
    speak(`${step.title}. ${step.description}`, () => {
      setCurrentStepIndex(null);
    });
  };

  return (
    <div className="space-y-8">
      {isSupported && (
        <div className="flex gap-3">
          <button
            onClick={handlePlayAll}
            className={`flex items-center gap-2 px-6 py-3 rounded-[8px] font-bold text-xs uppercase tracking-widest border transition-all active:scale-[0.98] ${isPlayingAll && !isPaused
                ? 'bg-[var(--primary)] border-[var(--primary)] text-white shadow-[var(--shadow-mid)]'
                : 'bg-white border-[var(--border)] text-[var(--primary)] hover:border-[var(--primary)] hover:bg-[var(--surface-3)]'
              }`}
          >
            {isPlayingAll && !isPaused ? (
              <><Pause size={16} /> {t('pause')}</>
            ) : isPaused ? (
              <><Play size={16} /> {t('resume')}</>
            ) : (
              <><Volume2 size={16} /> {t('listen_all')}</>
            )}
          </button>

          {(isPlayingAll || isPaused) && (
            <button
              onClick={handleStop}
              className="bg-white border border-[var(--error)] text-[var(--error)] px-4 py-3 rounded-[8px] font-bold text-xs hover:bg-red-50 transition-all active:scale-[0.98]"
            >
              <VolumeX size={16} />
            </button>
          )}
        </div>
      )}

      <div className="space-y-6">
        {sortedSteps.map((step, index) => (
          <div key={step.step_number} className="relative flex gap-6 group">
            {index !== sortedSteps.length - 1 && (
              <div className="absolute left-[15px] top-[32px] bottom-0 w-[1px] border-l-2 border-dashed border-[var(--border)] group-hover:border-[var(--primary)] transition-colors"></div>
            )}

            <div className={`relative z-10 w-[32px] h-[32px] rounded-full flex items-center justify-center shrink-0 font-bold text-[14px] shadow-sm transition-all duration-300 ${currentStepIndex === index ? 'bg-[var(--accent)] text-white scale-110 shadow-[var(--shadow-mid)]' : 'bg-[var(--primary)] text-white'
              }`}>
              {step.step_number}
            </div>

            <div className={`flex-1 bg-white rounded-[12px] border p-6 transition-all relative ${currentStepIndex === index
                ? 'border-[var(--primary)] shadow-[var(--shadow-mid)] ring-4 ring-[var(--primary)]/[0.04]'
                : 'border-[var(--border)] hover:border-[var(--primary)] shadow-[var(--shadow-low)]'
              }`}>
              {isSupported && (
                <button
                  onClick={() => playIndividualStep(index)}
                  className={`absolute top-4 right-4 w-8 h-8 rounded-[6px] border flex items-center justify-center transition-all bg-white hover:border-[var(--primary)] hover:text-[var(--primary)] shadow-sm ${currentStepIndex === index ? 'border-[var(--primary)] text-[var(--primary)]' : 'border-[var(--border)] text-[var(--text-tertiary)]'
                    }`}
                  title="Listen Step"
                >
                  <Volume2 size={16} />
                </button>
              )}

              <h4 className="font-bold text-[15px] text-[var(--text-primary)] mb-2 pr-10 font-display uppercase tracking-wider text-xs">
                 Step {step.step_number}: {step.title}
              </h4>
              <p className="text-[var(--text-secondary)] text-[15px] leading-relaxed font-body">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
