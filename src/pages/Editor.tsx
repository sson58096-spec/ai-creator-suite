import { motion } from "framer-motion";
import { Film, Scissors, Type, Music, Layers } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";

const tools = [
  { icon: Scissors, label: "Trim" },
  { icon: Type, label: "Text" },
  { icon: Music, label: "Audio" },
  { icon: Layers, label: "Effects" },
];

const Editor = () => (
  <div className="min-h-screen p-4 max-w-lg mx-auto space-y-5">
    <PageHeader title="Editor" subtitle="Edit and refine your content" />

    {/* Video Preview Area */}
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass rounded-xl aspect-video flex items-center justify-center"
    >
      <div className="text-center space-y-2">
        <Film className="w-10 h-10 text-muted-foreground mx-auto" />
        <p className="text-sm text-muted-foreground">No video loaded</p>
        <Button variant="outline" size="sm" className="text-xs">
          Import Video
        </Button>
      </div>
    </motion.div>

    {/* Timeline Placeholder */}
    <div className="glass rounded-xl p-3">
      <div className="h-12 rounded-lg bg-secondary flex items-center justify-center">
        <span className="text-xs text-muted-foreground">Timeline</span>
      </div>
    </div>

    {/* Tool Bar */}
    <div className="flex justify-around">
      {tools.map(({ icon: Icon, label }) => (
        <button key={label} className="flex flex-col items-center gap-1 p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors active:scale-95">
          <Icon className="w-5 h-5" />
          <span className="text-[10px] font-medium">{label}</span>
        </button>
      ))}
    </div>
  </div>
);

export default Editor;
