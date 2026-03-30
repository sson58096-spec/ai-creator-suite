import { useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Sparkles, Youtube, MessageCircle, FolderOpen, Key } from "lucide-react";

const navItems = [
  { path: "/", icon: LayoutDashboard, label: "Home" },
  { path: "/generate", icon: Sparkles, label: "Generate" },
  { path: "/auto-youtube", icon: Youtube, label: "Auto YT" },
  { path: "/chat", icon: MessageCircle, label: "Chat" },
  { path: "/assets", icon: FolderOpen, label: "Assets" },
  { path: "/api-keys", icon: Key, label: "Keys" },
];

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border/50" style={{ height: "var(--nav-height)" }}>
      <div className="flex items-center justify-around h-full max-w-lg mx-auto px-2">
        {navItems.map(({ path, icon: Icon, label }) => {
          const active = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-all duration-200 ${
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className={`p-1.5 rounded-lg transition-all ${active ? "gradient-primary shadow-glow" : ""}`}>
                <Icon className={`w-5 h-5 ${active ? "text-primary-foreground" : ""}`} />
              </div>
              <span className="text-[10px] font-medium">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
