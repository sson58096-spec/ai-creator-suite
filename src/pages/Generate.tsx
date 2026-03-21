import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Image, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import PageHeader from "@/components/PageHeader";
import { toast } from "sonner";

type GenerateMode = "script" | "image" | "video";

const modes = [
  { id: "script" as const, icon: Sparkles, label: "Script" },
  { id: "image" as const, icon: Image, label: "Image" },
  { id: "video" as const, icon: Film, label: "Video" },
];

const Generate = () => {
  const [mode, setMode] = useState<GenerateMode>("script");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }
    setLoading(true);
    setResult("");
    // Simulate API call
    setTimeout(() => {
      setResult(`Generated ${mode} content for: "${prompt}"\n\nThis is a placeholder result. Connect your backend API to get real AI-generated content.`);
      setLoading(false);
      toast.success(`${mode} generated successfully!`);
    }, 2000);
  };

  return (
    <div className="min-h-screen p-4 max-w-lg mx-auto space-y-5">
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
        <Input
          placeholder="Topic or title..."
          className="bg-secondary border-border"
        />
        <Textarea
          placeholder={`Describe the ${mode} you want to create...`}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="bg-secondary border-border min-h-[120px] resize-none"
        />
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

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl p-4"
        >
          <h3 className="text-sm font-semibold mb-2">Result</h3>
          <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-mono">{result}</pre>
        </motion.div>
      )}
    </div>
  );
};

export default Generate;
