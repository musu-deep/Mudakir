import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Trees,
  ChevronRight,
  ChevronLeft,
  Volume2,
  VolumeX,
  Zap,
  Info,
  CheckCircle2,
  Heart
} from "lucide-react";
import { DhikrItem, AudioSettings, UserProgress, DhikrCategory } from "../types";
import { recordTasbeehCount, toggleFavorite } from "../utils/storage";
import { playBeadClick, playMilestoneChime, playTreePlantingSound, triggerHapticFeedback } from "../utils/sound";

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
  const [lapCount, setLapCount] = useState(0);
  const [targetGoal, setTargetGoal] = useState<number>(selectedDhikr.defaultTarget || 33);
  const [autoPlay, setAutoPlay] = useState(false);
  const [autoSpeed, setAutoSpeed] = useState<number>(2000); // 2 seconds per count
  const [isTreeAnimating, setIsTreeAnimating] = useState(false);
  const [isTapRippling, setIsTapRippling] = useState(false);
  const [completionMessage, setCompletionMessage] = useState<string | null>(null);

  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync target when selected Dhikr changes
  useEffect(() => {
    setLapCount(0);
    setTargetGoal(selectedDhikr.defaultTarget || 33);
    setAutoPlay(false);
  }, [selectedDhikr.id]);

  // Handle Tap Count
  const handleCountIncrement = () => {
    const nextCount = lapCount + 1;
    setLapCount(nextCount);

    // Play Audio Feedback
    if (audioSettings.soundEnabled) {
      playBeadClick(audioSettings.soundType, audioSettings.volume);
    }
    if (audioSettings.hapticEnabled) {
      triggerHapticFeedback("light");
    }

    // Ripple visual effect
    setIsTapRippling(true);
    setTimeout(() => setIsTapRippling(false), 200);

    // Save to persistence
    const { progress, newlyPlantedTree } = recordTasbeehCount(selectedDhikr.id, selectedDhikr.category, 1);
    onUpdateProgress(progress);

    // Check tree planting
    if (newlyPlantedTree) {
      setIsTreeAnimating(true);
      if (audioSettings.soundEnabled) playTreePlantingSound(audioSettings.volume);
      setTimeout(() => setIsTreeAnimating(false), 2500);
    }

    // Check lap completion
    if (targetGoal > 0 && nextCount % targetGoal === 0) {
      if (audioSettings.soundEnabled) playMilestoneChime(audioSettings.volume);
      setCompletionMessage(`أحسنت! أتممت ${targetGoal} تسبيحة بنجاح ✨`);
      setTimeout(() => setCompletionMessage(null), 4000);
    }
  };

  // Handle Auto Play
  useEffect(() => {
    if (autoPlay) {
      autoPlayTimerRef.current = setInterval(() => {
        handleCountIncrement();
      }, autoSpeed);
    } else if (autoPlayTimerRef.current) {
      clearInterval(autoPlayTimerRef.current);
    }

    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [autoPlay, autoSpeed, lapCount, selectedDhikr, audioSettings]);

  // Reset lap count
  const handleReset = () => {
    setLapCount(0);
    setAutoPlay(false);
  };

  // Navigation between Athkar
  const currentIndex = allAdhkar.findIndex((item) => item.id === selectedDhikr.id);
  const handleNextDhikr = () => {
    const nextIdx = (currentIndex + 1) % allAdhkar.length;
    setSelectedDhikr(allAdhkar[nextIdx]);
  };
  const handlePrevDhikr = () => {
    const prevIdx = (currentIndex - 1 + allAdhkar.length) % allAdhkar.length;
    setSelectedDhikr(allAdhkar[prevIdx]);
  };

  // Progress percentage
  const progressPercent = targetGoal > 0 ? Math.min(100, Math.round((lapCount / targetGoal) * 100)) : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Top Selector Banner */}
      <div className="bg-white border border-[#EAE3D5] rounded-[40px] p-6 sm:p-8 shadow-sm relative overflow-hidden">
        
        <div className="relative z-10 space-y-5">
          
          {/* Category & Navigation Header */}
          <div className="flex items-center justify-between gap-2 border-b border-[#EAE3D5] pb-4">
            <button
              onClick={handlePrevDhikr}
              className="flex items-center gap-1 text-xs text-[#2D5A27] hover:text-[#1E3D1A] p-2 sm:px-3 sm:py-1.5 rounded-full bg-[#F9F7F2] border border-[#EAE3D5] transition-all font-medium"
            >
              <ChevronRight className="w-4 h-4" />
              <span className="hidden sm:inline">الذكر السابق</span>
            </button>

            <span className="text-xs px-3.5 py-1 rounded-full bg-[#EAE3D5]/50 text-[#2D5A27] border border-[#EAE3D5] font-semibold">
              {selectedDhikr.category === "ghiras" ? "🌱 غراس الجنة والذكر المضاعف" : "ذِكْرٌ مَأْثُور"}
            </span>

            <button
              onClick={handleNextDhikr}
              className="flex items-center gap-1 text-xs text-[#2D5A27] hover:text-[#1E3D1A] p-2 sm:px-3 sm:py-1.5 rounded-full bg-[#F9F7F2] border border-[#EAE3D5] transition-all font-medium"
            >
              <span className="hidden sm:inline">الذكر التالي</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          {/* Main Dhikr Text Box */}
          <div className="text-center px-4 sm:px-8 py-6 rounded-[32px] bg-[#F9F7F2] border border-[#EAE3D5] space-y-4">
            <p className="text-[#2D5A27] font-serif italic text-sm font-medium">الورد الحالي</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif leading-relaxed text-[#2D3436] select-none">
              {selectedDhikr.text}
            </h2>

            {selectedDhikr.rewardDescription && (
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2D5A27]/10 text-[#2D5A27] border border-[#2D5A27]/20 text-xs sm:text-sm font-semibold">
                <Trees className="w-4 h-4 shrink-0" />
                <span>{selectedDhikr.rewardDescription}</span>
              </div>
            )}

            {selectedDhikr.virtue && (
              <p className="text-xs sm:text-sm text-[#2D3436]/75 max-w-2xl mx-auto font-sans leading-relaxed pt-1">
                {selectedDhikr.virtue}
              </p>
            )}

            {selectedDhikr.reference && (
              <p className="text-[11px] text-[#2D3436]/50 italic">
                المصدر: {selectedDhikr.reference}
              </p>
            )}
          </div>

          {/* Action buttons under Dhikr */}
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <button
              onClick={() => onOpenTadabbur(selectedDhikr.text)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#F9F7F2] hover:bg-[#EAE3D5]/50 text-[#2D5A27] border border-[#EAE3D5] text-xs font-semibold transition-all"
            >
              <Sparkles className="w-4 h-4 text-[#2D5A27]" />
              <span>تدبر وفهم معاني هذا الذكر</span>
            </button>

            <button
              onClick={() => onOpenCardGenerator(selectedDhikr)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#F9F7F2] hover:bg-[#EAE3D5]/50 text-[#2D5A27] border border-[#EAE3D5] text-xs font-semibold transition-all"
            >
              <span>بطاقة الذكر للمشاركة</span>
            </button>
          </div>

        </div>
      </div>

      {/* Main Interactive Digital Misbaha Sphere */}
      <div className="bg-white border border-[#EAE3D5] rounded-[40px] p-6 sm:p-10 shadow-sm text-center space-y-6 relative overflow-hidden">
        
        {/* Tree Planting Toast Banner */}
        {isTreeAnimating && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-[#2D5A27] text-white px-6 py-2.5 rounded-full shadow-lg border border-emerald-400 flex items-center gap-3 animate-bounce">
            <Trees className="w-6 h-6 text-emerald-200 animate-spin" />
            <span className="text-sm font-bold">هنيئاً لك! غُرست لك نخلة مباركة في الجنة 🌴</span>
          </div>
        )}

        {/* Completion Toast Banner */}
        {completionMessage && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-[#2D5A27] text-white px-6 py-2 rounded-full shadow-lg border border-emerald-400 flex items-center gap-2 text-sm font-bold">
            <CheckCircle2 className="w-5 h-5 text-emerald-200" />
            <span>{completionMessage}</span>
          </div>
        )}

        {/* Goal Selector Controls */}
        <div className="flex items-center justify-between gap-2 max-w-sm mx-auto bg-[#F9F7F2] p-1.5 rounded-full border border-[#EAE3D5] text-xs">
          <span className="text-[#2D3436]/70 pr-3 font-medium">الهدف:</span>
          {[33, 100, 1000, 0].map((goalOption) => (
            <button
              key={goalOption}
              onClick={() => setTargetGoal(goalOption)}
              className={`px-3.5 py-1.5 rounded-full font-mono font-bold transition-all ${
                targetGoal === goalOption
                  ? "bg-[#2D5A27] text-white shadow-sm"
                  : "text-[#2D3436]/70 hover:text-[#2D5A27] hover:bg-[#EAE3D5]/40"
              }`}
            >
              {goalOption === 0 ? "حر" : goalOption}
            </button>
          ))}
        </div>

        {/* Big Counter Ring / Circle */}
        <div className="relative flex justify-center items-center my-6">
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
            
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="42"
                className="text-[#F9F7F2] stroke-current"
                strokeWidth="7"
                fill="transparent"
              />
              {/* Animated Progress Circle */}
              {targetGoal > 0 && (
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="text-[#2D5A27] stroke-current transition-all duration-300 ease-out"
                  strokeWidth="7"
                  strokeDasharray={263.89}
                  strokeDashoffset={263.89 - (263.89 * progressPercent) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                />
              )}
            </svg>

            {/* Tap Inner Center */}
            <button
              onClick={handleCountIncrement}
              className={`absolute inset-4 sm:inset-5 rounded-full bg-[#FDFCF9] border-2 ${
                isTapRippling ? "border-[#2D5A27] scale-[0.98]" : "border-[#EAE3D5] hover:border-[#2D5A27] scale-100"
              } shadow-inner transition-all duration-150 flex flex-col items-center justify-center cursor-pointer select-none active:scale-95 group overflow-hidden`}
            >
              <span className="text-xs uppercase tracking-widest text-[#2D5A27] mb-1 font-sans font-medium">
                {targetGoal > 0 ? `الهدف ${targetGoal}` : "العداد الحر"}
              </span>

              {/* Main Count Number */}
              <span className="text-6xl sm:text-7xl font-light font-mono text-[#2D5A27]">
                {lapCount}
              </span>

              <span className="mt-2 text-xs text-[#2D3436]/60 group-hover:text-[#2D5A27] transition-colors bg-[#F9F7F2] px-3.5 py-1 rounded-full border border-[#EAE3D5]">
                انقر للتسبيح
              </span>
            </button>
          </div>
        </div>

        {/* Counter Action Controls */}
        <div className="flex items-center justify-center gap-3 flex-wrap pt-2">
          
          {/* Main Tap Button */}
          <button
            onClick={handleCountIncrement}
            className="px-8 py-3 bg-[#2D5A27] text-white rounded-full font-medium hover:bg-[#1E3D1A] transition-colors shadow-sm flex items-center gap-2 text-sm"
          >
            <span>انقر للتسبيح</span>
          </button>

          {/* Reset Button */}
          <button
            onClick={handleReset}
            className="px-8 py-3 bg-[#F9F7F2] text-[#2D5A27] rounded-full font-medium border border-[#EAE3D5] hover:bg-[#EAE3D5]/40 transition-colors flex items-center gap-2 text-sm"
          >
            <RotateCcw className="w-4 h-4" />
            <span>إعادة تعيين</span>
          </button>

          {/* Auto Count Toggle */}
          <button
            onClick={() => setAutoPlay(!autoPlay)}
            className={`px-6 py-3 rounded-full border text-sm font-medium transition-all shadow-sm flex items-center gap-2 ${
              autoPlay
                ? "bg-amber-600 border-amber-500 text-white animate-pulse"
                : "bg-[#F9F7F2] border-[#EAE3D5] text-[#2D5A27] hover:bg-[#EAE3D5]/40"
            }`}
          >
            {autoPlay ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-[#2D5A27]" />}
            <span>{autoPlay ? "إيقاف تلقائي" : "تسبيح تلقائي"}</span>
          </button>

          {/* Auto Speed Adjuster */}
          {autoPlay && (
            <div className="flex items-center gap-1.5 bg-[#F9F7F2] px-3 py-1.5 rounded-full border border-[#EAE3D5] text-xs">
              <span className="text-[#2D3436]/70">السرعة:</span>
              {[1500, 2000, 3000].map((speed) => (
                <button
                  key={speed}
                  onClick={() => setAutoSpeed(speed)}
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono transition-all ${
                    autoSpeed === speed ? "bg-[#2D5A27] text-white font-bold" : "text-[#2D3436]/60"
                  }`}
                >
                  {speed / 1000}ث
                </button>
              ))}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
