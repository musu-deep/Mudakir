import React, { useState, useRef } from "react";
import {
  Download,
  Share2,
  Trees,
  Sparkles,
  Check,
  X,
  Palette
} from "lucide-react";
import { DhikrItem } from "../types";

interface CardPosterGeneratorProps {
  dhikrItem?: DhikrItem;
  onClose?: () => void;
  isEmbeddedView?: boolean;
}

export const CardPosterGenerator: React.FC<CardPosterGeneratorProps> = ({
  dhikrItem,
  onClose,
  isEmbeddedView = false,
}) => {
  const [themeStyle, setThemeStyle] = useState<"emerald_gold" | "sapphire_silver" | "sand_amber">("emerald_gold");
  const [dedicationText, setDedicationText] = useState("صدقة جارية ونفعاً للذاكرين");
  const [isCopied, setIsCopied] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);

  const defaultItemText = dhikrItem?.text || "سُبْحَانَ اللهِ عَدَدَ مَا خَلَقَ فِي السَّمَاءِ، سُبْحَانَ اللهِ عَدَدَ مَا خَلَقَ فِي الأَرْضِ، سُبْحَانَ اللهِ عَدَدَ مَا بَيْنَ ذٰلِكَ، سُبْحَانَ اللهِ عَدَدَ مَا هُوَ خَالِقٌ";
  const defaultReward = dhikrItem?.rewardDescription || "غِرَاسُ الجَنَّةِ وَالذِّكْرُ المُضَاعَفُ";
  const defaultVirtue = dhikrItem?.virtue || "من الأذكار الجامعة التي تزن ساعات من التسبيح والتحميد.";

  const themeClasses = {
    emerald_gold: {
      bg: "bg-gradient-to-br from-[#2D5A27] via-[#23461F] to-[#1E3D1A] border-[#EAE3D5]",
      accent: "text-amber-200",
      border: "border-amber-200/40",
      titleBg: "bg-white/10 border-white/20 text-white",
    },
    sapphire_silver: {
      bg: "bg-gradient-to-br from-[#FDFCF9] via-[#F9F7F2] to-[#EAE3D5] border-[#2D5A27]",
      accent: "text-[#2D5A27]",
      border: "border-[#2D5A27]/30",
      titleBg: "bg-[#2D5A27] border-[#2D5A27] text-white",
    },
    sand_amber: {
      bg: "bg-gradient-to-br from-[#EAE3D5] via-[#F9F7F2] to-[#FDFCF9] border-[#2D5A27]",
      accent: "text-[#2D5A27]",
      border: "border-[#2D5A27]/30",
      titleBg: "bg-[#2D5A27] border-[#2D5A27] text-white",
    },
  };

  const currentTheme = themeClasses[themeStyle];

  const handleCopyText = () => {
    const textToShare = `✨ *${defaultReward}* ✨\n\n"${defaultItemText}"\n\n💡 *الفضل*: ${defaultVirtue}\n\n🌿 ${dedicationText}\nتمت المشاركة عبر تطبيق غراس الجنة 🌴`;
    navigator.clipboard.writeText(textToShare);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const contentUI = (
    <div className="space-y-6">
      
      {/* Header Controls */}
      <div className="bg-white border border-[#EAE3D5] p-6 sm:p-8 rounded-[40px] shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-serif text-[#2D5A27] flex items-center gap-2">
            <Palette className="w-5 h-5 text-[#2D5A27]" />
            تَوْلِيدُ بَطَاقَاتِ الأَذْكَارِ لِلْمُشَارَكَةِ
          </h2>
          <p className="text-xs text-[#2D3436]/70 font-sans">
            صمم بطاقة ذِكْرٍ أنيقة للنشر والمشاركة مع الأهل والأصدقاء بنية الصدقة الجارية.
          </p>
        </div>

        {/* Theme Picker */}
        <div className="flex items-center gap-2 bg-[#F9F7F2] p-1.5 rounded-full border border-[#EAE3D5] text-xs">
          <button
            onClick={() => setThemeStyle("emerald_gold")}
            className={`px-3.5 py-1.5 rounded-full font-medium transition-all ${
              themeStyle === "emerald_gold" ? "bg-[#2D5A27] text-white font-bold shadow-sm" : "text-[#2D3436]/70"
            }`}
          >
            خضراء وذهب
          </button>
          <button
            onClick={() => setThemeStyle("sapphire_silver")}
            className={`px-3.5 py-1.5 rounded-full font-medium transition-all ${
              themeStyle === "sapphire_silver" ? "bg-[#2D5A27] text-white font-bold shadow-sm" : "text-[#2D3436]/70"
            }`}
          >
            عاجية ورزمرد
          </button>
          <button
            onClick={() => setThemeStyle("sand_amber")}
            className={`px-3.5 py-1.5 rounded-full font-medium transition-all ${
              themeStyle === "sand_amber" ? "bg-[#2D5A27] text-white font-bold shadow-sm" : "text-[#2D3436]/70"
            }`}
          >
            رملية وذهب
          </button>
        </div>
      </div>

      {/* Dedication Input */}
      <div className="bg-[#F9F7F2] p-4 rounded-2xl border border-[#EAE3D5] flex items-center gap-3">
        <span className="text-xs text-[#2D5A27] font-bold shrink-0">نص الإهداء/الصدقة:</span>
        <input
          type="text"
          value={dedicationText}
          onChange={(e) => setDedicationText(e.target.value)}
          placeholder="مثال: صدقة جارية عن والديّ الكرام"
          className="w-full bg-white border border-[#EAE3D5] rounded-full px-4 py-2 text-xs text-[#2D3436] focus:outline-none focus:border-[#2D5A27]"
        />
      </div>

      {/* Live Card Preview */}
      <div className="flex justify-center my-4">
        <div
          ref={cardRef}
          className={`w-full max-w-lg p-8 sm:p-10 rounded-[36px] border-2 shadow-sm relative overflow-hidden text-center space-y-6 ${currentTheme.bg}`}
        >
          {/* Subtle Corner Ornaments */}
          <div className="absolute top-3 right-4 text-amber-500/50 text-xs font-serif">❖ ﷽ ❖</div>
          <div className="absolute top-3 left-4 text-amber-500/50 text-xs font-serif">❖ 🌴 ❖</div>

          {/* Title Header Banner */}
          <div className={`inline-block px-6 py-2 rounded-full border ${currentTheme.titleBg} shadow-sm`}>
            <h3 className="text-xl font-black font-serif tracking-wider">
              غِرَاسُ الجَنَّةِ
            </h3>
          </div>

          {/* Main Dhikr Content Box */}
          <div className={`p-6 rounded-[28px] bg-white/10 backdrop-blur-sm border ${currentTheme.border} shadow-inner space-y-3`}>
            <p className="text-xl sm:text-2xl font-extrabold font-serif leading-relaxed">
              {defaultItemText}
            </p>
          </div>

          {/* Virtue & Reward Box */}
          <div className="space-y-1 text-xs">
            <span className={`inline-flex items-center gap-1.5 font-bold ${currentTheme.accent}`}>
              <Trees className="w-4 h-4" />
              {defaultReward}
            </span>
            <p className="font-sans text-[11px] leading-relaxed max-w-sm mx-auto opacity-90">
              {defaultVirtue}
            </p>
          </div>

          {/* Dedication Footer */}
          <div className="pt-4 border-t border-white/20 flex items-center justify-between text-[11px] opacity-80">
            <span>{dedicationText}</span>
            <span className="font-serif">تطبيق غراس الجنة</span>
          </div>
        </div>
      </div>

      {/* Sharing Buttons */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={handleCopyText}
          className="flex items-center gap-2 px-8 py-3 rounded-full bg-[#2D5A27] hover:bg-[#1E3D1A] text-white font-bold text-xs shadow-sm transition-all"
        >
          {isCopied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
          <span>{isCopied ? "تم نسخ نص البطاقة!" : "نسخ بطاقة الذكر للمشاركة"}</span>
        </button>
      </div>

    </div>
  );

  if (isEmbeddedView) {
    return <div className="max-w-4xl mx-auto">{contentUI}</div>;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-[#EAE3D5] rounded-[40px] max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative text-[#2D3436]">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-2 rounded-full bg-[#F9F7F2] text-stone-400 hover:text-[#2D5A27] border border-[#EAE3D5]"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        {contentUI}
      </div>
    </div>
  );
};
