import { motion } from "framer-motion";
import { Sparkles, Film, Youtube, TrendingUp, Zap, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";

const quickActions = [
  { icon: Sparkles, label: "Generate Script", path: "/generate", color: "gradient-primary" },
  { icon: Film, label: "Create Video", path: "/editor", color: "gradient-primary" },
  { icon: Youtube, label: "Auto YouTube", path: "/auto-youtube", color: "gradient-primary" },
];

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative">
      <div className="gradient-glow fixed inset-0 pointer-events-none" />
      <div className="relative p-4 space-y-6 max-w-lg mx-auto">
        <PageHeader title="AI YouTube Studio" subtitle="Create, generate & publish with AI" />

        <div className="grid grid-cols-2 gap-3">
          <StatCard icon={Film} label="Videos Created" value="24" trend="+3 this week" />
          <StatCard icon={TrendingUp} label="Total Views" value="12.4K" trend="+18%" />
          <StatCard icon={Zap} label="AI Credits" value="847" />
          <StatCard icon={Clock} label="Hours Saved" value="36h" />
        </div>

        <div>
          <h2 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Quick Actions</h2>
          <div className="grid grid-cols-3 gap-3">
            {quickActions.map(({ icon: Icon, label, path }, i) => (
              <motion.button
                key={path}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => navigate(path)}
                className="glass rounded-xl p-4 flex flex-col items-center gap-3 hover:shadow-glow transition-all active:scale-95"
              >
                <div className="gradient-primary p-2.5 rounded-lg">
                  <Icon className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xs font-medium text-center">{label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Recent Activity</h2>
          <div className="space-y-2">
            {["Gaming highlights montage", "Product review script", "Tech tutorial intro"].map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="glass rounded-lg p-3 flex items-center justify-between"
              >
                <span className="text-sm">{item}</span>
                <span className="text-xs text-muted-foreground">2h ago</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
