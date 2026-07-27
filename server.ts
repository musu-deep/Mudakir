import dotenv from "dotenv";
import express from "express";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = Number(process.env.PORT) || 3000;
const GEMINI_MODEL = process.env.GEMINI_MODEL?.trim() || "gemini-3.6-flash";
const MAX_PROMPT_LENGTH = 4_000;

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  return apiKey ? new GoogleGenAI({ apiKey }) : null;
}

async function startServer() {
  const app = express();

  app.disable("x-powered-by");
  app.use(express.json({ limit: "32kb" }));

  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      aiConfigured: Boolean(process.env.GEMINI_API_KEY?.trim()),
      model: GEMINI_MODEL,
    });
  });

  app.post("/api/gemini/tadabbur", async (req, res) => {
    res.setHeader("Cache-Control", "no-store");

    try {
      const prompt = typeof req.body?.prompt === "string" ? req.body.prompt.trim() : "";
      const dhikrContext =
        typeof req.body?.dhikrContext === "string" ? req.body.dhikrContext.trim() : "";
      const mode = typeof req.body?.mode === "string" ? req.body.mode : "";

      if (!prompt && !dhikrContext) {
        return res.status(400).json({ error: "يرجى كتابة سؤال أو اختيار ذكر للتدبر." });
      }

      if (prompt.length > MAX_PROMPT_LENGTH || dhikrContext.length > MAX_PROMPT_LENGTH) {
        return res.status(413).json({ error: "النص طويل جداً. يرجى اختصاره ثم إعادة المحاولة." });
      }

      const ai = getGeminiClient();
      if (!ai) {
        return res.status(503).json({
          error: "مفتاح Gemini API غير مهيأ. أضف GEMINI_API_KEY إلى متغيرات البيئة.",
        });
      }

      let systemInstruction = `أنت «مُعين الذاكر»، مساعد عربي متخصص في شرح معاني الأذكار المأثورة وفضل الذكر.
تحدث بأسلوب إيماني رفيق وواضح، وميّز بدقة بين النصوص الصحيحة والمعاني العامة.
لا تنسب حديثاً إلى النبي ﷺ ولا تذكر حكماً شرعياً جازماً دون تثبت.
عند ذكر حديث أو أثر، اذكر مصدره ودرجة صحته عند القدرة، وصرّح بعدم اليقين عند عدم التحقق.
لا تقدّم نفسك بديلاً عن العلماء، ووجّه المستخدم إلى سؤال أهل العلم في المسائل الشرعية الخاصة أو المختلف فيها.
إذا سأل المستخدم عن معنى ذكر، فاشرح مفرداته وثمراته العملية من غير مبالغة أو وعود غير ثابتة.
إذا طلب جدولاً للأذكار، فصممه بصورة واقعية تراعي وقته وظروفه.
استخدم العربية الفصيحة المشرقة، مع تنسيق يسهل قراءته.`;

      if (mode === "explanation" && dhikrContext) {
        systemInstruction += `
المطلوب الآن: شرح وتدبر الذكر الآتي: «${dhikrContext}».`;
      }

      const userPrompt =
        prompt || `اشرح معنى هذا الذكر وفضله وثمراته العملية: «${dhikrContext}».`;

      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: userPrompt,
        config: {
          systemInstruction,
          temperature: 0.6,
        },
      });

      const result = response.text?.trim();
      if (!result) {
        return res.status(502).json({ error: "لم يصل رد نصي من المساعد. حاول مرة أخرى." });
      }

      return res.json({ result });
    } catch (error: unknown) {
      console.error("Error in /api/gemini/tadabbur:", error);
      const message = error instanceof Error ? error.message : "Unknown Gemini API error";
      return res.status(502).json({
        error: "تعذر الاتصال بمساعد التدبر حالياً. تحقق من المفتاح والحصة ثم حاول مجدداً.",
        details: process.env.NODE_ENV === "development" ? message : undefined,
      });
    }
  });

  const distPath = path.join(process.cwd(), "dist");
  const isBundledProduction = path.extname(__filename) === ".cjs";
  const isProduction = process.env.NODE_ENV === "production" || isBundledProduction;

  if (!isProduction) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const indexPath = path.join(distPath, "index.html");
    if (!fs.existsSync(indexPath)) {
      throw new Error(`Production build not found at ${indexPath}. Run npm run build first.`);
    }

    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(indexPath);
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Mudakir server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start Mudakir server:", error);
  process.exitCode = 1;
});
