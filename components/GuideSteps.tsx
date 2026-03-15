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
    <div className="space-y-6">
      {isSupported && (
        <div className="flex gap-2">
          <button
            onClick={handlePlayAll}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-[8px] border-[1.5px] font-bold text-[14px] transition-all ${isPlayingAll && !isPaused
                ? 'bg-[#1B4FA8] border-[#1B4FA8] text-white'
                : 'bg-white border-[#1B4FA8] text-[#1B4FA8] hover:bg-[#E8F0FD]'
              }`}
          >
            {isPlayingAll && !isPaused ? (
              <><Pause size={18} /> {t('pause')}</>
            ) : isPaused ? (
              <><Play size={18} /> {t('resume')}</>
            ) : (
              <><Volume2 size={18} /> {t('listen_all')}</>
            )}
          </button>

          {(isPlayingAll || isPaused) && (
            <button
              onClick={handleStop}
              className="bg-white border-[1.5px] border-red-500 text-red-500 px-4 py-2.5 rounded-[8px] font-bold text-[14px] hover:bg-red-50 transition-all"
            >
              <VolumeX size={18} />
            </button>
          )}
        </div>
      )}

      <div className="space-y-4">
        {sortedSteps.map((step, index) => (
          <div key={step.step_number} className="relative flex gap-6">
            {index !== sortedSteps.length - 1 && (
              <div className="absolute left-[14px] top-[28px] bottom-0 w-[2px] border-l-2 border-dashed border-[#E2E8F0]"></div>
            )}

            <div className={`relative z-10 w-[28px] h-[28px] rounded-full flex items-center justify-center shrink-0 font-semibold text-[13px] shadow-sm transition-all ${currentStepIndex === index ? 'bg-[#E07B00] scale-110' : 'bg-[#1B4FA8] text-white'
              }`}>
              {step.step_number}
            </div>

            <div className={`flex-1 bg-white rounded-[12px] border p-5 shadow-sm transition-all relative group ${currentStepIndex === index
                ? 'border-[#1B4FA8] border-l-[4px] ring-4 ring-[#1B4FA8]/5'
                : 'border-[#E2E8F0] hover:shadow-md'
              }`}>
              {isSupported && (
                <button
                  onClick={() => playIndividualStep(index)}
                  className={`absolute top-4 right-4 w-7 h-7 rounded-full border flex items-center justify-center transition-all bg-white hover:border-[#1B4FA8] hover:text-[#1B4FA8] ${currentStepIndex === index ? 'border-[#1B4FA8] text-[#1B4FA8]' : 'border-[#E2E8F0] text-[#4A5568]'
                    }`}
                  title="Listen Step"
                >
                  <Volume2 size={14} />
                </button>
              )}

              <h4 className="font-semibold text-[15px] text-[#1A1A2E] mb-2 pr-8">{step.title}</h4>
              <p className="text-[#4A5568] text-[15px] leading-relaxed">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
