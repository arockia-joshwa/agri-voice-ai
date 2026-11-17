import "dotenv/config";
import express, { type NextFunction, type Request, type Response } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import multer from "multer";
import crypto from "node:crypto";
import { answerQuestion, detectDisease, synthesizeSpeech, transcribeAudio } from "./providers";

const IMAGE_LIMIT = 8 * 1024 * 1024;
const AUDIO_LIMIT = 12 * 1024 * 1024;
const imageUpload = multer({ storage: multer.memoryStorage(), limits: { fileSize: IMAGE_LIMIT, files: 1 } });
const audioUpload = multer({ storage: multer.memoryStorage(), limits: { fileSize: AUDIO_LIMIT, files: 1 } });

function validImage(buffer: Buffer) {
  const jpg = buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  const png = buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  const webp = buffer.subarray(0, 4).toString() === "RIFF" && buffer.subarray(8, 12).toString() === "WEBP";
  return jpg || png || webp;
}

export function createApiApp() {
  const app = express();
  app.disable("x-powered-by");
  app.set("trust proxy", 1);
  app.use("/api", helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
  const origins = (process.env.CORS_ORIGINS || "http://localhost:8443").split(",").map((value) => value.trim());
  app.use(cors({ origin: (origin, callback) => callback(null, !origin || origins.includes(origin)), methods: ["POST", "OPTIONS"], maxAge: 86400 }));
  app.use(express.json({ limit: "48kb", strict: true }));
  app.use((req, res, next) => { res.locals.requestId = crypto.randomUUID(); res.setHeader("X-Request-Id", res.locals.requestId); next(); });
  app.use("/api", rateLimit({ windowMs: 60_000, limit: Number(process.env.RATE_LIMIT_PER_MINUTE || 30), standardHeaders: "draft-8", legacyHeaders: false }));

  app.post("/api/detect-disease", imageUpload.single("image"), async (req, res, next) => {
    try {
      if (!req.file || !validImage(req.file.buffer)) return res.status(400).json({ error: "A valid JPG, PNG or WEBP image is required." });
      const result = await detectDisease(req.file);
      res.json({ result });
    } catch (error) { next(error); }
  });

  app.post("/api/speech-to-text", audioUpload.single("audio"), async (req, res, next) => {
    try {
      if (!req.file || !req.file.mimetype.startsWith("audio/")) return res.status(400).json({ error: "A valid audio recording is required." });
      const transcript = await transcribeAudio(req.file);
      if (!transcript) return res.status(422).json({ error: "No speech was detected. Please try again in a quiet place." });
      res.json({ transcript });
    } catch (error) { next(error); }
  });

  app.post("/api/chat", async (req, res, next) => {
    try {
      const question = typeof req.body?.question === "string" ? req.body.question.trim() : "";
      if (!question || question.length > 1200) return res.status(400).json({ error: "Question must be between 1 and 1,200 characters." });
      const answer = await answerQuestion(question, req.body.context);
      res.json({ answer });
    } catch (error) { next(error); }
  });

  app.post("/api/text-to-speech", async (req, res, next) => {
    try {
      const text = typeof req.body?.text === "string" ? req.body.text.trim() : "";
      if (!text || text.length > 2000) return res.status(400).json({ error: "Text must be between 1 and 2,000 characters." });
      const audio = await synthesizeSpeech(text);
      if (!audio) return res.json({ useBrowserSpeech: true, language: "ta-IN" });
      res.type("audio/mpeg").send(audio);
    } catch (error) { next(error); }
  });

  app.use("/api", (_req, res) => res.status(404).json({ error: "API endpoint not found." }));
  app.use((error: Error & { code?: string }, _req: Request, res: Response, _next: NextFunction) => {
    console.error(`[${res.locals.requestId}]`, error.message);
    if (error instanceof multer.MulterError) return res.status(400).json({ error: error.code === "LIMIT_FILE_SIZE" ? "The uploaded file is too large." : "Invalid file upload.", requestId: res.locals.requestId });
    res.status(500).json({ error: "The service could not complete your request. Please try again.", requestId: res.locals.requestId });
  });
  return app;
}
