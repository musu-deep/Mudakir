import React, { useState } from "react";
import {
  Trees,
  Flame,
  Volume2,
  VolumeX,
  Sparkles,
  BookOpen,
  Image as ImageIcon,
  Compass,
  CircleCheck,
  Settings,
  X,
  Smartphone
} from "lucide-react";
import { UserProgress, AudioSettings } from "../types";
import { saveAudioSettings } from "../utils/storage";

interface HeaderProps {
  progress: UserProgress;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  audioSettings: AudioSettings;
  setAudioSettings: React.Dispatch<React.SetStateAction<AudioSettings>>;
}

export const Header: React.FC<HeaderProps> = ({
  progress,
  activeTab,
  setActiveTab,
  audioSettings,
  setAudioSettings,
}) => {
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Format today's date in Arabic locale with Hijri approximation
  const todayDateStr = new Date().toLocaleDateString("ar-SA-u-ca-islamic-umalqura", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const gregDateStr = new Date().toLocaleDateString("ar-EG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const handleSoundToggle = () => {
    const updated = { ...audioSettings, soundEnabled: !audioSettings.soundEnabled };
    setAudioSettings(updated);
    saveAudioSettings(updated);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FDFCF9]/90 backdrop-blur-md border-b border-[#EAE3D5] text-[#2D3436]">
      {/* Top Banner Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#2D5A27] flex items-center justify-center text-white shadow-sm shrink-0">
              <Trees className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-[#2D5A27] font-serif">
                  غِرَاسُ الجَنَّةِ
                </h1>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#EAE3D5]/60 text-[#2D5A27] border border-[#EAE3D5] font-semibold">
                  تمكين الذاكرين
                </span>
              </div>
              <p className="text-xs text-[#2D3436]/60 font-sans">
                {todayDateStr} • <span className="opacity-80">{gregDateStr}</span>
              </p>
            </div>
          </div>

          {/* Quick Spiritual Stats Badges */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
            {/* Daily Streak */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F9F7F2] border border-[#EAE3D5] text-[#2D3436] text-xs font-medium shadow-sm">
              <Flame className="w-4 h-4 text-amber-600 fill-amber-500/20" />
              <span>أيام متتالية:</span>
              <strong className="text-[#2D5A27] font-mono text-sm">{progress.dailyStreak}</strong>
            </div>

            {/* Trees Planted in Jannah */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#2D5A27] text-white text-xs font-medium shadow-sm">
              <Trees className="w-4 h-4 text-emerald-200" />
              <span>أشجار الجنة:</span>
              <strong className="font-mono text-sm">{progress.treesPlanted}</strong>
            </div>

            {/* Today Tasbeehat */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F9F7F2] border border-[#EAE3D5] text-[#2D3436] text-xs font-medium shadow-sm">
              <CircleCheck className="w-4 h-4 text-[#2D5A27]" />
              <span>ذكر اليوم:</span>
              <strong className="text-[#2D5A27] font-mono text-sm">{progress.todayCount}</strong>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={handleSoundToggle}
              title={audioSettings.soundEnabled ? "كتم الصوت" : "تفعيل الصوت"}
              className={`p-2 rounded-full border transition-all ${
                audioSettings.soundEnabled
                  ? "bg-[#2D5A27]/10 border-[#2D5A27]/30 text-[#2D5A27] hover:bg-[#2D5A27]/20"
                  : "bg-[#F9F7F2] border-[#EAE3D5] text-stone-400 hover:bg-[#EAE3D5]/50"
              }`}
            >
              {audioSettings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Audio Settings Modal Launcher */}
            <button
              onClick={() => setShowSettingsModal(true)}
              title="إعدادات الصوت واللمس"
              className="p-2 rounded-full bg-[#F9F7F2] border border-[#EAE3D5] text-[#2D5A27] hover:bg-[#EAE3D5]/50 transition-all"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center justify-center sm:justify-start gap-1 sm:gap-2 mt-4 pt-2 border-t border-[#EAE3D5] overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("misbaha")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === "misbaha"
                ? "bg-[#2D5A27] text-white shadow-sm"
                : "text-[#2D3436]/70 hover:text-[#2D5A27] hover:bg-[#EAE3D5]/40"
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>المسبحة الذكية</span>
          </button>

          <button
            onClick={() => setActiveTab("garden")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === "garden"
                ? "bg-[#2D5A27] text-white shadow-sm"
                : "text-[#2D3436]/70 hover:text-[#2D5A27] hover:bg-[#EAE3D5]/40"
            }`}
          >
            <Trees className="w-4 h-4" />
            <span>روضة غراس الجنة</span>
          </button>

          <button
            onClick={() => setActiveTab("library")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === "library"
                ? "bg-[#2D5A27] text-white shadow-sm"
                : "text-[#2D3436]/70 hover:text-[#2D5A27] hover:bg-[#EAE3D5]/40"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>فهرس الأذكار</span>
          </button>

          <button
            onClick={() => setActiveTab("ai_guide")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === "ai_guide"
                ? "bg-[#2D5A27] text-white shadow-sm"
                : "text-[#2D3436]/70 hover:text-[#2D5A27] hover:bg-[#EAE3D5]/40"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>مُعين الذاكر (تدبر)</span>
          </button>

          <button
            onClick={() => setActiveTab("posters")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === "posters"
                ? "bg-[#2D5A27] text-white shadow-sm"
                : "text-[#2D3436]/70 hover:text-[#2D5A27] hover:bg-[#EAE3D5]/40"
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>بطاقة الذكر والمشاركة</span>
          </button>

          <button
            onClick={() => setActiveTab("mobile_app")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === "mobile_app"
                ? "bg-[#2D5A27] text-white shadow-sm"
                : "bg-[#2D5A27]/10 text-[#2D5A27] hover:bg-[#2D5A27]/20 border border-[#2D5A27]/20"
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>تثبيت التطبيق للجوال</span>
          </button>
        </nav>
      </div>

      {/* Audio & Tactile Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#EAE3D5] rounded-[32px] max-w-md w-full p-6 shadow-2xl text-[#2D3436] relative">
            <button
              onClick={() => setShowSettingsModal(false)}
              className="absolute top-4 left-4 p-1.5 rounded-full text-stone-400 hover:text-[#2D5A27] hover:bg-[#F9F7F2]"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-[#2D5A27] mb-4 flex items-center gap-2 font-serif">
              <Settings className="w-5 h-5" />
              إعدادات الصوت واللمس للمسبحة
            </h3>

            <div className="space-y-4 text-sm">
              {/* Sound Toggle */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-[#F9F7F2] border border-[#EAE3D5]">
                <span>تفعيل أصل الصوت</span>
                <button
                  onClick={handleSoundToggle}
                  className={`px-3.5 py-1 rounded-full text-xs font-bold transition-all ${
                    audioSettings.soundEnabled
                      ? "bg-[#2D5A27] text-white"
                      : "bg-stone-300 text-stone-600"
                  }`}
                >
                  {audioSettings.soundEnabled ? "مفعل" : "معطل"}
                </button>
              </div>

              {/* Sound Type Selection */}
              <div className="space-y-2">
                <label className="block text-xs text-[#2D3436]/70 font-medium">نغمة النقرة عند التسبيح:</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => {
                      const updated = { ...audioSettings, soundType: "bead" as const };
                      setAudioSettings(updated);
                      saveAudioSettings(updated);
                    }}
                    className={`py-2 px-3 rounded-2xl border text-xs text-center transition-all ${
                      audioSettings.soundType === "bead"
                        ? "bg-[#2D5A27] border-[#2D5A27] text-white font-bold shadow-sm"
                        : "bg-[#F9F7F2] border-[#EAE3D5] text-[#2D3436]"
                    }`}
                  >
                    حبة خشبية
                  </button>
                  <button
                    onClick={() => {
                      const updated = { ...audioSettings, soundType: "soft_click" as const };
                      setAudioSettings(updated);
                      saveAudioSettings(updated);
                    }}
                    className={`py-2 px-3 rounded-2xl border text-xs text-center transition-all ${
                      audioSettings.soundType === "soft_click"
                        ? "bg-[#2D5A27] border-[#2D5A27] text-white font-bold shadow-sm"
                        : "bg-[#F9F7F2] border-[#EAE3D5] text-[#2D3436]"
                    }`}
                  >
                    نقرة هادئة
                  </button>
                  <button
                    onClick={() => {
                      const updated = { ...audioSettings, soundType: "tone" as const };
                      setAudioSettings(updated);
                      saveAudioSettings(updated);
                    }}
                    className={`py-2 px-3 rounded-2xl border text-xs text-center transition-all ${
                      audioSettings.soundType === "tone"
                        ? "bg-[#2D5A27] border-[#2D5A27] text-white font-bold shadow-sm"
                        : "bg-[#F9F7F2] border-[#EAE3D5] text-[#2D3436]"
                    }`}
                  >
                    نغمة خفيفة
                  </button>
                </div>
              </div>

              {/* Haptic Toggle */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-[#F9F7F2] border border-[#EAE3D5]">
                <span>الاهتزاز والتغذية اللمسية (للجوال):</span>
                <button
                  onClick={() => {
                    const updated = { ...audioSettings, hapticEnabled: !audioSettings.hapticEnabled };
                    setAudioSettings(updated);
                    saveAudioSettings(updated);
                  }}
                  className={`px-3.5 py-1 rounded-full text-xs font-bold transition-all ${
                    audioSettings.hapticEnabled
                      ? "bg-[#2D5A27] text-white"
                      : "bg-stone-300 text-stone-600"
                  }`}
                >
                  {audioSettings.hapticEnabled ? "مفعل" : "معطل"}
                </button>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={() => setShowSettingsModal(false)}
                className="px-6 py-2.5 rounded-full bg-[#2D5A27] hover:bg-[#1E3D1A] text-white font-bold text-sm transition-all shadow-sm"
              >
                حفظ وإغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
