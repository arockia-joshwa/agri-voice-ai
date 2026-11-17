# AgriVoice AI

AgriVoice AI is a mobile-first crop health assistant for farmers. It combines leaf image analysis with Tamil speech-to-text, agricultural chat, and Tamil text-to-speech. The React dashboard and secure Express API live in one repository.

## Features

- Leaf upload/camera capture with preview, validation, loading and error states
- Structured disease report: crop, disease, confidence, symptoms, causes, prevention and recommendations
- Tamil audio recording, transcription, contextual agricultural answers and audio playback
- Accessible responsive dashboard with large touch targets and English/Tamil labels
- Server-side credentials, CORS allowlist, rate limiting, security headers, input limits and upload signature checks
- OpenAI-compatible provider adapter isolated in `server/providers.ts`
- Demo responses when no AI key is configured, so the complete flow can be evaluated locally

## Requirements

- Node.js and pnpm versions listed in `.mise.toml`
- An OpenAI-compatible API key for live AI results (optional for demo mode)

## Installation

```bash
pnpm install
cp .env.example .env
```

Add your server-side credentials to `.env`. Never add this file or any API key to frontend source code.

## Environment configuration

| Variable | Purpose |
| --- | --- |
| `AI_API_KEY` | Server-only provider key. If empty, demo responses are returned. |
| `AI_BASE_URL` | OpenAI-compatible API base URL. |
| `VISION_MODEL` | Multimodal model used for leaf analysis. |
| `CHAT_MODEL` | LLM used for Tamil agricultural answers. |
| `STT_MODEL` | Tamil-capable speech recognition model. |
| `TTS_MODEL`, `TTS_VOICE` | Tamil-capable speech synthesis settings. |
| `CORS_ORIGINS` | Comma-separated allowed frontend origins. |
| `RATE_LIMIT_PER_MINUTE` | Maximum requests per client per minute. |
| `PORT` | Production server port. |

To use another provider, preserve the return types in `server/providers.ts` and replace the request implementation. This keeps frontend and route contracts unchanged.

## Local development

In Figma Make, the Vite server is managed automatically. The custom Vite middleware mounts the API on the same origin, so `/api/*` works without exposing a second port.

Outside Figma Make:

```bash
pnpm dev
```

## Production

```bash
pnpm build
pnpm start
```

The production Express process serves both `dist/` and the API. Configure the environment variables in your hosting platform, use HTTPS, set `CORS_ORIGINS` to the deployed origin, and avoid persistent local file storage. The upload handlers keep validated files in memory only for the duration of a request.

The app can be deployed to any Node.js host that supports a long-running process (Render, Railway, Fly.io, Azure App Service, Google Cloud Run, or similar). For serverless platforms, export `createApiApp()` through the platform adapter and deploy `dist/` as static assets.

## API

All error responses use `{ "error": "...", "requestId": "..." }`.

- `POST /api/detect-disease` — multipart form with `image` (JPG, PNG or WEBP, max 8 MB)
- `POST /api/speech-to-text` — multipart form with `audio` (max 12 MB)
- `POST /api/chat` — JSON `{ question, context? }`
- `POST /api/text-to-speech` — JSON `{ text }`; returns MP3 or a browser-speech fallback instruction

## Safety

Computer vision results are probabilistic. The UI and AI prompt avoid restricted pesticide prescriptions and remind farmers to confirm treatments and dosage with a qualified local agricultural officer.
