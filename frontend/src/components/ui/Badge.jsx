const tones = {
  teal: "bg-signal-teal/10 text-signal-teal border-signal-teal/30",
  amber: "bg-signal-amber/10 text-signal-amber border-signal-amber/30",
  rose: "bg-signal-rose/10 text-signal-rose border-signal-rose/30",
  neutral: "bg-ink-700 text-ink-300 border-ink-500",
};

const Badge = ({ children, tone = "neutral", className = "", dot = false }) => {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${tones[tone]} ${className}`}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
};

export default Badge;
