import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Send,
  X,
  BookOpen,
  Loader2,
  HeartHandshake,
  Bot,
  Lightbulb
} from "lucide-react";

interface AITadabburModalProps {
  initialText?: string;
  onClose?: () => void;
  isEmbeddedView?: boolean;
}

export const AITadabburModal: React.FC<AITadabburModalProps> = ({
  initialText = "",
  onClose,
  isEmbeddedView = false,
}) => {
  const [promptInput, setPromptInput] = useState("");
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Suggested Prompts
  const PRESET_PROMPTS = [
    { title: "تدبر غراس الجنة والذكر المضاعف", text: "اشرح لي فضل أذكار غراس الجنة والذكر المضاعف وكيف يعادل ساعات طويلة من التسبيح؟" },
    { title: "جدول أذكار للمنشغلين", text: "صمم لي جدول أذكار يومي سهل وميسر يناسب يوم عمل أو دراسة مزدحم دون تقصير." },
    { title: "ثمرات سيد الاستغفار", text: "ما هي عجائب وثمرات المداومة على سيد الاستغفار وتدبر معانيه العميقة؟" },
    { title: "فضل الصلاة على النبي ﷺ", text: "بيّن لي كيف تكفى الهموم وتغفر الذنوب بكثرة الصلاة والسلام على النبي ﷺ." },
  ];

  // Auto query if initialText passed
  useEffect(() => {
    if (initialText) {
      handleQuery(`اشرح لي فضل هذا الذكر وعجائب معانيه وثمرته في القلب: "${initialText}"`);
    }
  }, [initialText]);

  const handleQuery = async (queryText: string) => {
    if (!queryText.trim() || isLoading) return;

    setIsLoading(true);
    setErrorMessage(null);
    setAiResponse(null);

    try {
      const res = await fetch("/api/gemini/tadabbur", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: queryText, dhikrContext: initialText }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "حدث خطأ أثناء جلب الإجابة.");
      }

      setAiResponse(data.result);
    } catch (err: any) {
      setErrorMessage(err.message || "عذراً، متعذر الاتصال حالياً بـ مُعين الذاكر.");
    } finally {
      setIsLoading(false);
    }
  };

  const contentUI = (
    <div className="space-y-6">
      
      {/* Header Info */}
      <div className="bg-[#2D5A27] text-white p-6 sm:p-8 rounded-[32px] border border-[#2D5A27] shadow-sm relative overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-full bg-white/10 text-white border border-white/20">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-serif text-white flex items-center gap-2">
              مُعِينُ الذَّاكِرِ (تَدَبُّر وَفَهْم)
            </h2>
            <p className="text-xs text-emerald-100 font-sans">
              مساعدك الذكي لاستكشاف معاني الأذكار، وتفهم ثمراتها، وتصميم جدول يومي مبارك لذكر الله.
            </p>
          </div>
        </div>
      </div>

      {/* Preset Suggestions */}
      {!aiResponse && !isLoading && (
        <div className="space-y-3">
          <span className="text-xs font-bold text-[#2D5A27] flex items-center gap-1.5">
            <Lightbulb className="w-4 h-4 text-[#2D5A27]" />
            أسئلة وتأملات مقترحة:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PRESET_PROMPTS.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setPromptInput(item.text);
                  handleQuery(item.text);
                }}
                className="text-right p-4 rounded-2xl bg-[#F9F7F2] hover:bg-[#EAE3D5]/50 border border-[#EAE3D5] hover:border-[#2D5A27]/50 text-xs text-[#2D3436] space-y-1 transition-all group"
              >
                <strong className="block text-sm text-[#2D5A27] font-serif transition-colors">
                  {item.title}
                </strong>
                <p className="text-[#2D3436]/70 font-sans text-[11px] line-clamp-2">{item.text}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="py-12 text-center space-y-3 bg-[#F9F7F2] rounded-[32px] border border-[#EAE3D5]">
          <Loader2 className="w-10 h-10 text-[#2D5A27] animate-spin mx-auto" />
          <p className="text-sm font-bold text-[#2D5A27] font-serif">
            جاري تدبر الذكر واستخراج الفوائد والنفحات الإيمانية...
          </p>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs text-center">
          {errorMessage}
        </div>
      )}

      {/* AI Response Display */}
      {aiResponse && (
        <div className="bg-white border border-[#EAE3D5] rounded-[32px] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#EAE3D5] pb-3">
            <span className="text-xs font-bold text-[#2D5A27] flex items-center gap-2">
              <Bot className="w-4 h-4 text-[#2D5A27]" />
              نفحات وتدبر من مُعين الذاكر
            </span>
            <button
              onClick={() => setAiResponse(null)}
              className="text-xs text-[#2D5A27] hover:underline font-bold"
            >
              سؤال جديد
            </button>
          </div>

          <div className="text-sm font-sans text-[#2D3436] leading-relaxed whitespace-pre-wrap space-y-2 max-h-[400px] overflow-y-auto pr-2">
            {aiResponse}
          </div>
        </div>
      )}

      {/* Input Box */}
      <div className="relative">
        <textarea
          value={promptInput}
          onChange={(e) => setPromptInput(e.target.value)}
          placeholder="اكتب سؤالك عن الأذكار أو اطلب تفسير معنى أو جدولاً يومياً..."
          rows={3}
          className="w-full bg-[#F9F7F2] border border-[#EAE3D5] rounded-2xl p-4 pr-4 pl-14 text-sm text-[#2D3436] placeholder-[#2D3436]/50 focus:outline-none focus:border-[#2D5A27] transition-all font-sans resize-none"
        />
        <button
          onClick={() => handleQuery(promptInput)}
          disabled={!promptInput.trim() || isLoading}
          className="absolute left-3 bottom-3 p-2.5 rounded-full bg-[#2D5A27] hover:bg-[#1E3D1A] disabled:opacity-50 text-white transition-all shadow-sm"
        >
          <Send className="w-4 h-4 rotate-180" />
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
