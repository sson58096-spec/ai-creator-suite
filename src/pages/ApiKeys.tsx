import { useState } from "react";
import { Key, Eye, EyeOff, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PageHeader from "@/components/PageHeader";
import { toast } from "sonner";

const keyFields = [
  { id: "backend_url", label: "Backend API URL", placeholder: "https://your-app.onrender.com/api" },
  { id: "openai_key", label: "OpenAI API Key", placeholder: "sk-..." },
  { id: "runway_key", label: "Runway API Key", placeholder: "key_..." },
  { id: "youtube_key", label: "YouTube API Key", placeholder: "AIza..." },
];

const ApiKeys = () => {
  const [keys, setKeys] = useState<Record<string, string>>({});
  const [visible, setVisible] = useState<Record<string, boolean>>({});

  const handleSave = () => {
    Object.entries(keys).forEach(([k, v]) => {
      if (v) localStorage.setItem(`ai_${k}`, v);
    });
    toast.success("API keys saved securely");
  };

  return (
    <div className="min-h-screen p-4 max-w-lg mx-auto space-y-5">
      <PageHeader title="API Keys" subtitle="Configure your service connections" />

      <div className="space-y-4">
        {keyFields.map(({ id, label, placeholder }) => (
          <div key={id} className="space-y-1.5">
            <label className="text-sm font-medium flex items-center gap-2">
              <Key className="w-3.5 h-3.5 text-muted-foreground" />
              {label}
            </label>
            <div className="relative">
              <Input
                type={visible[id] ? "text" : "password"}
                placeholder={placeholder}
                value={keys[id] || ""}
                onChange={(e) => setKeys((prev) => ({ ...prev, [id]: e.target.value }))}
                className="bg-secondary border-border pr-10"
              />
              <button
                onClick={() => setVisible((p) => ({ ...p, [id]: !p[id] }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {visible[id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        ))}
      </div>

      <Button onClick={handleSave} className="w-full gradient-primary text-primary-foreground font-semibold shadow-glow">
        <Save className="w-4 h-4 mr-2" />
        Save Keys
      </Button>

      <p className="text-xs text-muted-foreground text-center">Keys are stored locally on your device</p>
    </div>
  );
};

export default ApiKeys;
