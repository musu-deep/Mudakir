import React, { useEffect, useState } from "react";
import {
  Smartphone,
  Download,
  Share2,
  Copy,
  Check,
  Globe,
  Store,
  Apple,
  Zap,
  ShieldCheck,
  Code2,
  ExternalLink,
  Info
} from "lucide-react";
import {
  getCapturedPwaInstallPrompt,
  isPwaRunningStandalone,
  showNativePwaInstallPrompt,
  subscribeToPwaInstallPrompt
} from "../utils/pwaInstall";

export const MobileAppExportModal: React.FC = () => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCapacitorConfig, setCopiedCapacitorConfig] = useState(false);
  const [installAvailable, setInstallAvailable] = useState(() => Boolean(getCapturedPwaInstallPrompt()));
  const [isInstalled, setIsInstalled] = useState(() => isPwaRunningStandalone());
  const [showInstallHelp, setShowInstallHelp] = useState(false);
  const [activeTab, setActiveTab] = useState<"pwa" | "link" | "stores" | "capacitor">("pwa");

  const appShareUrl = typeof window !== "undefined" ? window.location.origin : "";

  useEffect(() => {
    const unsubscribe = subscribeToPwaInstallPrompt((prompt) => {
      setInstallAvailable(Boolean(prompt));
      if (prompt) setShowInstallHelp(false);
    });

    const handleInstalled = () => {
      setIsInstalled(true);
      setShowInstallHelp(false);
    };

    window.addEventListener("appinstalled", handleInstalled);
    return () => {
      unsubscribe();
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  const handleInstallPWA = async () => {
    if (isInstalled) return;

    const outcome = await showNativePwaInstallPrompt();
    if (outcome === "accepted") {
      setIsInstalled(true);
      setShowInstallHelp(false);
      return;
    }

    if (outcome === "unavailable") {
      setShowInstallHelp(true);
    }
  };

  const copyText = async (value: string) => {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return;
    }

    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  };

  const handleCopyLink = async () => {
    try {
      await copyText(appShareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      alert("تعذر نسخ الرابط تلقائياً. يمكنك تحديده ونسخه يدوياً.");
    }
  };

  const capacitorConfigJson = `{
  "appId": "com.ghiras.jannah.app",
  "appName": "غراس الجنة",
  "webDir": "dist",
  "bundledWebRuntime": false,
  "server": {
    "url": "${appShareUrl}",
    "cleartext": false
  },
  "ios": {
    "contentInset": "always"
  }
}`;

  const handleCopyCapacitor = async () => {
    try {
      await copyText(capacitorConfigJson);
      setCopiedCapacitorConfig(true);
      setTimeout(() => setCopiedCapacitorConfig(false), 2500);
    } catch {
      alert("تعذر نسخ الإعدادات تلقائياً. يمكنك تحديدها ونسخها يدوياً.");
    }
  };

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(appShareUrl)}&color=2D5A27&bgcolor=FDFCF9`;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="bg-[#2D5A27] text-white p-6 sm:p-8 rounded-[36px] shadow-sm relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 max-w-xl text-center md:text-right">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-emerald-200 text-xs font-semibold">
            <Smartphone className="w-4 h-4" />
            <span>جاهز للتثبيت والنشر على جميع الأجهزة</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white">
            تجهيز وتثبيت التطبيق للهواتف والمتاجر
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 font-sans leading-relaxed">
            التطبيق مصمم بتجاوب كامل ليعمل كتطبيق أصلي (Native App / PWA) على الهواتف والأجهزة اللوحية (iOS & Android)، ومجهز للرفع المباشر إلى متجر قوقل بلاي وآبل ستور.
          </p>
        </div>

        {/* Action button */}
        <button
          onClick={handleInstallPWA}
          className="px-6 py-3.5 rounded-full bg-white text-[#2D5A27] font-bold text-sm hover:bg-emerald-50 transition-all shadow-md flex items-center gap-2 shrink-0"
        >
          <Download className="w-5 h-5 text-[#2D5A27]" />
          <span>{isInstalled ? "التطبيق مثبت على جهازك" : installAvailable ? "تثبيت التطبيق الآن" : "تجهيز التثبيت"}</span>
        </button>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-[#EAE3D5] pb-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab("pwa")}
          className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === "pwa"
              ? "bg-[#2D5A27] text-white shadow-sm"
              : "bg-[#F9F7F2] text-[#2D3436]/70 hover:bg-[#EAE3D5]/50 border border-[#EAE3D5]"
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>تثبيت مباشر للجوال (PWA)</span>
        </button>

        <button
          onClick={() => setActiveTab("link")}
          className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === "link"
              ? "bg-[#2D5A27] text-white shadow-sm"
              : "bg-[#F9F7F2] text-[#2D3436]/70 hover:bg-[#EAE3D5]/50 border border-[#EAE3D5]"
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>الرابط المباشر ورمز QR</span>
        </button>

        <button
          onClick={() => setActiveTab("stores")}
          className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === "stores"
              ? "bg-[#2D5A27] text-white shadow-sm"
              : "bg-[#F9F7F2] text-[#2D3436]/70 hover:bg-[#EAE3D5]/50 border border-[#EAE3D5]"
          }`}
        >
          <Store className="w-4 h-4" />
          <span>النشر على قوقل بلاي وآبل ستور</span>
        </button>

        <button
          onClick={() => setActiveTab("capacitor")}
          className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === "capacitor"
              ? "bg-[#2D5A27] text-white shadow-sm"
              : "bg-[#F9F7F2] text-[#2D3436]/70 hover:bg-[#EAE3D5]/50 border border-[#EAE3D5]"
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>ملفات الإعداد الجاهزة</span>
        </button>
      </div>

      {/* Tab 1: PWA Direct Installation */}
      {activeTab === "pwa" && (
        <div className="bg-white border border-[#EAE3D5] rounded-[36px] p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-[#2D5A27]/10 text-[#2D5A27]">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-serif text-[#2D5A27]">
                التثبيت الفوري كـ Progressive Web App (PWA)
              </h3>
              <p className="text-xs text-[#2D3436]/70">
                يعمل التطبيق بدون الحاجة للتنزيل من المتاجر مع إمكانية العمل بدون إنترنت وأيقونة خاصة على الشاشة.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* iOS Steps */}
            <div className="p-5 rounded-[28px] bg-[#F9F7F2] border border-[#EAE3D5] space-y-3">
              <div className="flex items-center gap-2 text-[#2D5A27] font-bold text-sm">
                <Apple className="w-5 h-5" />
                <span>طريقة التثبيت على الآيفون والآيباد (iOS)</span>
              </div>
              <ol className="text-xs text-[#2D3436]/80 space-y-2 list-decimal list-inside font-sans leading-relaxed">
                <li>افتح رابط التطبيق في متصفح <strong>Safari</strong>.</li>
                <li>اضغط على زر <strong>المشاركة (Share <Share2 className="w-3.5 h-3.5 inline text-[#2D5A27]" />)</strong> في أسفل الشاشة.</li>
                <li>اختر <strong>«الإضافة إلى الشاشة الرئيسية» (Add to Home Screen)</strong>.</li>
                <li>سيظهر تطبيق «غراس الجنة» بأيقونة مخصصة ويعمل في وضع ملء الشاشة بدون شريط المتصفح!</li>
              </ol>
            </div>

            {/* Android Steps */}
            <div className="p-5 rounded-[28px] bg-[#F9F7F2] border border-[#EAE3D5] space-y-3">
              <div className="flex items-center gap-2 text-[#2D5A27] font-bold text-sm">
                <Smartphone className="w-5 h-5" />
                <span>طريقة التثبيت على أندرويد (Google Chrome)</span>
              </div>
              <ol className="text-xs text-[#2D3436]/80 space-y-2 list-decimal list-inside font-sans leading-relaxed">
                <li>افتح الرابط في متصفح <strong>Google Chrome</strong>.</li>
                <li>سوف تظهر لك مطالبة تلقائية بالأسفل: <strong>«تثبيت غراس الجنة»</strong>.</li>
                <li>أو اضغط على النقاط الثلاث (⋮) في الأعلى واختر <strong>«تثبيت التطبيق» (Install App)</strong>.</li>
                <li>ستتم إضافة التطبيق لقائمة التطبيقات الرئيسية بهاتفك مثل أي تطبيق مثبت.</li>
              </ol>
            </div>
          </div>

          {/* Quick Install Button */}
          <div className="text-center pt-2">
            <button
              onClick={handleInstallPWA}
              className="px-8 py-3 rounded-full bg-[#2D5A27] hover:bg-[#1E3D1A] text-white font-bold text-sm shadow-sm transition-all inline-flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>{isInstalled ? "التطبيق مثبت بالفعل" : installAvailable ? "تثبيت التطبيق بنقرة واحدة" : "محاولة التثبيت"}</span>
            </button>
          </div>

          {showInstallHelp && !isInstalled && (
            <div className="rounded-[24px] border border-amber-200 bg-amber-50 p-4 text-right flex items-start gap-3">
              <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-bold text-amber-900">تعذر فتح نافذة التثبيت الأصلية في هذا المتصفح.</p>
                <p className="text-xs leading-relaxed text-amber-800">
                  افتح التطبيق في Chrome أو Edge على أندرويد أو ويندوز، ثم اضغط الزر مرة أخرى. على أجهزة Apple تفرض iOS استخدام «إضافة إلى الشاشة الرئيسية» من قائمة المشاركة، ولا يسمح النظام للمواقع بتجاوز هذه الخطوة.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Direct Share Link & QR Code */}
      {activeTab === "link" && (
        <div className="bg-white border border-[#EAE3D5] rounded-[36px] p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            
            <div className="space-y-4 max-w-md text-right">
              <div className="flex items-center gap-2 text-[#2D5A27] font-bold text-base font-serif">
                <Globe className="w-5 h-5 text-[#2D5A27]" />
                <span>رابط التطبيق المباشر (نسخة المعاينة والتشغيل):</span>
              </div>

              {/* Link Input Box */}
              <div className="p-3 rounded-2xl bg-[#F9F7F2] border border-[#EAE3D5] flex items-center justify-between gap-2">
                <span className="text-xs font-mono text-[#2D3436] truncate dir-ltr text-left font-semibold">
                  {appShareUrl}
                </span>
                <button
                  onClick={handleCopyLink}
                  className="px-4 py-2 rounded-full bg-[#2D5A27] hover:bg-[#1E3D1A] text-white text-xs font-bold transition-all shadow-sm shrink-0 flex items-center gap-1.5"
                >
                  {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedLink ? "تم النسخ!" : "نسخ الرابط"}</span>
                </button>
              </div>

              <p className="text-xs text-[#2D3436]/70 leading-relaxed">
                يمكنك مشاركة هذا الرابط مباشرة عبر الواتساب أو شبكات التواصل الاجتماعي، وسيفتح فوراً على أي هاتف ذكي، آيباد، أو تابليت بدون أي إعدادات إضافية.
              </p>
            </div>

            {/* QR Code Container */}
            <div className="p-6 rounded-[32px] bg-[#F9F7F2] border border-[#EAE3D5] text-center space-y-3 shrink-0">
              <span className="text-xs font-bold text-[#2D5A27] block">امسح الرمز للكاميرا بالهاتف</span>
              <img
                src={qrCodeUrl}
                alt="QR Code for App Link"
                className="w-44 h-44 mx-auto rounded-2xl border border-[#EAE3D5] shadow-sm bg-white p-2"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              <span className="text-[11px] text-[#2D3436]/60 block font-mono">scan & launch on phone</span>
            </div>

          </div>
        </div>
      )}

      {/* Tab 3: Store Publishing Instructions */}
      {activeTab === "stores" && (
        <div className="bg-white border border-[#EAE3D5] rounded-[36px] p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-[#2D5A27]/10 text-[#2D5A27]">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-serif text-[#2D5A27]">
                خطوات تحويل التطبيق إلى Google Play Store و Apple App Store
              </h3>
              <p className="text-xs text-[#2D3436]/70">
                طريقتان مجربتان وسريعتان لنشر هذا التطبيق على المتاجر الرسمية:
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Method 1: PWABuilder (Easiest - 2 Minutes) */}
            <div className="p-6 rounded-[28px] bg-[#F9F7F2] border border-[#EAE3D5] space-y-4">
              <div className="flex items-center gap-2 text-[#2D5A27] font-bold text-sm">
                <Zap className="w-5 h-5 text-amber-600" />
                <span>الطريقة الأولى: استخدام PWABuilder (سهلة وسريعة خلال دقيقتين)</span>
              </div>
              <p className="text-xs text-[#2D3436]/80 leading-relaxed font-sans">
                خدمة مجانية رسمية تدعمها قوقل ومايكروسوفت لتحويل الـ PWA إلى ملف <strong>AAB/APK</strong> جاهز للرفع على قوقل بلاي فوراً:
              </p>
              <ol className="text-xs text-[#2D3436]/80 space-y-2 list-decimal list-inside font-sans leading-relaxed">
                <li>انتقل إلى موقع <a href="https://www.pwabuilder.com" target="_blank" rel="noreferrer" className="text-[#2D5A27] font-bold underline inline-flex items-center gap-1">PWABuilder.com <ExternalLink className="w-3 h-3" /></a>.</li>
                <li>ضع رابط التطبيق: <code className="bg-white px-1.5 py-0.5 rounded text-[11px] font-mono dir-ltr">{appShareUrl}</code>.</li>
                <li>اضغط على <strong>«Build My App»</strong>.</li>
                <li>اختر <strong>Android (Google Play)</strong> ثم قم بتنزيل ملف الـ <code className="bg-white px-1.5 py-0.5 rounded font-mono">.aab</code> المكتمل تلقائياً ورفعه على Google Play Console!</li>
              </ol>
            </div>

            {/* Method 2: Capacitor Native Shell */}
            <div className="p-6 rounded-[28px] bg-[#F9F7F2] border border-[#EAE3D5] space-y-4">
              <div className="flex items-center gap-2 text-[#2D5A27] font-bold text-sm">
                <Apple className="w-5 h-5 text-[#2D5A27]" />
                <span>الطريقة الثانية: باستخدام Capacitor (لـ Apple App Store & Google Play)</span>
              </div>
              <p className="text-xs text-[#2D3436]/80 leading-relaxed font-sans">
                لرفع نسخة نيتيف احترافية على متجر آبل وأندرويد باستخدام إطار عمل Ionic Capacitor:
              </p>
              <ul className="text-xs text-[#2D3436]/80 space-y-2 list-disc list-inside font-sans leading-relaxed">
                <li>قم بتنزيل الكود المصدري للتطبيق من خيار Export المتاح بالمنصة.</li>
                <li>قم بتشغيل الأوامر التالية في المجلد:
                  <div className="bg-[#2D3436] text-emerald-300 p-3 rounded-2xl font-mono text-[11px] my-2 dir-ltr text-left space-y-1">
                    <div>npm install @capacitor/core @capacitor/cli</div>
                    <div>npx cap init "غراس الجنة" com.ghiras.jannah.app</div>
                    <div>npx cap add android</div>
                    <div>npx cap add ios</div>
                  </div>
                </li>
                <li>قم بفتح المجلد في Android Studio أو Xcode واضغط <strong>Build Archive / Signed APK</strong>!</li>
              </ul>
            </div>

          </div>
        </div>
      )}

      {/* Tab 4: Config Code */}
      {activeTab === "capacitor" && (
        <div className="bg-white border border-[#EAE3D5] rounded-[36px] p-6 sm:p-8 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#2D5A27] font-bold text-sm">
              <Code2 className="w-5 h-5" />
              <span>ملف إعدادات Capacitor المجهز تلقائياً (capacitor.config.json)</span>
            </div>
            <button
              onClick={handleCopyCapacitor}
              className="px-4 py-2 rounded-full bg-[#2D5A27] text-white text-xs font-bold hover:bg-[#1E3D1A] transition-all shadow-sm flex items-center gap-1.5"
            >
              {copiedCapacitorConfig ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedCapacitorConfig ? "تم نسخ الإعدادات!" : "نسخ الملف"}</span>
            </button>
          </div>

          <pre className="bg-[#2D3436] text-amber-200 p-5 rounded-[24px] font-mono text-xs dir-ltr text-left overflow-x-auto">
            {capacitorConfigJson}
          </pre>
        </div>
      )}

      {/* Summary of Technical Compatibility */}
      <div className="p-6 rounded-[32px] bg-[#F9F7F2] border border-[#EAE3D5] grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div className="space-y-1">
          <Smartphone className="w-6 h-6 text-[#2D5A27] mx-auto" />
          <h4 className="text-xs font-bold text-[#2D5A27]">تجاوب كامل للشاشات</h4>
          <p className="text-[11px] text-[#2D3436]/70">تخطيط مرن مع كافة قياسات الجوالات والتابلت</p>
        </div>
        <div className="space-y-1">
          <Zap className="w-6 h-6 text-[#2D5A27] mx-auto" />
          <h4 className="text-xs font-bold text-[#2D5A27]">تغذية لمسية وصوتية</h4>
          <p className="text-[11px] text-[#2D3436]/70">دعم Haptic Vibration ونغمات النقر الحقيقية</p>
        </div>
        <div className="space-y-1">
          <ShieldCheck className="w-6 h-6 text-[#2D5A27] mx-auto" />
          <h4 className="text-xs font-bold text-[#2D5A27]">دعم العمل بدون إنترنت</h4>
          <p className="text-[11px] text-[#2D3436]/70">Service Worker مدمج لحفظ الأذكار محلياً</p>
        </div>
      </div>

    </div>
  );
};
