import { ShieldCheck } from "lucide-react";

const LoadingSpinner = ({ size = 28, label }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-3 text-ink-400">
      <div className="relative flex items-center justify-center">
        <span
          className="absolute inline-flex rounded-full border-2 border-signal-teal/30 animate-pulse-ring"
          style={{ width: size * 1.8, height: size * 1.8 }}
        />
        <ShieldCheck className="animate-pulse text-signal-teal" size={size} />
      </div>
      {label && <p className="mono-meta text-xs text-ink-400">{label}</p>}
    </div>
  );
};

export default LoadingSpinner;
