import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import helmet from "helmet";
import { createApiApp } from "./app";

const app = createApiApp();
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
// Security headers for the built frontend (production only). blob: is needed for
// the leaf photo preview and the text-to-speech audio player.
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: {
    directives: {
      imgSrc: ["'self'", "data:", "blob:"],
      mediaSrc: ["'self'", "blob:"],
      upgradeInsecureRequests: null,
    },
  },
}));
app.use(express.static(path.join(root, "dist")));
app.get("/{*splat}", (_req, res) => res.sendFile(path.join(root, "dist", "index.html")));

const port = Number(process.env.PORT || 8787);
app.listen(port, () => console.log(`AgriVoice AI listening on http://localhost:${port}`));
