import { useState } from "react";
import { motion } from "framer-motion";
import { Youtube, Wand2, Upload, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import PageHeader from "@/components/PageHeader";
import { toast } from "sonner";

const steps = ["Topic", "Script", "Video", "Upload"];

const AutoYouTube = () => {
  const [topic, setTopic] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [running, setRunning] = useState(false);

  const handleStart = () => {
    if (!topic.trim()) {
      toast.error("Enter a topic first");
      return;
    }
    setRunning(true);
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setCurrentStep(step);
      if (step >= steps.length) {
        clearInterval(interval);
        setRunning(false);
        toast.success("Auto YouTube pipeline complete!");
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen p-4 max-w-lg mx-auto space-y-5">
      <PageHeader title="Auto YouTube" subtitle="Full automation pipeline" />

      <div className="glass rounded-xl p-4 space-y-4">
        <div className="flex items-center gap-3">
          <div className="gradient-primary p-2 rounded-lg">
            <Youtube className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">One-Click Video</h3>
            <p className="text-xs text-muted-foreground">Topic → Script → Video → Upload</p>
          </div>
        </div>

        <Input
          placeholder="Enter video topic..."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="bg-secondary border-border"
        />
        <Textarea
          placeholder="Optional: style notes, target audience..."
          className="bg-secondary border-border min-h-[80px] resize-none"
        />

        <Button
          onClick={handleStart}
          disabled={running}
          className="w-full gradient-primary text-primary-foreground font-semibold shadow-glow"
        >
          {running ? (
            <span className="animate-pulse">Processing...</span>
          ) : (
            <>
              <Wand2 className="w-4 h-4 mr-2" />
              Start Auto Pipeline
            </>
          )}
        </Button>
      </div>

      {/* Pipeline Progress */}
      <div className="space-y-2">
        {steps.map((step, i) => (
          <motion.div
            key={step}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: i <= currentStep && (running || currentStep >= steps.length) ? 1 : 0.5 }}
            className={`glass rounded-lg p-3 flex items-center gap-3 transition-all ${
              i < currentStep ? "border-primary/30" : ""
            }`}
          >
            {i < currentStep ? (
              <CheckCircle className="w-5 h-5 text-primary" />
            ) : i === currentStep && running ? (
              <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            ) : (
              <div className="w-5 h-5 rounded-full border-2 border-border" />
            )}
            <span className="text-sm font-medium">{step}</span>
            {i < currentStep && <span className="text-xs text-primary ml-auto">Done</span>}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AutoYouTube;
