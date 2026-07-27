import React from "react";
import { Award, Flame, Share2, Sparkles, TrendingUp, Trees } from "lucide-react";
import { UserProgress } from "../types";
import { CATEGORY_LABELS } from "../data/adhkar";

interface GhirasGardenProps {
  progress: UserProgress;
  onOpenCardGenerator: () => void;
}

export const GhirasGarden: React.FC<GhirasGardenProps> = ({ progress, onOpenCardGenerator }) => {
  const treeCount = Math.min(progress.treesPlanted, 100);
  const categories = Object.entries(progress.categoryCounts)
    .map(([key, count]) => ({ key, count, label: CATEGORY_LABELS[key]?.title || key }))
    .sort((a, b) => b.count - a.count);
  const maxCategoryCount = Math.max(1, ...categories.map((item) => item.count));

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <section className="relative overflow-hidden bg-[#2D5A27] text-white rounded-[40px] p-7 sm:p-10 shadow-lg">
        <div className="absolute -left-16 -bottom-20 opacity-10"><Trees className="w-72 h-72" /></div>
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-center">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-xs font-bold">
              <Sparkles className="w-4 h-4" /> روضتك الرقمية للذكر
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold">غِرَاسُكَ فِي الجَنَّةِ</h2>
            <p className="text-emerald-100 max-w-2xl leading-relaxed">
              لوحة تحفيزية تعرض أثر المداومة والاستمرارية. كل مئة ذكر في التطبيق تُمثّل نخلة رمزية في الروضة.
            </p>
            <button onClick={onOpenCardGenerator} className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white text-[#2D5A27] font-bold text-sm">
              <Share2 className="w-4 h-4" /> مشاركة بطاقة ذكر
            </button>
          </div>
          <div className="w-48 h-48 rounded-full bg-white/10 border border-white/20 flex flex-col items-center justify-center shadow-inner">
            <Trees className="w-12 h-12 text-emerald-200" />
            <strong className="text-5xl font-mono mt-2">{progress.treesPlanted}</strong>
            <span className="text-xs text-emerald-100">نخلة رمزية</span>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#EAE3D5] rounded-[28px] p-5 flex items-center gap-4">
          <div className="p-3 rounded-full bg-amber-50"><Flame className="w-6 h-6 text-amber-600" /></div>
          <div><p className="text-xs text-[#2D3436]/60">الاستمرارية</p><strong className="text-2xl text-[#2D5A27]">{progress.dailyStreak} يوم</strong></div>
        </div>
        <div className="bg-white border border-[#EAE3D5] rounded-[28px] p-5 flex items-center gap-4">
          <div className="p-3 rounded-full bg-emerald-50"><TrendingUp className="w-6 h-6 text-[#2D5A27]" /></div>
          <div><p className="text-xs text-[#2D3436]/60">إجمالي الذكر</p><strong className="text-2xl text-[#2D5A27]">{progress.totalCount.toLocaleString("ar")}</strong></div>
        </div>
        <div className="bg-white border border-[#EAE3D5] rounded-[28px] p-5 flex items-center gap-4">
          <div className="p-3 rounded-full bg-purple-50"><Award className="w-6 h-6 text-purple-700" /></div>
          <div><p className="text-xs text-[#2D3436]/60">ذكر اليوم</p><strong className="text-2xl text-[#2D5A27]">{progress.todayCount.toLocaleString("ar")}</strong></div>
        </div>
      </section>

      <section className="bg-white border border-[#EAE3D5] rounded-[40px] p-6 sm:p-8 shadow-sm space-y-5">
        <div>
          <h3 className="text-xl font-serif font-bold text-[#2D5A27]">روضتك المباركة</h3>
          <p className="text-xs text-[#2D3436]/60">يظهر هنا أول مئة غرسة رمزية من إنجازك.</p>
        </div>
        {treeCount === 0 ? (
          <div className="text-center py-12 bg-[#F9F7F2] rounded-[28px] border border-dashed border-[#EAE3D5]">
            <Trees className="w-14 h-14 text-[#2D5A27]/30 mx-auto" />
            <p className="mt-3 font-bold text-[#2D5A27]">ابدأ الذكر لتنبت أول نخلة في روضتك</p>
          </div>
        ) : (
          <div className="grid grid-cols-4 sm:grid-cols-8 md:grid-cols-10 gap-3 bg-[#F9F7F2] rounded-[28px] p-4">
            {Array.from({ length: treeCount }, (_, index) => (
              <div key={index} className="aspect-square bg-white border border-[#EAE3D5] rounded-2xl flex flex-col items-center justify-center shadow-sm">
                <Trees className="w-6 h-6 text-[#2D5A27]" />
                <span className="text-[9px] font-mono text-[#2D5A27]">#{index + 1}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="bg-white border border-[#EAE3D5] rounded-[40px] p-6 sm:p-8 shadow-sm space-y-5">
        <h3 className="text-lg font-serif font-bold text-[#2D5A27] flex items-center gap-2"><TrendingUp className="w-5 h-5" /> توزيع الذكر حسب الأبواب</h3>
        <div className="space-y-4">
          {categories.map((item) => (
            <div key={item.key} className="space-y-1.5">
              <div className="flex justify-between text-xs"><span>{item.label}</span><strong>{item.count.toLocaleString("ar")}</strong></div>
              <div className="h-2 rounded-full bg-[#F9F7F2] overflow-hidden">
                <div className="h-full rounded-full bg-[#2D5A27]" style={{ width: `${(item.count / maxCategoryCount) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
