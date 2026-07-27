import React, { useState } from "react";
import { Check, Copy, Palette, Share2, Sparkles, Trees, X } from "lucide-react";
import { DhikrItem } from "../types";

interface CardPosterGeneratorProps {
  dhikrItem?: DhikrItem;
  onClose?: () => void;
  isEmbeddedView?: boolean;
}

type ThemeName = "emerald" | "ivory" | "sand";

export const CardPosterGenerator: React.FC<CardPosterGeneratorProps> = ({
  dhikrItem,
  onClose,
  isEmbeddedView = false,
}) => {
  const [theme, setTheme] = useState<ThemeName>("emerald");
  const [dedication, setDedication] = useState("صدقة جارية ونفعاً للذاكرين");
  const [copied, setCopied] = useState(false);

  const text = dhikrItem?.text || "سُبْحَانَ اللهِ وَبِحَمْدِهِ، عَدَدَ خَلْقِهِ، وَرِضَا نَفْسِهِ، وَزِنَةَ عَرْشِهِ، وَمِدَادَ كَلِمَاتِهِ";
  const reward = dhikrItem?.rewardDescription || "غِرَاسُ الجَنَّةِ وَالذِّكْرُ المُضَاعَفُ";
  const virtue = dhikrItem?.virtue || "ذكر جامع مبارك يوقظ القلب ويعظم صلته بالله.";

  const themes: Record<ThemeName, string> = {
    emerald: "bg-gradient-to-br from-[#2D5A27] via-[#23461F] to-[#142D12] text-white",
    ivory: "bg-gradient-to-br from-white via-[#F9F7F2] to-[#EAE3D5] text-[#2D3436]",
    sand: "bg-gradient-to-br from-[#EFE3CA] via-[#FDF8EE] to-[#D9C39A] text-[#2D3436]",
  };

  const shareText = `✨ ${reward}\n\n${text}\n\n${virtue}\n\n🌿 ${dedication}\nغراس الجنة — تمكين الذاكرين`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareText);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: "بطاقة ذكر", text: shareText });
    } else {
      await handleCopy();
    }
  };

  const content = (
    <div className="space-y-6">
      <section className="bg-white border border-[#EAE3D5] p-6 rounded-[32px] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold font-serif text-[#2D5A27] flex items-center gap-2">
              <Palette className="w-5 h-5" />
              بطاقات الأذكار للمشاركة
            </h2>
            <p className="text-xs text-[#2D3436]/70">اختر النمط، أضف الإهداء، ثم انسخ البطاقة أو شاركها.</p>
          </div>
          <div className="flex gap-2 text-xs">
            {(["emerald", "ivory", "sand"] as ThemeName[]).map((name) => (
              <button
                key={name}
                onClick={() => setTheme(name)}
                className={`px-3 py-2 rounded-full border ${theme === name ? "bg-[#2D5A27] text-white border-[#2D5A27]" : "bg-[#F9F7F2] border-[#EAE3D5]"}`}
              >
                {name === "emerald" ? "زمردي" : name === "ivory" ? "عاجي" : "رملي"}
              </button>
            ))}
          </div>
        </div>
        <input
          value={dedication}
          onChange={(event) => setDedication(event.target.value)}
          className="w-full rounded-full bg-[#F9F7F2] border border-[#EAE3D5] px-4 py-3 text-sm focus:outline-none focus:border-[#2D5A27]"
          placeholder="نص الإهداء"
        />
      </section>

      <article className={`${themes[theme]} relative overflow-hidden rounded-[40px] min-h-[480px] p-8 sm:p-12 flex flex-col justify-between text-center border shadow-xl`}>
        <div className="absolute inset-0 opacity-10" aria-hidden="true">
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full border-[28px] border-current" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full border-[32px] border-current" />
        </div>
        <div className="relative z-10 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-current/30 bg-white/10 px-4 py-2 text-xs font-bold">
            <Trees className="w-4 h-4" />
            {reward}
          </span>
        </div>
        <div className="relative z-10 space-y-6">
          <Sparkles className="w-7 h-7 mx-auto opacity-80" />
          <p className="font-serif text-2xl sm:text-4xl leading-loose font-bold">{text}</p>
          <p className="text-sm leading-relaxed opacity-80 max-w-xl mx-auto">{virtue}</p>
        </div>
        <div className="relative z-10 pt-5 border-t border-current/20">
          <p className="font-bold">{dedication}</p>
          <p className="text-xs opacity-70 mt-2">غراس الجنة • تمكين الذاكرين</p>
        </div>
      </article>

      <div className="flex justify-center gap-3 flex-wrap">
        <button onClick={handleCopy} className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#F9F7F2] border border-[#EAE3D5] text-[#2D5A27] font-bold text-sm">
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? "تم النسخ" : "نسخ النص"}
        </button>
        <button onClick={handleShare} className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#2D5A27] text-white font-bold text-sm">
          <Share2 className="w-4 h-4" />
          مشاركة البطاقة
        </button>
      </div>
    </div>
  );

  if (isEmbeddedView) return <div className="max-w-4xl mx-auto">{content}</div>;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm overflow-y-auto p-4">
      <div className="max-w-4xl mx-auto bg-[#FDFCF9] rounded-[40px] p-5 sm:p-8 relative shadow-2xl">
        {onClose && (
          <button onClick={onClose} className="absolute top-4 left-4 z-20 p-2 rounded-full bg-white border border-[#EAE3D5]" aria-label="إغلاق">
            <X className="w-5 h-5" />
          </button>
        )}
        {content}
      </div>
    </div>
  );
};
