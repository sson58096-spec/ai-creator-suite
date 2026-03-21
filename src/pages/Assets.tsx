import { motion } from "framer-motion";
import { FolderOpen, Image, Film, FileText, Trash2 } from "lucide-react";
import PageHeader from "@/components/PageHeader";

const mockAssets = [
  { id: "1", name: "Gaming thumbnail.png", type: "image", date: "2h ago" },
  { id: "2", name: "Product review script.txt", type: "script", date: "5h ago" },
  { id: "3", name: "Tutorial intro.mp4", type: "video", date: "1d ago" },
  { id: "4", name: "Channel banner.png", type: "image", date: "2d ago" },
  { id: "5", name: "Vlog script.txt", type: "script", date: "3d ago" },
];

const typeIcons = { image: Image, video: Film, script: FileText };

const Assets = () => (
  <div className="min-h-screen p-4 max-w-lg mx-auto space-y-5">
    <PageHeader title="Assets" subtitle="Your generated files" />

    <div className="space-y-2">
      {mockAssets.map((asset, i) => {
        const Icon = typeIcons[asset.type as keyof typeof typeIcons] || FolderOpen;
        return (
          <motion.div
            key={asset.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass rounded-lg p-3 flex items-center gap-3"
          >
            <div className="p-2 rounded-lg bg-secondary">
              <Icon className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{asset.name}</p>
              <p className="text-xs text-muted-foreground">{asset.date}</p>
            </div>
            <button className="p-2 text-muted-foreground hover:text-destructive transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </motion.div>
        );
      })}
    </div>
  </div>
);

export default Assets;
