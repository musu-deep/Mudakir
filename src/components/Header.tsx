import React, { useState } from "react";
import {
  BookOpen,
  CircleCheck,
  Flame,
  Image as ImageIcon,
  Settings,
  Sparkles,
  Trees,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { AudioSettings, UserProgress } from "../types";
import { saveAudioSettings } from "../utils/storage";

interface HeaderProps {
  progress: UserProgress;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  audioSettings: AudioSettings;
  setAudioSettings: React.Dispatch<React.SetStateAction<AudioSettings>>;
}

const navItems = [
  { id: "misbaha", label: "المسبحة", icon: CircleCheck },
  { id: "garden", label: "روضتي", icon: Trees },
  { id: "library", label: "مكتبة الأذكار", icon: BookOpen },
  { id: "ai_guide", label: "مُعين الذاكر", icon: Sparkles },
  { id: "posters", label: "بطاقات الذكر", icon: ImageIcon },
];

export const Header: React.FC<HeaderProps> = ({
  progress,
  activeTab,
  setActiveTab,
  audioSettings,
  setAudioSettings,
}) => {
  const [settingsOpen, setSettingsOpen] = useState(false);

  const updateAudio = (patch: Partial<AudioSettings>) => {
    const next = { ...audioSettings, ...patch };
    setAudioSettings(next);
    saveAudioSettings(next);
  };

  const hijriDate = new Date().toLocaleDateString("ar-SA-u-ca-islamic-umalqura", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#FDFCF9]/95 backdrop-blur-md border-b border-[#EAE3D5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 space-y-3">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-3">
            <button onClick={() => setActiveTab("misbaha")} className="flex items-center gap-3 text-right">
              <div className="w-11 h-11 rounded-full bg-[#2D5A27] flex items-center justify-center text-white shadow-sm">
                <Trees className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-[#2D5A27] font-serif">غِرَاسُ الجَنَّةِ</h1>
                  <span className="hidden sm:inline text-[10px] px-2 py-0.5 rounded-full bg-[#EAE3D5]/60 text-[#2D5A27]">تمكين الذاكرين</span>
                </div>
                <p className="text-[11px] text-[#2D3436]/60">{hijriDate}</p>
              </div>
            </button>

            <div className="flex items-center gap-2 flex-wrap justify-center">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F9F7F2] border border-[#EAE3D5] text-xs">
                <Flame className="w-4 h-4 text-amber-600" />
                <span>الاستمرارية</span><strong className="text-[#2D5A27]">{progress.dailyStreak}</strong>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#2D5A27] text-white text-xs">
                <Trees className="w-4 h-4 text-emerald-200" />
                <span>الغراس</span><strong>{progress.treesPlanted}</strong>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F9F7F2] border border-[#EAE3D5] text-xs">
                <CircleCheck className="w-4 h-4 text-[#2D5A27]" />
                <span>اليوم</span><strong className="text-[#2D5A27]">{progress.todayCount}</strong>
              </div>
              <button
                onClick={() => updateAudio({ soundEnabled: !audioSettings.soundEnabled })}
                className="p-2 rounded-full bg-[#F9F7F2] border border-[#EAE3D5] text-[#2D5A27]"
                aria-label={audioSettings.soundEnabled ? "كتم الصوت" : "تشغيل الصوت"}
              >
                {audioSettings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
              <button onClick={() => setSettingsOpen(true)} className="p-2 rounded-full bg-[#F9F7F2] border border-[#EAE3D5] text-[#2D5A27]" aria-label="الإعدادات">
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>

          <nav className="flex gap-2 overflow-x-auto pb-1" aria-label="أقسام التطبيق">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${activeTab === id ? "bg-[#2D5A27] text-white shadow-sm" : "bg-white border border-[#EAE3D5] text-[#2D5A27] hover:bg-[#F9F7F2]"}`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {settingsOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <section className="bg-white rounded-[36px] border border-[#EAE3D5] shadow-2xl w-full max-w-md p-6 relative space-y-5">
            <button onClick={() => setSettingsOpen(false)} className="absolute top-4 left-4 p-2 rounded-full bg-[#F9F7F2] border border-[#EAE3D5]" aria-label="إغلاق">
              <X className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-xl font-serif font-bold text-[#2D5A27]">إعدادات الصوت واللمس</h2>
              <p className="text-xs text-[#2D3436]/60">خصص تجربة المسبحة حسب راحتك.</p>
            </div>

            <label className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-[#F9F7F2] border border-[#EAE3D5]">
              <span className="font-bold text-sm">الصوت</span>
              <input type="checkbox" checked={audioSettings.soundEnabled} onChange={(event) => updateAudio({ soundEnabled: event.target.checked })} />
            </label>

            <label className="block space-y-2 p-4 rounded-2xl bg-[#F9F7F2] border border-[#EAE3D5]">
              <span className="font-bold text-sm">مستوى الصوت: {Math.round(audioSettings.volume * 100)}%</span>
              <input className="w-full accent-[#2D5A27]" type="range" min="0" max="1" step="0.05" value={audioSettings.volume} onChange={(event) => updateAudio({ volume: Number(event.target.value) })} />
            </label>

            <label className="block space-y-2 p-4 rounded-2xl bg-[#F9F7F2] border border-[#EAE3D5]">
              <span className="font-bold text-sm">نوع النغمة</span>
              <select value={audioSettings.soundType} onChange={(event) => updateAudio({ soundType: event.target.value as AudioSettings["soundType"] })} className="w-full rounded-xl bg-white border border-[#EAE3D5] p-2">
                <option value="bead">صوت خرزة</option>
                <option value="soft_click">نقرة خفيفة</option>
                <option value="tone">نغمة هادئة</option>
                <option value="silent">صامت</option>
              </select>
            </label>

            <label className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-[#F9F7F2] border border-[#EAE3D5]">
              <span className="font-bold text-sm">اهتزاز اللمس</span>
              <input type="checkbox" checked={audioSettings.hapticEnabled} onChange={(event) => updateAudio({ hapticEnabled: event.target.checked })} />
            </label>
          </section>
        </div>
      )}
    </>
  );
};
