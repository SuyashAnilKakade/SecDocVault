import { UploadCloud, FileText, ScrollText } from "lucide-react";
import { useNavigate } from "react-router-dom";

const actions = [
  { label: "Upload document", icon: UploadCloud, tone: "teal", action: "upload" },
  { label: "My documents", icon: FileText, tone: "amber", to: "/documents" },
  { label: "Activity log", icon: ScrollText, tone: "neutral", to: "/audit-logs" },
];

const toneMap = {
  teal: "bg-signal-teal/10 text-signal-teal group-hover:bg-signal-teal/20",
  amber: "bg-signal-amber/10 text-signal-amber group-hover:bg-signal-amber/20",
  neutral: "bg-ink-700 text-ink-300 group-hover:bg-ink-600",
};

const QuickActions = ({ onUploadClick }) => {
  const navigate = useNavigate();

  const handleClick = (item) => {
    if (item.action === "upload") onUploadClick?.();
    else if (item.to) navigate(item.to);
  };

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {actions.map((item) => (
        <button
          key={item.label}
          onClick={() => handleClick(item)}
          className="focus-ring group flex items-center gap-3 rounded-xl border border-ink-700 bg-ink-800/60 p-4 text-left transition-all hover:border-ink-500 hover:bg-ink-800"
        >
          <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg transition-colors ${toneMap[item.tone]}`}>
            <item.icon size={18} />
          </div>
          <span className="text-sm font-medium text-ink-100">{item.label}</span>
        </button>
      ))}
    </div>
  );
};

export default QuickActions;
