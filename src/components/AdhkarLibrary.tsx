import React, { useState } from "react";
import {
  Search,
  Plus,
  Play,
  Heart,
  Sparkles,
  Share2,
  BookmarkPlus,
  Trees,
  BookOpen,
  Info
} from "lucide-react";
import { DhikrItem, DhikrCategory } from "../types";
import { CATEGORY_LABELS } from "../data/adhkar";
import { toggleFavorite } from "../utils/storage";

interface AdhkarLibraryProps {
  allAdhkar: DhikrItem[];
  favorites: string[];
  onSelectDhikrForMisbaha: (item: DhikrItem) => void;
  onOpenTadabbur: (dhikrText: string) => void;
  onOpenCardGenerator: (item: DhikrItem) => void;
  onOpenAddCustomModal: () => void;
  onToggleFavorite: (dhikrId: string) => void;
}

export const AdhkarLibrary: React.FC<AdhkarLibraryProps> = ({
  allAdhkar,
  favorites,
  onSelectDhikrForMisbaha,
  onOpenTadabbur,
  onOpenCardGenerator,
  onOpenAddCustomModal,
  onToggleFavorite,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Filter logic
  const filteredAdhkar = allAdhkar.filter((item) => {
    // Category match
    if (activeCategory === "favorites") {
      if (!favorites.includes(item.id)) return false;
    } else if (activeCategory !== "all") {
      if (item.category !== activeCategory) return false;
    }

    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      const textMatch = item.text.toLowerCase().includes(q);
      const virtueMatch = item.virtue?.toLowerCase().includes(q) || false;
      return textMatch || virtueMatch;
    }

    return true;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Search & Category Filter Header */}
      <div className="bg-white border border-[#EAE3D5] rounded-[40px] p-6 sm:p-8 shadow-sm space-y-5">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#2D5A27] flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-[#2D5A27]" />
              فَهْرَسُ الأَذْكَارِ وَالأَدْعِيَةِ المَأْثُورَةِ
            </h2>
            <p className="text-xs text-[#2D3436]/70 font-sans">
              تصفح الأذكار الصحيحة من كتاب الله وسنة رسوله ﷺ، واستمتع بالذكر المضاعف وغراس الجنة.
            </p>
          </div>

          {/* Add Custom Dhikr Button */}
          <button
            onClick={onOpenAddCustomModal}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2D5A27] hover:bg-[#1E3D1A] text-white font-bold text-xs shadow-sm transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة ذِكْرٍ خاص</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن أي ذكر، مثل: غراس الجنة، سيد الاستغفار، سبحان الله العظيم..."
            className="w-full bg-[#F9F7F2] border border-[#EAE3D5] rounded-full py-3 pr-11 pl-4 text-sm text-[#2D3436] placeholder-[#2D3436]/50 focus:outline-none focus:border-[#2D5A27] transition-all font-sans"
          />
          <Search className="w-5 h-5 text-[#2D5A27] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-4 py-2 rounded-full transition-all whitespace-nowrap font-medium ${
              activeCategory === "all"
                ? "bg-[#2D5A27] text-white font-bold shadow-sm"
                : "bg-[#F9F7F2] text-[#2D3436]/70 border border-[#EAE3D5] hover:bg-[#EAE3D5]/40"
            }`}
          >
            جميع الأذكار
          </button>

          <button
            onClick={() => setActiveCategory("favorites")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full transition-all whitespace-nowrap font-medium ${
              activeCategory === "favorites"
                ? "bg-[#2D5A27] text-white font-bold shadow-sm"
                : "bg-[#F9F7F2] text-[#2D3436]/70 border border-[#EAE3D5] hover:bg-[#EAE3D5]/40"
            }`}
          >
            <Heart className="w-3.5 h-3.5 fill-current text-rose-500" />
            <span>المفضلة ({favorites.length})</span>
          </button>

          {Object.entries(CATEGORY_LABELS).map(([catKey, catMeta]) => (
            <button
              key={catKey}
              onClick={() => setActiveCategory(catKey)}
              className={`px-4 py-2 rounded-full transition-all whitespace-nowrap font-medium ${
                activeCategory === catKey
                  ? "bg-[#2D5A27] text-white font-bold shadow-sm"
                  : "bg-[#F9F7F2] text-[#2D3436]/70 border border-[#EAE3D5] hover:bg-[#EAE3D5]/40"
              }`}
            >
              {catMeta.title}
            </button>
          ))}
        </div>

      </div>

      {/* Adhkar Cards Grid */}
      {filteredAdhkar.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white border border-[#EAE3D5] rounded-[40px] space-y-3">
          <Search className="w-12 h-12 text-[#2D3436]/30 mx-auto" />
          <h3 className="text-base font-bold text-[#2D5A27]">لم يتم العثور على أذكار تطابق بحثك</h3>
          <p className="text-xs text-[#2D3436]/60">جرب البحث بكلمات أخرى أو اختر تصنيفاً آخر.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {filteredAdhkar.map((item) => {
            const isFav = favorites.includes(item.id);

            return (
              <div
                key={item.id}
                className="bg-white border border-[#EAE3D5] rounded-[32px] p-6 shadow-sm flex flex-col justify-between gap-4 hover:border-[#2D5A27] transition-all group relative overflow-hidden"
              >
                {/* Top Badge & Favorite */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] px-3 py-1 rounded-full bg-[#EAE3D5]/50 border border-[#EAE3D5] text-[#2D5A27] font-semibold">
                    {item.category === "ghiras" ? "🌱 غراس الجنة والمضاعف" : CATEGORY_LABELS[item.category]?.title || "ذكر"}
                  </span>

                  <button
                    onClick={() => onToggleFavorite(item.id)}
                    title={isFav ? "إزالة من المفضلة" : "إضافة للمفضلة"}
                    className="p-2 rounded-full bg-[#F9F7F2] border border-[#EAE3D5] text-stone-400 hover:text-rose-500 transition-colors"
                  >
                    <Heart className={`w-4 h-4 ${isFav ? "fill-rose-500 text-rose-500" : ""}`} />
                  </button>
                </div>

                {/* Dhikr Arabic Text */}
                <div className="space-y-3">
                  <h3 className="text-xl sm:text-2xl font-bold font-serif text-[#2D3436] leading-relaxed">
                    {item.text}
                  </h3>

                  {item.rewardDescription && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2D5A27]/10 border border-[#2D5A27]/20 text-[#2D5A27] text-xs font-semibold">
                      <Trees className="w-3.5 h-3.5 text-[#2D5A27]" />
                      <span>{item.rewardDescription}</span>
                    </div>
                  )}

                  {item.virtue && (
                    <p className="text-xs text-[#2D3436]/75 font-sans leading-relaxed pt-1">
                      {item.virtue}
                    </p>
                  )}
                </div>

                {/* Footer Action Buttons */}
                <div className="pt-4 border-t border-[#EAE3D5] flex items-center justify-between gap-2 flex-wrap text-xs">
                  
                  {/* Start in Misbaha */}
                  <button
                    onClick={() => onSelectDhikrForMisbaha(item)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#2D5A27] hover:bg-[#1E3D1A] text-white font-bold transition-all shadow-sm"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>ابدأ بالمسبحة</span>
                  </button>

                  <div className="flex items-center gap-2">
                    {/* AI Tadabbur */}
                    <button
                      onClick={() => onOpenTadabbur(item.text)}
                      title="تدبر وفهم المعنى"
                      className="p-2.5 rounded-full bg-[#F9F7F2] hover:bg-[#EAE3D5]/50 text-[#2D5A27] border border-[#EAE3D5] transition-all"
                    >
                      <Sparkles className="w-4 h-4" />
                    </button>

                    {/* Poster Card */}
                    <button
                      onClick={() => onOpenCardGenerator(item)}
                      title="توليد بطاقة إهداء للذكر"
                      className="p-2.5 rounded-full bg-[#F9F7F2] hover:bg-[#EAE3D5]/50 text-[#2D5A27] border border-[#EAE3D5] transition-all"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
