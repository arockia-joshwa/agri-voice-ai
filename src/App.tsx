import { useEffect, useRef, useState, type ChangeEvent, type ReactNode } from "react";

type IconName =
  | "leaf"
  | "home"
  | "scan"
  | "mic"
  | "chart"
  | "info"
  | "upload"
  | "camera"
  | "sparkles"
  | "volume"
  | "send"
  | "check"
  | "shield"
  | "clock"
  | "menu"
  | "close"
  | "sprout";

type DiseaseResult = {
  crop: string;
  disease: string;
  confidence: number;
  symptoms: string[];
  causes: string[];
  prevention: string[];
  recommendations: string[];
};

type ChatMessage = { role: "user" | "assistant"; text: string };

const navItems: { id: string; label: string; tamil: string; icon: IconName }[] = [
  { id: "home", label: "Home", tamil: "முகப்பு", icon: "home" },
  { id: "detect", label: "Disease Detection", tamil: "நோய் கண்டறிதல்", icon: "scan" },
  { id: "voice", label: "Tamil Voice", tamil: "தமிழ் குரல்", icon: "mic" },
  { id: "results", label: "Results", tamil: "முடிவுகள்", icon: "chart" },
  { id: "about", label: "About", tamil: "எங்களை பற்றி", icon: "info" },
];

const paths: Record<IconName, ReactNode> = {
  leaf: <><path d="M20 4C12 4 5 8.5 5 15c0 2.5 1.5 4 4 4 6.5 0 10-7 11-15Z"/><path d="M4 22c2-6 6-10 13-14"/></>,
  home: <><path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10M9 20v-6h6v6"/></>,
  scan: <><path d="M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4"/><path d="M8 14c4 0 7-2.5 8-6-5 0-8 2-8 6Z"/><path d="M8 16c1-3 3-5 6-6"/></>,
  mic: <><rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3M9 21h6"/></>,
  chart: <><path d="M4 19V9M10 19V5M16 19v-7M22 19H2"/></>,
  info: <><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></>,
  upload: <><path d="M12 16V4m0 0L7 9m5-5 5 5"/><path d="M4 15v5h16v-5"/></>,
  camera: <><path d="M4 7h3l2-3h6l2 3h3v12H4Z"/><circle cx="12" cy="13" r="4"/></>,
  sparkles: <><path d="m12 3 1.2 3.8L17 8l-3.8 1.2L12 13l-1.2-3.8L7 8l3.8-1.2ZM19 14l.7 2.3L22 17l-2.3.7L19 20l-.7-2.3L16 17l2.3-.7Z"/></>,
  volume: <><path d="M5 10v4h4l5 4V6l-5 4Z"/><path d="M17 9a4 4 0 0 1 0 6M19 6a8 8 0 0 1 0 12"/></>,
  send: <><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></>,
  check: <path d="m5 12 4 4L19 6"/>,
  shield: <><path d="M12 3 4 6v6c0 5 3 8 8 10 5-2 8-5 8-10V6Z"/><path d="m9 12 2 2 4-4"/></>,
  clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
  menu: <path d="M4 7h16M4 12h16M4 17h16"/>,
  close: <path d="m6 6 12 12M18 6 6 18"/>,
  sprout: <><path d="M12 21v-9"/><path d="M12 15c-5 0-8-3-8-8 5 0 8 3 8 8ZM12 12c0-5 3-8 8-8 0 5-3 8-8 8Z"/></>,
};

function Icon({ name, className = "size-5" }: { name: IconName; className?: string }) {
  return <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

function Button({ children, variant = "primary", className = "", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" }) {
  const variants = {
    primary: "bg-emerald-700 text-white shadow-sm hover:bg-emerald-800 focus:ring-emerald-300",
    secondary: "border border-emerald-200 bg-white text-emerald-800 hover:bg-emerald-50 focus:ring-emerald-200",
    ghost: "text-stone-600 hover:bg-stone-100 focus:ring-stone-200",
  };
  return <button className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-5 py-3 font-semibold transition focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:opacity-55 ${variants[variant]} ${className}`} {...props}>{children}</button>;
}

async function readError(response: Response) {
  const body = await response.json().catch(() => ({}));
  return body.error || "Something went wrong. Please try again.";
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState<DiseaseResult | null>(null);
  const [detectLoading, setDetectLoading] = useState(false);
  const [detectError, setDetectError] = useState("");
  const [recording, setRecording] = useState(false);
  const [voiceLoading, setVoiceLoading] = useState(false);
  const [voiceError, setVoiceError] = useState("");
  const [transcript, setTranscript] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  const navigate = (id: string) => {
    setActiveSection(id);
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const selectImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 8 * 1024 * 1024) {
      setDetectError("Please choose a JPG, PNG or WEBP image under 8 MB.");
      return;
    }
    if (preview) URL.revokeObjectURL(preview);
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
    setDetectError("");
  };

  const analyze = async () => {
    if (!image) return setDetectError("Please add a clear leaf photo first.");
    setDetectLoading(true);
    setDetectError("");
    const form = new FormData();
    form.append("image", image);
    try {
      const response = await fetch("/api/detect-disease", { method: "POST", body: form });
      if (!response.ok) throw new Error(await readError(response));
      const data = await response.json();
      setResult(data.result);
      setActiveSection("results");
    } catch (error) {
      setDetectError(error instanceof Error ? error.message : "Analysis failed.");
    } finally {
      setDetectLoading(false);
    }
  };

  const toggleRecording = async () => {
    if (recording) {
      mediaRecorder.current?.stop();
      setRecording(false);
      return;
    }
    setVoiceError("");
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      setVoiceError("Voice recording is not supported in this browser. Type your question below.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      audioChunks.current = [];
      recorder.ondataavailable = (event) => event.data.size && audioChunks.current.push(event.data);
      recorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        const audio = new Blob(audioChunks.current, { type: recorder.mimeType || "audio/webm" });
        const form = new FormData();
        form.append("audio", audio, "question.webm");
        setVoiceLoading(true);
        try {
          const response = await fetch("/api/speech-to-text", { method: "POST", body: form });
          if (!response.ok) throw new Error(await readError(response));
          const data = await response.json();
          setTranscript(data.transcript);
        } catch (error) {
          setVoiceError(error instanceof Error ? error.message : "Could not understand the recording.");
        } finally {
          setVoiceLoading(false);
        }
      };
      recorder.start();
      mediaRecorder.current = recorder;
      setRecording(true);
    } catch {
      setVoiceError("Microphone permission was not granted. You can type your question instead.");
    }
  };

  const sendQuestion = async () => {
    const question = transcript.trim();
    if (!question) return setVoiceError("தமிழில் உங்கள் கேள்வியை பேசவும் அல்லது தட்டச்சு செய்யவும்.");
    setVoiceError("");
    setMessages((current) => [...current, { role: "user", text: question }]);
    setTranscript("");
    setChatLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, context: result }),
      });
      if (!response.ok) throw new Error(await readError(response));
      const data = await response.json();
      setMessages((current) => [...current, { role: "assistant", text: data.answer }]);
    } catch (error) {
      setVoiceError(error instanceof Error ? error.message : "AI response failed.");
    } finally {
      setChatLoading(false);
    }
  };

  const speak = async (text: string) => {
    try {
      const response = await fetch("/api/text-to-speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (response.headers.get("content-type")?.includes("audio/")) {
        const audio = new Audio(URL.createObjectURL(await response.blob()));
        await audio.play();
        return;
      }
      throw new Error("browser fallback");
    } catch {
      if ("speechSynthesis" in window) {
        speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "ta-IN";
        speechSynthesis.speak(utterance);
      } else setVoiceError("Audio playback is not available in this browser.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8faf5] text-stone-800">
      <header className="sticky top-0 z-40 flex h-18 items-center justify-between border-b border-stone-200 bg-white/95 px-4 backdrop-blur lg:hidden">
        <Logo />
        <button aria-label={menuOpen ? "Close navigation" : "Open navigation"} onClick={() => setMenuOpen(!menuOpen)} className="rounded-xl p-3 text-stone-700 hover:bg-stone-100"><Icon name={menuOpen ? "close" : "menu"} /></button>
      </header>

      <aside className={`fixed inset-y-0 left-0 z-50 w-72 border-r border-emerald-900/10 bg-[#123d2b] p-5 text-white transition-transform lg:translate-x-0 ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="mb-10 flex items-center justify-between">
          <Logo inverse />
          <button aria-label="Close navigation" onClick={() => setMenuOpen(false)} className="rounded-lg p-2 lg:hidden"><Icon name="close" /></button>
        </div>
        <nav aria-label="Main navigation" className="space-y-2">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => navigate(item.id)} className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition ${activeSection === item.id ? "bg-white text-emerald-900 shadow-lg" : "text-emerald-50 hover:bg-white/10"}`}>
              <Icon name={item.icon} className="size-5 shrink-0" />
              <span><span className="block text-sm font-semibold">{item.label}</span><span className={`block text-xs ${activeSection === item.id ? "text-stone-500" : "text-emerald-200"}`}>{item.tamil}</span></span>
            </button>
          ))}
        </nav>
        <div className="absolute inset-x-5 bottom-5 rounded-2xl bg-white/10 p-4">
          <div className="mb-2 flex items-center gap-2 text-emerald-200"><Icon name="shield" className="size-4" /><span className="text-xs font-semibold uppercase tracking-wider">Farmer-first AI</span></div>
          <p className="text-sm leading-relaxed text-emerald-50">Your crop images are processed securely and are never used for advertising.</p>
        </div>
      </aside>

      {menuOpen && <button aria-label="Close menu overlay" className="fixed inset-0 z-40 bg-stone-950/40 lg:hidden" onClick={() => setMenuOpen(false)} />}

      <main className="lg:ml-72">
        <section id="home" className="scroll-mt-20 px-4 py-6 sm:px-8 lg:px-12 lg:py-10">
          <div className="mx-auto max-w-6xl">
            <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div><p className="mb-1 text-sm font-semibold text-emerald-700">வணக்கம், விவசாயி</p><h1 className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">Good morning, Farmer</h1></div>
              <div className="flex items-center gap-2 self-start rounded-full border border-stone-200 bg-white px-4 py-2 text-sm text-stone-600"><span className="size-2 rounded-full bg-emerald-500"></span> AI services online</div>
            </div>

            <div className="relative overflow-hidden rounded-[2rem] bg-[#dff3dd] px-6 py-9 sm:px-10 sm:py-12">
              <div className="relative z-10 max-w-2xl">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800"><Icon name="sparkles" className="size-4" /> Smart farming, made simple</div>
                <h2 className="max-w-xl text-3xl font-bold leading-tight tracking-tight text-[#163c2c] sm:text-5xl">Show the leaf, speak in Tamil, get AI agricultural assistance.</h2>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-emerald-950/70 sm:text-lg">இலையை காட்டுங்கள், தமிழில் பேசுங்கள், உடனடி விவசாய ஆலோசனை பெறுங்கள்.</p>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <Button onClick={() => navigate("detect")}><Icon name="scan" /> Check a crop leaf</Button>
                  <Button variant="secondary" onClick={() => navigate("voice")}><Icon name="mic" /> Ask in Tamil</Button>
                </div>
              </div>
              <FieldIllustration />
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {[
                ["scan", "Leaf disease scan", "Quick visual checks", "நோய் கண்டறிதல்"],
                ["mic", "Tamil voice help", "Speak naturally", "தமிழில் பேசுங்கள்"],
                ["clock", "Fast guidance", "Available any time", "24/7 உதவி"],
              ].map(([icon, title, desc, tamil]) => <div key={title} className="flex items-center gap-4 rounded-2xl border border-stone-200 bg-white p-4"><div className="grid size-12 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-700"><Icon name={icon as IconName} /></div><div><h3 className="font-bold text-stone-900">{title}</h3><p className="text-sm text-stone-500">{desc} · {tamil}</p></div></div>)}
            </div>
          </div>
        </section>

        <section id="detect" className="scroll-mt-20 px-4 py-10 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-6xl">
            <SectionHeading eyebrow="Crop health" title="Disease Detection" tamil="பயிர் நோய் கண்டறிதல்" description="Upload a clear photo of one affected leaf. For best results, use natural light and keep the leaf in focus." />
            <div className="grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
              <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm sm:p-7">
                <label className={`group relative grid min-h-80 cursor-pointer place-items-center overflow-hidden rounded-2xl border-2 border-dashed transition ${preview ? "border-emerald-300 bg-stone-50" : "border-stone-300 bg-[#fafbf8] hover:border-emerald-500 hover:bg-emerald-50/40"}`}>
                  <input className="sr-only" type="file" accept="image/jpeg,image/png,image/webp" capture="environment" onChange={selectImage} />
                  {preview ? <img src={preview} alt="Selected crop leaf preview" className="h-80 w-full object-contain" /> : <div className="px-5 text-center"><div className="mx-auto mb-4 grid size-16 place-items-center rounded-2xl bg-emerald-100 text-emerald-700"><Icon name="upload" className="size-7" /></div><p className="text-lg font-bold text-stone-800">Add a crop leaf photo</p><p className="mt-1 text-sm text-stone-500">Tap to capture or upload · JPG, PNG, WEBP · max 8 MB</p><span className="mt-4 inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-800"><Icon name="camera" className="size-4" /> Choose photo</span></div>}
                </label>
                {detectError && <Alert>{detectError}</Alert>}
                <Button className="mt-4 w-full text-base" disabled={!image || detectLoading} onClick={analyze}>
                  {detectLoading ? <><span className="size-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></span> Analyzing leaf...</> : <><Icon name="sparkles" /> Analyze Disease</>}
                </Button>
              </div>
              <div className="rounded-3xl bg-[#f0eadf] p-6 sm:p-8">
                <span className="grid size-12 place-items-center rounded-xl bg-white text-amber-700"><Icon name="sprout" /></span>
                <h3 className="mt-5 text-xl font-bold text-stone-900">For a better result</h3>
                <div className="mt-5 space-y-4">
                  {["Photograph one leaf at a time", "Use daylight and avoid strong shadows", "Show both healthy and affected areas", "Keep the camera steady and close"].map((tip, index) => <div key={tip} className="flex gap-3"><span className="grid size-7 shrink-0 place-items-center rounded-full bg-white text-xs font-bold text-emerald-700">{index + 1}</span><p className="pt-0.5 text-sm leading-relaxed text-stone-700">{tip}</p></div>)}
                </div>
                <p className="mt-7 border-t border-stone-300 pt-5 text-xs leading-relaxed text-stone-500">AI results are guidance, not a final diagnosis. Consult your local agricultural officer before applying chemicals.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="voice" className="scroll-mt-20 bg-[#edf5ec] px-4 py-12 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-6xl">
            <SectionHeading eyebrow="Hands-free help" title="Tamil Voice Assistant" tamil="தமிழ் குரல் உதவியாளர்" description="Ask a farming question naturally in Tamil. AgriVoice uses your latest crop result to give a simple, relevant answer." />
            <div className="grid gap-6 lg:grid-cols-[.75fr_1.25fr]">
              <div className="flex flex-col items-center justify-center rounded-3xl bg-[#173e2d] p-7 text-center text-white">
                <button onClick={toggleRecording} disabled={voiceLoading} aria-label={recording ? "Stop recording" : "Start Tamil voice recording"} className={`relative grid size-24 place-items-center rounded-full transition focus:outline-none focus:ring-4 focus:ring-white/30 ${recording ? "bg-red-500" : "bg-[#f2b94b] text-emerald-950 hover:scale-105"}`}>
                  {recording && <span className="absolute inset-0 animate-ping rounded-full bg-red-400 opacity-40"></span>}
                  <Icon name={recording ? "close" : "mic"} className="relative size-9" />
                </button>
                <h3 className="mt-5 text-xl font-bold">{recording ? "Listening…" : voiceLoading ? "Converting speech…" : "Tap and speak in Tamil"}</h3>
                <p className="mt-2 text-sm text-emerald-100">{recording ? "முடித்ததும் மீண்டும் தட்டவும்" : "தமிழில் உங்கள் கேள்வியை கேளுங்கள்"}</p>
                {result && <div className="mt-6 w-full rounded-xl bg-white/10 p-3 text-left text-xs text-emerald-100">Using context: <strong className="text-white">{result.crop} · {result.disease}</strong></div>}
              </div>
              <div className="rounded-3xl border border-emerald-900/10 bg-white p-5 shadow-sm sm:p-7">
                <div className="mb-4 max-h-72 space-y-3 overflow-y-auto" aria-live="polite">
                  {messages.length === 0 ? <div className="rounded-2xl bg-stone-50 p-5 text-sm leading-relaxed text-stone-500"><strong className="mb-1 block text-stone-700">Try asking:</strong> “இந்த இலை நோய்க்கு என்ன செய்ய வேண்டும்?”<br />“தக்காளிக்கு எவ்வளவு தண்ணீர் தேவை?”</div> : messages.map((message, index) => <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}><div className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${message.role === "user" ? "rounded-br-md bg-emerald-700 text-white" : "rounded-bl-md bg-emerald-50 text-stone-800"}`}><p>{message.text}</p>{message.role === "assistant" && <button onClick={() => speak(message.text)} className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700"><Icon name="volume" className="size-4" /> Listen in Tamil</button>}</div></div>)}
                  {chatLoading && <div className="flex gap-1 rounded-xl bg-emerald-50 p-4 w-fit"><span className="size-2 animate-bounce rounded-full bg-emerald-600"></span><span className="size-2 animate-bounce rounded-full bg-emerald-600 [animation-delay:150ms]"></span><span className="size-2 animate-bounce rounded-full bg-emerald-600 [animation-delay:300ms]"></span></div>}
                </div>
                <label htmlFor="question" className="mb-2 block text-sm font-bold text-stone-700">Your question · உங்கள் கேள்வி</label>
                <div className="flex gap-2">
                  <textarea id="question" value={transcript} onChange={(e) => setTranscript(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendQuestion(); } }} rows={2} placeholder="தமிழில் கேள்வியை தட்டச்சு செய்யவும்…" className="min-h-14 flex-1 resize-none rounded-xl border border-stone-300 px-4 py-3 text-base outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100" />
                  <Button aria-label="Send question" className="self-stretch px-4" disabled={chatLoading || !transcript.trim()} onClick={sendQuestion}><Icon name="send" /></Button>
                </div>
                {voiceError && <Alert>{voiceError}</Alert>}
              </div>
            </div>
          </div>
        </section>

        <section id="results" className="scroll-mt-20 px-4 py-12 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-6xl">
            <SectionHeading eyebrow="Your report" title="Analysis Results" tamil="ஆய்வு முடிவுகள்" description="A clear summary of the detected issue and practical next steps." />
            {result ? <ResultCard result={result} preview={preview} onAsk={() => navigate("voice")} /> : <div className="rounded-3xl border-2 border-dashed border-stone-200 bg-white py-16 text-center"><div className="mx-auto grid size-16 place-items-center rounded-2xl bg-stone-100 text-stone-500"><Icon name="chart" className="size-7" /></div><h3 className="mt-4 text-lg font-bold">No analysis yet</h3><p className="mt-1 text-sm text-stone-500">Upload a leaf photo to create your first crop health report.</p><Button className="mt-5" onClick={() => navigate("detect")}><Icon name="scan" /> Start a scan</Button></div>}
          </div>
        </section>

        <section id="about" className="scroll-mt-20 bg-[#173e2d] px-4 py-12 text-white sm:px-8 lg:px-12">
          <div className="mx-auto grid max-w-6xl gap-9 lg:grid-cols-2 lg:items-center">
            <div><p className="mb-3 text-sm font-bold uppercase tracking-widest text-[#f2b94b]">Technology with purpose</p><h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Built to put practical AI in every farmer’s hands.</h2><p className="mt-4 leading-relaxed text-emerald-100">AgriVoice AI combines crop image analysis and Tamil voice technology to make timely agricultural guidance easier to access. It is designed for clarity, privacy and low-friction use in the field.</p></div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[["shield", "Private by design", "Keys stay on the server and uploads are validated."], ["sprout", "Farmer friendly", "Simple guidance in familiar language."], ["sparkles", "Replaceable AI", "Flexible providers for vision, voice and chat."], ["info", "Responsible support", "Clear reminders to consult local experts."]].map(([icon, title, desc]) => <div key={title} className="rounded-2xl bg-white/10 p-5"><Icon name={icon as IconName} className="size-6 text-[#f2b94b]" /><h3 className="mt-3 font-bold">{title}</h3><p className="mt-1 text-sm leading-relaxed text-emerald-100">{desc}</p></div>)}
            </div>
          </div>
        </section>
        <footer className="border-t border-white/10 bg-[#123426] px-4 py-5 text-center text-xs text-emerald-200 lg:ml-0">AgriVoice AI · Agricultural guidance should be verified with a qualified local expert.</footer>
      </main>
    </div>
  );
}

function Logo({ inverse = false }: { inverse?: boolean }) {
  return <div className="flex items-center gap-2.5"><span className={`grid size-10 place-items-center rounded-xl ${inverse ? "bg-[#f2b94b] text-emerald-950" : "bg-emerald-700 text-white"}`}><Icon name="leaf" /></span><span><span className={`block text-lg font-extrabold leading-none ${inverse ? "text-white" : "text-emerald-950"}`}>AgriVoice <span className={inverse ? "text-[#f2b94b]" : "text-emerald-600"}>AI</span></span><span className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${inverse ? "text-emerald-200" : "text-stone-500"}`}>விவசாய உதவியாளர்</span></span></div>;
}

function SectionHeading({ eyebrow, title, tamil, description }: { eyebrow: string; title: string; tamil: string; description: string }) {
  return <div className="mb-7 max-w-2xl"><p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">{eyebrow}</p><h2 className="text-3xl font-bold tracking-tight text-stone-900">{title} <span className="text-xl font-medium text-stone-400">· {tamil}</span></h2><p className="mt-3 leading-relaxed text-stone-600">{description}</p></div>;
}

function Alert({ children }: { children: ReactNode }) {
  return <div role="alert" className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{children}</div>;
}

function ResultCard({ result, preview, onAsk }: { result: DiseaseResult; preview: string; onAsk: () => void }) {
  const details = [
    ["Symptoms", result.symptoms],
    ["Likely causes", result.causes],
    ["Prevention", result.prevention],
    ["Basic recommendations", result.recommendations],
  ] as const;
  return <div className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
    <div className="grid bg-[#173e2d] text-white md:grid-cols-[18rem_1fr]">
      {preview && <img src={preview} alt="Analyzed crop leaf" className="h-56 w-full object-cover md:h-full" />}
      <div className="p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-100">{result.crop}</span><span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/20 px-3 py-1 text-xs font-bold text-emerald-100"><Icon name="check" className="size-3.5" /> Analysis complete</span></div>
        <h3 className="mt-4 text-3xl font-bold">{result.disease}</h3>
        <div className="mt-5"><div className="mb-2 flex justify-between text-sm"><span className="text-emerald-100">Model confidence</span><strong>{result.confidence}%</strong></div><div className="h-2 overflow-hidden rounded-full bg-white/15"><div className="h-full rounded-full bg-[#f2b94b]" style={{ width: `${result.confidence}%` }}></div></div></div>
      </div>
    </div>
    <div className="grid gap-px bg-stone-200 sm:grid-cols-2">
      {details.map(([title, items], index) => <div key={title} className="bg-white p-6"><div className="mb-3 flex items-center gap-2"><span className={`grid size-7 place-items-center rounded-lg text-xs font-bold ${index === 3 ? "bg-amber-100 text-amber-800" : "bg-emerald-50 text-emerald-700"}`}>{index + 1}</span><h4 className="font-bold text-stone-900">{title}</h4></div><ul className="space-y-2">{items.map((item) => <li key={item} className="flex gap-2 text-sm leading-relaxed text-stone-600"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-emerald-500"></span>{item}</li>)}</ul></div>)}
    </div>
    <div className="flex flex-col items-start justify-between gap-4 bg-amber-50 p-5 sm:flex-row sm:items-center"><p className="max-w-2xl text-sm text-amber-900"><strong>Important:</strong> Confirm treatment and dosage with your local agricultural officer.</p><Button onClick={onAsk}><Icon name="mic" /> Ask about this result</Button></div>
  </div>;
}

function FieldIllustration() {
  return <svg aria-hidden="true" viewBox="0 0 420 320" className="absolute -bottom-8 -right-10 hidden w-[42%] max-w-md opacity-90 md:block">
    <circle cx="280" cy="72" r="43" fill="#f2b94b" />
    <path d="M0 220c105-72 239-73 420-10v110H0Z" fill="#95c98f" />
    <path d="M0 254c139-56 278-55 420 5v61H0Z" fill="#4c9164" />
    <path d="M110 320c65-55 127-83 187-88M220 320c38-37 76-60 116-73M38 298c80-37 151-58 214-65" stroke="#dff3dd" strokeWidth="10" fill="none" strokeLinecap="round" />
    <path d="M110 205v54m0-34c-23 0-36-14-36-37 23 0 36 14 36 37Zm0 13c0-23 14-37 37-37 0 23-14 37-37 37ZM325 192v50m0-31c-20 0-31-12-31-32 20 0 31 12 31 32Zm0 12c0-20 12-32 32-32 0 20-12 32-32 32Z" fill="#276344" stroke="#276344" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>;
}
