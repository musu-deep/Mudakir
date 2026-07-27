import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Trees,
} from "lucide-react";
import { AudioSettings, DhikrItem, UserProgress } from "../types";
import { recordTasbeehCount } from "../utils/storage";
import {
  playBeadClick,
  playMilestoneChime,
  playTreePlantingSound,
  triggerHapticFeedback,
} from "../utils/sound";

interface SmartMisbahaProps {
  allAdhkar: DhikrItem[];
  selectedDhikr: DhikrItem;
  setSelectedDhikr: (item: DhikrItem) => void;
  audioSettings: AudioSettings;
  onUpdateProgress: (progress: UserProgress) => void;
  onOpenTadabbur: (dhikrText: string) => void;
  onOpenCardGenerator: (item: DhikrItem) => void;
}

export const SmartMisbaha: React.FC<SmartMisbahaProps> = ({
  allAdhkar,
  selectedDhikr,
  setSelectedDhikr,
  audioSettings,
  onUpdateProgress,
  onOpenTadabbur,
  onOpenCardGenerator,
}) => {
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(selectedDhikr.defaultTarget || 33);
  const [autoPlay, setAutoPlay] = useState(false);
  const [autoSpeed, setAutoSpeed] = useState(2000);
  const [treeMessage, setTreeMessage] = useState(false);
  const [completionMessage, setCompletionMessage] = useState<string | null>(null);
  const completionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setCount(0);
    setTarget(selectedDhikr.defaultTarget || 33);
    setAutoPlay(false);
  }, [selectedDhikr.id]);

  const handleIncrement = useCallback(() => {
    setCount((previous) => {
      const next = previous + 1;
      const { progress, newlyPlantedTree } = recordTasbeehCount(selectedDhikr.id, selectedDhikr.category, 1);
      onUpdateProgress(progress);

      if (audioSettings.soundEnabled) {
        playBeadClick(audioSettings.soundType, audioSettings.volume);
      }
      if (audioSettings.hapticEnabled) triggerHapticFeedback("light");

      if (newlyPlantedTree) {
        setTreeMessage(true);
        if (audioSettings.soundEnabled) playTreePlantingSound(audioSettings.volume);
        window.setTimeout(() => setTreeMessage(false), 2500);
      }

      if (target > 0 && next % target === 0) {
        if (audioSettings.soundEnabled) playMilestoneChime(audioSettings.volume);
        setCompletionMessage(`أحسنت! أتممت ${target} مرة ✨`);
        if (completionTimer.current) clearTimeout(completionTimer.current);
        completionTimer.current = setTimeout(() => setCompletionMessage(null), 3500);
      }
      return next;
    });
  }, [audioSettings, onUpdateProgress, selectedDhikr.category, selectedDhikr.id, target]);

  useEffect(() => {
    if (!autoPlay) return;
    const timer = window.setInterval(handleIncrement, autoSpeed);
    return () => window.clearInterval(timer);
  }, [autoPlay, autoSpeed, handleIncrement]);

  useEffect(() => () => {
    if (completionTimer.current) clearTimeout(completionTimer.current);
  }, []);

  const currentIndex = Math.max(0, allAdhkar.findIndex((item) => item.id === selectedDhikr.id));
  const navigate = (direction: number) => {
    if (!allAdhkar.length) return;
    const nextIndex = (currentIndex + direction + allAdhkar.length) % allAdhkar.length;
    setSelectedDhikr(allAdhkar[nextIndex]);
  };

  const progressPercent = useMemo(() => target > 0 ? Math.min(100, (count % target || (count ? target : 0)) / target * 100) : 0, [count, target]);
  const circumference = 2 * Math.PI * 42;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <section className="bg-white border border-[#EAE3D5] rounded-[40px] p-5 sm:p-8 shadow-sm space-y-5">
        <div className="flex items-center justify-between gap-2 border-b border-[#EAE3D5] pb-4">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1 p-2 sm:px-4 rounded-full bg-[#F9F7F2] border border-[#EAE3D5] text-xs text-[#2D5A27]">
            <ChevronRight className="w-4 h-4" /><span className="hidden sm:inline">السابق</span>
          </button>
          <span className="text-xs px-3 py-1 rounded-full bg-[#EAE3D5]/50 text-[#2D5A27] font-bold">
            {selectedDhikr.category === "ghiras" ? "🌱 غراس الجنة" : "ذِكْرٌ مَأْثُور"}
          </span>
          <button onClick={() => navigate(1)} className="flex items-center gap-1 p-2 sm:px-4 rounded-full bg-[#F9F7F2] border border-[#EAE3D5] text-xs text-[#2D5A27]">
            <span className="hidden sm:inline">التالي</span><ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        <div className="text-center bg-[#F9F7F2] border border-[#EAE3D5] rounded-[32px] p-6 sm:p-9 space-y-4">
          <p className="text-xs font-bold text-[#2D5A27]">الورد الحالي</p>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold leading-loose">{selectedDhikr.text}</h2>
          {selectedDhikr.rewardDescription && (
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2D5A27]/10 text-[#2D5A27] text-xs font-bold">
              <Trees className="w-4 h-4" /> {selectedDhikr.rewardDescription}
            </span>
          )}
          {selectedDhikr.virtue && <p className="text-xs sm:text-sm text-[#2D3436]/70 max-w-2xl mx-auto leading-relaxed">{selectedDhikr.virtue}</p>}
          {selectedDhikr.reference && <p className="text-[11px] text-[#2D3436]/50">المصدر: {selectedDhikr.reference}</p>}
        </div>

        <div className="flex justify-center gap-2 flex-wrap">
          <button onClick={() => onOpenTadabbur(selectedDhikr.text)} className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#F9F7F2] border border-[#EAE3D5] text-xs font-bold text-[#2D5A27]">
            <Sparkles className="w-4 h-4" /> تدبر وفهم
          </button>
          <button onClick={() => onOpenCardGenerator(selectedDhikr)} className="px-4 py-2 rounded-full bg-[#F9F7F2] border border-[#EAE3D5] text-xs font-bold text-[#2D5A27]">
            بطاقة للمشاركة
          </button>
        </div>
      </section>

      <section className="bg-white border border-[#EAE3D5] rounded-[40px] p-6 sm:p-10 shadow-sm text-center space-y-6 relative overflow-hidden">
        {treeMessage && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-[#2D5A27] text-white px-5 py-2 rounded-full shadow-lg text-xs font-bold whitespace-nowrap">
            🌴 هنيئاً! نبت غرس جديد في روضتك
          </div>
        )}
        {completionMessage && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-amber-600 text-white px-5 py-2 rounded-full shadow-lg text-xs font-bold flex items-center gap-2 whitespace-nowrap">
            <CheckCircle2 className="w-4 h-4" /> {completionMessage}
          </div>
        )}

        <div className="flex items-center justify-center gap-2 flex-wrap text-xs">
          <span className="font-bold text-[#2D5A27]">الهدف:</span>
          {[33, 100, 1000, 0].map((value) => (
            <button key={value} onClick={() => setTarget(value)} className={`px-4 py-2 rounded-full border ${target === value ? "bg-[#2D5A27] text-white border-[#2D5A27]" : "bg-[#F9F7F2] border-[#EAE3D5]"}`}>
              {value === 0 ? "حر" : value}
            </button>
          ))}
        </div>

        <div className="relative w-72 h-72 mx-auto flex items-center justify-center">
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100" aria-hidden="true">
            <circle cx="50" cy="50" r="42" strokeWidth="7" fill="none" className="stroke-[#F1EEE7]" />
            {target > 0 && (
              <circle
                cx="50" cy="50" r="42" strokeWidth="7" fill="none" strokeLinecap="round"
                className="stroke-[#2D5A27] transition-all duration-300"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - circumference * progressPercent / 100}
              />
            )}
          </svg>
          <button onClick={handleIncrement} className="absolute inset-6 rounded-full bg-[#FDFCF9] border-2 border-[#EAE3D5] hover:border-[#2D5A27] active:scale-95 transition-all shadow-inner flex flex-col items-center justify-center select-none">
            <span className="text-xs text-[#2D5A27]">{target > 0 ? `الهدف ${target}` : "العداد الحر"}</span>
            <strong className="text-7xl font-mono font-light text-[#2D5A27] my-2">{count}</strong>
            <span className="text-xs px-4 py-1 rounded-full bg-[#F9F7F2] border border-[#EAE3D5]">انقر للتسبيح</span>
          </button>
        </div>

        <div className="flex items-center justify-center gap-3 flex-wrap">
          <button onClick={handleIncrement} className="px-8 py-3 rounded-full bg-[#2D5A27] text-white font-bold text-sm">انقر للتسبيح</button>
          <button onClick={() => { setCount(0); setAutoPlay(false); }} className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#F9F7F2] border border-[#EAE3D5] text-[#2D5A27] font-bold text-sm">
            <RotateCcw className="w-4 h-4" /> إعادة تعيين
          </button>
          <button onClick={() => setAutoPlay((value) => !value)} className={`flex items-center gap-2 px-6 py-3 rounded-full border font-bold text-sm ${autoPlay ? "bg-amber-600 text-white border-amber-600" : "bg-[#F9F7F2] text-[#2D5A27] border-[#EAE3D5]"}`}>
            {autoPlay ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {autoPlay ? "إيقاف التلقائي" : "تسبيح تلقائي"}
          </button>
        </div>

        {autoPlay && (
          <div className="flex items-center justify-center gap-2 text-xs">
            <span>الفاصل:</span>
            {[1500, 2000, 3000].map((speed) => (
              <button key={speed} onClick={() => setAutoSpeed(speed)} className={`px-3 py-1 rounded-full ${autoSpeed === speed ? "bg-[#2D5A27] text-white" : "bg-[#F9F7F2] border border-[#EAE3D5]"}`}>{speed / 1000}ث</button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
