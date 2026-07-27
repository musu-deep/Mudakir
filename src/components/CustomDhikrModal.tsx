import React, { useState } from "react";
import { Plus, X, BookmarkPlus } from "lucide-react";
import { CustomDhikr, DhikrItem } from "../types";
import { saveCustomDhikr } from "../utils/storage";

interface CustomDhikrModalProps {
  onClose: () => void;
  onDhikrAdded: (item: DhikrItem) => void;
}

export const CustomDhikrModal: React.FC<CustomDhikrModalProps> = ({
  onClose,
  onDhikrAdded,
}) => {
  const [text, setText] = useState("");
  const [target, setTarget] = useState(100);
  const [virtue, setVirtue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    const newCustom: CustomDhikr = {
      id: `custom-${Date.now()}`,
      text: text.trim(),
      target: target || 100,
      virtue: virtue.trim() || undefined,
    };

    saveCustomDhikr(newCustom);

    // Convert to DhikrItem format for live app usage
    const dhikrItem: DhikrItem = {
      id: newCustom.id,
      text: newCustom.text,
      category: "custom",
      defaultTarget: newCustom.target,
      virtue: newCustom.virtue,
      rewardDescription: "ذِكْرٌ خاصٌ مضافٌ بحسابك",
    };

    onDhikrAdded(dhikrItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-[#EAE3D5] rounded-[40px] max-w-lg w-full p-6 sm:p-8 shadow-2xl relative text-[#2D3436]">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 rounded-full bg-[#F9F7F2] text-stone-400 hover:text-[#2D5A27] border border-[#EAE3D5]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-full bg-[#2D5A27]/10 text-[#2D5A27] border border-[#2D5A27]/20">
            <BookmarkPlus className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-serif text-[#2D5A27]">إِضَافَةُ ذِكْرٍ خَاصٍّ جَدِيدٍ</h3>
            <p className="text-xs text-[#2D3436]/70 font-sans">
              أضف أي دعاء أو ورد أو ورد استغفار خاص بك للبدء بتتبعه في المسبحة.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
          
          {/* Text Input */}
          <div className="space-y-1.5">
            <label className="block text-[#2D3436] font-bold">نص الذكر أو الدعاء (*):</label>
            <textarea
              required
              rows={3}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="مثال: اللهم إني أسألك الهدى والتقى والعفاف والغنى..."
              className="w-full bg-[#F9F7F2] border border-[#EAE3D5] rounded-2xl p-3 text-sm text-[#2D3436] placeholder-[#2D3436]/40 focus:outline-none focus:border-[#2D5A27] font-serif"
            />
          </div>

          {/* Target Goal Input */}
          <div className="space-y-1.5">
            <label className="block text-[#2D3436] font-bold">العدد المستهدف (الهدف):</label>
            <div className="flex items-center gap-2">
              {[33, 100, 1000].map((num) => (
                <button
                  type="button"
                  key={num}
                  onClick={() => setTarget(num)}
                  className={`px-3.5 py-1.5 rounded-full border font-mono ${
                    target === num
                      ? "bg-[#2D5A27] text-white border-[#2D5A27] font-bold shadow-sm"
                      : "bg-[#F9F7F2] border-[#EAE3D5] text-[#2D3436]"
                  }`}
                >
                  {num}
                </button>
              ))}
              <input
                type="number"
                min={1}
                max={10000}
                value={target}
                onChange={(e) => setTarget(parseInt(e.target.value) || 100)}
                className="w-24 bg-[#F9F7F2] border border-[#EAE3D5] rounded-full px-3 py-1.5 text-center font-mono text-[#2D3436]"
              />
            </div>
          </div>

          {/* Virtue/Notes Input */}
          <div className="space-y-1.5">
            <label className="block text-[#2D3436] font-bold">ملاحظات أو الفضل (اختياري):</label>
            <input
              type="text"
              value={virtue}
              onChange={(e) => setVirtue(e.target.value)}
              placeholder="مثال: يقال عند الصباح لمغفرة الذنوب وتيسير الرزق"
              className="w-full bg-[#F9F7F2] border border-[#EAE3D5] rounded-2xl p-3 text-[#2D3436] placeholder-[#2D3436]/40 focus:outline-none focus:border-[#2D5A27]"
            />
          </div>

          {/* Submit */}
          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-full bg-[#F9F7F2] text-[#2D3436] border border-[#EAE3D5] hover:bg-[#EAE3D5]/40"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-full bg-[#2D5A27] hover:bg-[#1E3D1A] text-white font-bold shadow-sm"
            >
              حفظ الذكر
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
