# مُذكِّر — غراس الجنة

تطبيق عربي للذكر والأذكار اليومية، يضم مسبحة ذكية، مكتبة أذكار، متابعة الإنجاز، بطاقات للمشاركة، ومساعداً للتدبر يعمل عبر Gemini API.

## أبرز المزايا

- مسبحة إلكترونية بأهداف مرنة وتنبيه صوتي واهتزاز اختياري.
- مكتبة أذكار وتصنيفات ومفضلة وأذكار مخصصة.
- متابعة يومية لعدد الأذكار والاستمرارية والغراس.
- إنشاء بطاقات ذكر قابلة للمشاركة.
- مساعد تدبر يعمل من الخادم لحماية مفتاح Gemini.
- تطبيق ويب تقدمي PWA قابل للتثبيت على الجوال، مع دعم أساسي للعمل دون اتصال.
- رابط مشاركة ورمز QR وإرشادات تجهيز نسخة للمتاجر.

## التشغيل محلياً

يتطلب Node.js 20 أو أحدث.

```bash
npm install
cp .env.example .env
npm run dev
```

في Windows PowerShell:

```powershell
npm install
Copy-Item .env.example .env
npm run dev
```

أضف مفتاح Gemini داخل `.env`:

```env
GEMINI_API_KEY=ضع_المفتاح_هنا
GEMINI_MODEL=gemini-3.6-flash
PORT=3000
NODE_ENV=development
```

ثم افتح `http://localhost:3000`، ويمكن فحص الخادم عبر `http://localhost:3000/api/health`.

## الفحص والبناء

```bash
npm run check
npm start
```

## النشر على Render باستخدام Docker

المشروع مهيأ بملفي `Dockerfile` و`render.yaml`.

- Runtime: Docker
- Branch: `main`
- Root Directory: فارغ
- Health Check Path: `/api/health`
- Environment variables: `GEMINI_API_KEY`, `GEMINI_MODEL`, `NODE_ENV`

لا تضف `PORT` في Render؛ المنصة تنشئه تلقائياً ويقرأه الخادم مباشرة.

## الخصوصية

تُحفظ بيانات العداد والمفضلة والأذكار المخصصة داخل متصفح المستخدم باستخدام `localStorage`. يرسل مساعد التدبر السؤال فقط إلى مسار الخادم المتصل بـ Gemini API.
