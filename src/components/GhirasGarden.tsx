import React from "react";
import {
  Trees,
  Flame,
  Sparkles,
  Award,
  CircleCheck,
  TrendingUp,
  Share2,
  BookOpen
} from "lucide-react";
import { UserProgress } from "../types";
import { CATEGORY_LABELS } from "../data/adhkar";

interface GhirasGardenProps {
  progress: UserProgress;
  onOpenCardGenerator: () => void;
}

export const GhirasGarden: React.FC<GhirasGardenProps> = ({
  progress,
  onOpenCardGenerator,
}) => {
  const treeCount = progress.treesPlanted;
  const totalCount = progress.totalCount;

  // Generate visual array for trees
  const maxDisplayTrees = Math.min(100, Math.max(1, treeCount));
  const treeArray = Array.from({ length: maxDisplayTrees }, (_, i) => i + 1);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      
      {/* Hero Spiritual Garden Header */}
      <div className="relative rounded-[40px] bg-white p-6 sm:p-10 border border-[#EAE3D5] shadow-sm text-center sm:text-right overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EAE3D5]/50 border border-[#EAE3D5] text-[#2D5A27] text-xs font-semibold">
              <Trees className="w-4 h-4 text-[#2D5A27]" />
              <span>حديث الشجرة والنخلة في الجنة</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#2D5A27]">
              رَوْضَةُ غِرَاسِ الجَنَّةِ وَمَزْرَعَةُ الآخِرَةِ
            </h2>
            
            <p className="text-xs sm:text-sm text-[#2D3436]/75 font-sans leading-relaxed">
              عَنْ نَبِيِّنَا مُحَمَّدٍ ﷺ: «مَنْ قَالَ: سُبْحَانَ اللهِ الْعَظِيمِ وَبِحَمْدِهِ؛ غُرِسَتْ لَهُ نَخْلَةٌ فِي الْجَنَّةِ».
              كل 100 تسبيحة أتممتها تزرع لك نخلة مباركة وثمرة باقية في جنتك بأذن الله تعالى.
            </p>
          </div>

          {/* Big Trees Counter Badge */}
          <div className="shrink-0 bg-[#2D5A27] text-white border border-[#2D5A27] rounded-[32px] p-6 text-center shadow-sm w-48">
            <Trees className="w-10 h-10 text-emerald-200 mx-auto" />
            <span className="block text-3xl font-black font-mono text-white mt-2">
              {treeCount}
            </span>
            <span className="text-xs text-emerald-100 font-serif">نَخْلَةٌ فَي الجَنَّةِ</span>
          </div>
        </div>
      </div>

      {/* Visual Garden Palms Grid */}
      <div className="bg-white border border-[#EAE3D5] rounded-[40px] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between gap-4 border-b border-[#EAE3D5] pb-4">
          <div>
            <h3 className="text-lg font-bold text-[#2D5A27] font-serif flex items-center gap-2">
              <Trees className="w-5 h-5 text-[#2D5A27]" />
              أشجار بستانك الأخروي (غراسك)
            </h3>
            <p className="text-xs text-[#2D3436]/60 font-sans">
              تمت زراعة {treeCount} نخلة وشجرة حتى الآن عبر مداومتك على التسبيح والذكر.
            </p>
          </div>

          <button
            onClick={onOpenCardGenerator}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#F9F7F2] hover:bg-[#EAE3D5]/50 text-[#2D5A27] border border-[#EAE3D5] text-xs font-semibold transition-all"
          >
            <Share2 className="w-4 h-4 text-[#2D5A27]" />
            <span>مشاركة البستان</span>
          </button>
        </div>

        {/* Trees Display Grid */}
        {treeCount === 0 ? (
          <div className="text-center py-12 px-4 space-y-3 bg-[#F9F7F2] rounded-[32px] border border-dashed border-[#EAE3D5]">
            <Trees className="w-12 h-12 text-[#2D3436]/40 mx-auto" />
            <h4 className="text-base font-bold text-[#2D5A27]">بستانك يناديك لغرس أول نخلة!</h4>
            <p className="text-xs text-[#2D3436]/60 max-w-md mx-auto">
              ابدأ الآن بسبعين أو مئة تسبيحة من "سبحان الله العظيم وبحمده" لتشاهد أول نخلة تنبت في روضتك المباركة.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-10 gap-3 p-4 bg-[#F9F7F2] rounded-[32px] border border-[#EAE3D5] max-h-96 overflow-y-auto">
            {treeArray.map((num) => (
              <div
                key={num}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-[#EAE3D5] hover:border-[#2D5A27] transition-all hover:scale-105 shadow-sm group"
                title={`نخلة رقم ${num} غُرست بحمد الله`}
              >
                <Trees className="w-7 h-7 text-[#2D5A27]" />
                <span className="text-[10px] font-mono text-[#2D5A27] mt-1 font-bold">#{num}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Categories Breakdown & Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Category Breakdown */}
        <div className="bg-white border border-[#EAE3D5] rounded-[40px] p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-[#2D5A27] font-serif flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#2D5A27]" />
            توزيع الذكر حسب الأبواب
          </h3>

          <div className="space-y-3">
            {Object.entries(CATEGORY_LABELS).map(([catKey, catMeta]) => {
              const count = progress.categoryCounts[catKey as keyof typeof progress.categoryCounts] || 0;
              const percent = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;

              return (
                <div key={catKey} className="space-y-1 bg-[#F9F7F2] p-3 rounded-2xl border border-[#EAE3D5]">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#2D3436]">{catMeta.title}</span>
                    <span className="font-mono text-[#2D5A27] font-bold">{count} تسبيحة ({percent}%)</span>
                  </div>
                  <div className="w-full bg-[#EAE3D5]/50 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#2D5A27] h-full rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Milestones & Spiritual Achievements */}
        <div className="bg-white border border-[#EAE3D5] rounded-[40px] p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-[#2D5A27] font-serif flex items-center gap-2">
            <Award className="w-5 h-5 text-[#2D5A27]" />
            أوسمة ومقامات الذكر
          </h3>

          <div className="space-y-3 text-xs">
            {/* Badge 1 */}
            <div className={`p-3.5 rounded-2xl border flex items-center gap-3 ${
              totalCount >= 100
                ? "bg-[#2D5A27]/10 border-[#2D5A27]/30 text-[#2D5A27]"
                : "bg-[#F9F7F2] border-[#EAE3D5] text-[#2D3436]/40"
            }`}>
              <div className="p-2 rounded-xl bg-white border border-[#EAE3D5]">
                <CircleCheck className="w-5 h-5 text-[#2D5A27]" />
              </div>
              <div>
                <strong className="block text-sm font-bold text-[#2D3436]">ذاكر المئة الأولى</strong>
                <p className="text-[11px] text-[#2D3436]/60">إتمام 100 تسبيحة في كتاب حسناتك.</p>
              </div>
            </div>

            {/* Badge 2 */}
            <div className={`p-3.5 rounded-2xl border flex items-center gap-3 ${
              treeCount >= 10
                ? "bg-[#2D5A27]/10 border-[#2D5A27]/30 text-[#2D5A27]"
                : "bg-[#F9F7F2] border-[#EAE3D5] text-[#2D3436]/40"
            }`}>
              <div className="p-2 rounded-xl bg-white border border-[#EAE3D5]">
                <Trees className="w-5 h-5 text-[#2D5A27]" />
              </div>
              <div>
                <strong className="block text-sm font-bold text-[#2D3436]">غارِس النخيل (10 نخلات)</strong>
                <p className="text-[11px] text-[#2D3436]/60">غرس 10 نخلات مباركة في الجنة.</p>
              </div>
            </div>

            {/* Badge 3 */}
            <div className={`p-3.5 rounded-2xl border flex items-center gap-3 ${
              progress.dailyStreak >= 7
                ? "bg-[#2D5A27]/10 border-[#2D5A27]/30 text-[#2D5A27]"
                : "bg-[#F9F7F2] border-[#EAE3D5] text-[#2D3436]/40"
            }`}>
              <div className="p-2 rounded-xl bg-white border border-[#EAE3D5]">
                <Flame className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <strong className="block text-sm font-bold text-[#2D3436]">مواظب الأسبوع</strong>
                <p className="text-[11px] text-[#2D3436]/60">الاستمرار على الذكر لمدة 7 أيام متتالية.</p>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
