import React, { useState } from "react";
import {
  Search,
  Plus,
  Play,
  Heart,
  Sparkles,
  Share2,
  Trees,
  BookOpen
} from "lucide-react";
import { DhikrItem, CustomDhikr } from "../types";
import { CATEGORY_LABELS } from "../data/adhkar";

interface AdhkarLibraryProps {
  allAdhkar: DhikrItem[];
  customAdhkar: CustomDhikr[];
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

  const filteredAdhkar = allAdhkar.filter((item) => {
    if (activeCategory === "favorites") {
      if (!favorites.includes(item.id)) return false;
    } else if (activeCategory !== "all" && item.category !== activeCategory) {
      return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      return item.text.toLowerCase().includes(q) || Boolean(item.virtue?.toLowerCase().includes(q));
    }
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-white border border-[#EAE3D5] rounded-[40px] p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#2D5A27] flex items-center gap-2">
              <BookOpen className="w-6 h-6" />
              فَهْرَسُ الأَذْكَارِ وَالأَدْعِيَةِ المَأْثُورَةِ
            </h2>
            <p className="text-xs text-[#2D3436]/70">
              تصفح الأذكار، والذكر المضاعف، وغراس الجنة.
            </p>
          </div>
          <button
            onClick={onOpenAddCustomModal}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2D5A27] hover:bg-[#1E3D1A] text-white font-bold text-xs shadow-sm"
          >
            <Plus className="w-4 h-4" />
            إضافة ذِكْرٍ خاص
          </button>
        </div>

        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="ابحث عن أي ذكر..."
            className="w-full bg-[#F9F7F2] border border-[#EAE3D5] rounded-full py-3 pr-11 pl-4 text-sm focus:outline-none focus:border-[#2D5A27]"
          />
          <Search className="w-5 h-5 text-[#2D5A27] absolute right-4 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-4 py-2 rounded-full whitespace-nowrap ${activeCategory === "all" ? "bg-[#2D5A27] text-white" : "bg-[#F9F7F2] border border-[#EAE3D5]"}`}
          >
            جميع الأذكار
          </button>
          <button
            onClick={() => setActiveCategory("favorites")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full whitespace-nowrap ${activeCategory === "favorites" ? "bg-[#2D5A27] text-white" : "bg-[#F9F7F2] border border-[#EAE3D5]"}`}
          >
            <Heart className="w-3.5 h-3.5 fill-current text-rose-500" />
            المفضلة ({favorites.length})
          </button>
          {Object.entries(CATEGORY_LABELS).map(([key, meta]) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`px-4 py-2 rounded-full whitespace-nowrap ${activeCategory === key ? "bg-[#2D5A27] text-white" : "bg-[#F9F7F2] border border-[#EAE3D5]"}`}
            >
              {meta.title}
            </button>
          ))}
        </div>
      </div>

      {filteredAdhkar.length === 0 ? (
        <div className="text-center py-16 bg-white border border-[#EAE3D5] rounded-[40px]">
          <Search className="w-12 h-12 text-[#2D3436]/30 mx-auto" />
          <h3 className="mt-3 font-bold text-[#2D5A27]">لم يتم العثور على أذكار تطابق بحثك</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {filteredAdhkar.map((item) => {
            const isFavorite = favorites.includes(item.id);
            return (
              <article key={item.id} className="bg-white border border-[#EAE3D5] rounded-[32px] p-6 shadow-sm flex flex-col justify-between gap-4 hover:border-[#2D5A27]">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] px-3 py-1 rounded-full bg-[#EAE3D5]/50 text-[#2D5A27] font-semibold">
                    {item.category === "ghiras" ? "🌱 غراس الجنة والمضاعف" : CATEGORY_LABELS[item.category]?.title || "ذكر"}
                  </span>
                  <button
                    onClick={() => onToggleFavorite(item.id)}
                    className="p-2 rounded-full bg-[#F9F7F2] border border-[#EAE3D5]"
                    aria-label={isFavorite ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
                  >
                    <Heart className={`w-4 h-4 ${isFavorite ? "fill-rose-500 text-rose-500" : "text-stone-400"}`} />
                  </button>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xl sm:text-2xl font-bold font-serif leading-relaxed">{item.text}</h3>
                  {item.rewardDescription && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2D5A27]/10 text-[#2D5A27] text-xs font-semibold">
                      <Trees className="w-3.5 h-3.5" />
                      {item.rewardDescription}
                    </div>
                  )}
                  {item.virtue && <p className="text-xs text-[#2D3436]/75 leading-relaxed">{item.virtue}</p>}
                </div>

                <div className="pt-4 border-t border-[#EAE3D5] flex items-center justify-between gap-2">
                  <button
                    onClick={() => onSelectDhikrForMisbaha(item)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#2D5A27] text-white font-bold text-xs"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    ابدأ بالمسبحة
                  </button>
                  <div className="flex items-center gap-2">
                    <button onClick={() => onOpenTadabbur(item.text)} className="p-2.5 rounded-full bg-[#F9F7F2] border border-[#EAE3D5]" aria-label="تدبر الذكر">
                      <Sparkles className="w-4 h-4 text-[#2D5A27]" />
                    </button>
                    <button onClick={() => onOpenCardGenerator(item)} className="p-2.5 rounded-full bg-[#F9F7F2] border border-[#EAE3D5]" aria-label="مشاركة بطاقة الذكر">
                      <Share2 className="w-4 h-4 text-[#2D5A27]" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
