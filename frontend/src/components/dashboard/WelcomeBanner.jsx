import { useState } from "react";
import { Lightbulb, X } from "lucide-react";

const WelcomeBanner = ({
  message = "Share links expire after 24 hours and can be limited to 5 downloads — set a password on sensitive files for an extra layer of protection.",
}) => {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div className="flex items-start gap-3 rounded-xl border border-signal-amber/25 bg-signal-amber/5 px-4 py-3 text-sm text-ink-200">
      <Lightbulb size={16} className="mt-0.5 flex-shrink-0 text-signal-amber" />
      <p className="flex-1">{message}</p>
      <button
        onClick={() => setDismissed(true)}
        className="focus-ring flex-shrink-0 rounded p-0.5 text-ink-400 hover:text-ink-100"
      >
        <X size={14} />
      </button>
    </div>
  );
};

export default WelcomeBanner;
