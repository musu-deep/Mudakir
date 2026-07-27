import React, { useState } from "react";
import { BookmarkPlus, Plus, X } from "lucide-react";
import { CustomDhikr, DhikrItem } from "../types";
import { saveCustomDhikr } from "../utils/storage";

interface CustomDhikrModalProps {
  onClose: () => void;
  onDhikrAdded: (item: DhikrItem) => void;
}

export const CustomDhikrModal: React.FC<CustomDhikrModalProps> = ({ onClose, onDhikrAdded }) => {
  const [text, setText] = useState("");
  const [target, setTarget] = useState(100);
  const [virtue, setVirtue] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!text.trim()) return;

    const customDhikr: CustomDhikr = {
      id: `custom-${Date.now()}`,
      text: text.trim(),
      target: Math.max(1, target || 100),
      virtue: virtue.trim() || undefined,
    };

    saveCustomDhikr(customDhikr);
    onDhikrAdded({
      id: customDhikr.id,
      text: customDhikr.text,
      category: "custom",
      defaultTarget: customDhikr.target,
      virtue: customDhikr.virtue,
      rewardDescription: "ذِكْرٌ خاصٌ مضافٌ بحسابك",
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-[#EAE3D5] rounded-[40px] max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 left-4 p-2 rounded-full bg-[#F9F7F2] border border-[#EAE3D5]" aria-label="إغلاق">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-full bg-[#2D5A27]/10 text-[#2D5A27]">
            <BookmarkPlus className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-serif text-[#2D5A27]">إِضَافَةُ ذِكْرٍ خَاصٍّ</h3>
            <p className="text-xs text-[#2D3436]/70">أضف ورداً خاصاً وحدد هدفه اليومي.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <label className="block space-y-1.5">
            <span className="font-bold">نص الذكر أو الدعاء</span>
            <textarea
              required
              rows={4}
              value={text}
              onChange={(event) => setText(event.target.value)}
              className="w-full bg-[#F9F7F2] border border-[#EAE3D5] rounded-2xl p-3 focus:outline-none focus:border-[#2D5A27]"
              placeholder="اكتب الذكر هنا..."
            />
          </label>

          <div className="space-y-2">
            <span className="font-bold">العدد المستهدف</span>
            <div className="flex items-center gap-2 flex-wrap">
              {[33, 100, 1000].map((value) => (
                <button
                  type="button"
                  key={value}
                  onClick={() => setTarget(value)}
                  className={`px-4 py-2 rounded-full border ${target === value ? "bg-[#2D5A27] text-white border-[#2D5A27]" : "bg-[#F9F7F2] border-[#EAE3D5]"}`}
                >
                  {value}
                </button>
              ))}
              <input
                type="number"
                min={1}
                max={10000}
                value={target}
                onChange={(event) => setTarget(Number(event.target.value) || 1)}
                className="w-28 bg-[#F9F7F2] border border-[#EAE3D5] rounded-full px-3 py-2 text-center"
              />
            </div>
          </div>

          <label className="block space-y-1.5">
            <span className="font-bold">ملاحظة أو فضل الذكر (اختياري)</span>
            <input
              value={virtue}
              onChange={(event) => setVirtue(event.target.value)}
              className="w-full bg-[#F9F7F2] border border-[#EAE3D5] rounded-2xl p-3 focus:outline-none focus:border-[#2D5A27]"
            />
          </label>

          <button type="submit" className="w-full flex items-center justify-center gap-2 rounded-full bg-[#2D5A27] text-white py-3 font-bold hover:bg-[#1E3D1A]">
            <Plus className="w-4 h-4" />
            حفظ الذكر والبدء به
          </button>
        </form>
      </div>
    </div>
  );
};
