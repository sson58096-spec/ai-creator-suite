import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Image, Film, Copy, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PageHeader from "@/components/PageHeader";
import { toast } from "sonner";
import { generateScript, generateImage } from "@/lib/api";

type GenerateMode = "script" | "image";

const modes = [
  { id: "script" as const, icon: Sparkles, label: "Script" },
  { id: "image" as const, icon: Image, label: "Image" },
];

const Generate = () => {
  const [mode, setMode] = useState<GenerateMode>("script");
  const [prompt, setPrompt] = useState("");
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("engaging");
  const [length, setLength] = useState<"short" | "medium" | "long">("medium");
  const [loading, setLoading] = useState(false);
  const [scriptResult, setScriptResult] = useState<{ title: string; script: string; tags: string[] } | null>(null);
  const [imageResult, setImageResult] = useState<string | null>(null);

  const handleGenerate = async () => {
    const input = mode === "script" ? topic : prompt;
    if (!input.trim()) {
      toast.error("Please enter a prompt");
      return;
    }
    setLoading(true);
    setScriptResult(null);
    setImageResult(null);

    try {
      if (mode === "script") {
        const result = await generateScript({ topic, tone, length });
        setScriptResult(result);
        toast.success("Script generated!");
      } else {
        const result = await generateImage({ prompt });
        setImageResult(result.imageUrl);
        toast.success("Image generated!");
      }
    } catch (e: any) {
      toast.error(e.message || "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  const copyScript = () => {
    if (scriptResult) {
      navigator.clipboard.writeText(scriptResult.script);
      toast.success("Script copied!");
    }
  };

  return (
    <div className="min-h-screen p-4 max-w-lg mx-auto space-y-5 pb-24">
      <PageHeader title="Generate" subtitle="Create AI-powered content" />

      <div className="flex gap-2">
        {modes.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setMode(id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
              mode === id ? "gradient-primary text-primary-foreground shadow-glow" : "glass text-muted-foreground"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {mode === "script" ? (
          <>
            <Input
              placeholder="Video topic..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="bg-secondary border-border"
            />
            <div className="flex gap-2">
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger className="bg-secondary border-border flex-1">
                  <SelectValue placeholder="Tone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="engaging">Engaging</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="funny">Funny</SelectItem>
                  <SelectItem value="educational">Educational</SelectItem>
                </SelectContent>
              </Select>
              <Select value={length} onValueChange={(v) => setLength(v as any)}>
                <SelectTrigger className="bg-secondary border-border flex-1">
                  <SelectValue placeholder="Length" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">Short (~1 min)</SelectItem>
                  <SelectItem value="medium">Medium (~3 min)</SelectItem>
                  <SelectItem value="long">Long (~5 min)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        ) : (
          <Textarea
            placeholder="Describe the image you want to create..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="bg-secondary border-border min-h-[120px] resize-none"
          />
        )}

        <Button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full gradient-primary text-primary-foreground font-semibold shadow-glow"
        >
          {loading ? (
            <span className="animate-pulse">Generating...</span>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate {mode}
            </>
          )}
        </Button>
      </div>

      {/* Script Result */}
      {scriptResult && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">{scriptResult.title}</h3>
            <Button size="sm" variant="ghost" onClick={copyScript}><Copy className="w-4 h-4" /></Button>
          </div>
          <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-mono max-h-[400px] overflow-y-auto">{scriptResult.script}</pre>
          {scriptResult.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {scriptResult.tags.map((tag, i) => (
                <span key={i} className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">{tag}</span>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Image Result */}
      {imageResult && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-xl p-4 space-y-3">
          <h3 className="text-sm font-semibold">Generated Image</h3>
          <img src={imageResult} alt="Generated" className="w-full rounded-lg" />
          <a href={imageResult} download="generated-image.png">
            <Button size="sm" variant="outline" className="w-full"><Download className="w-4 h-4 mr-2" /> Download</Button>
          </a>
        </motion.div>
      )}
    </div>
  );
};

export default Generate;
