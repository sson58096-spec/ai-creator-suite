import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  trend?: string;
}

const StatCard = ({ icon: Icon, label, value, trend }: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    className="glass rounded-xl p-4 space-y-2"
  >
    <div className="flex items-center gap-2 text-muted-foreground">
      <Icon className="w-4 h-4" />
      <span className="text-xs font-medium">{label}</span>
    </div>
    <div className="text-2xl font-bold">{value}</div>
    {trend && <span className="text-xs text-primary">{trend}</span>}
  </motion.div>
);

export default StatCard;
