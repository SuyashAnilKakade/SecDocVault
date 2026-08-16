import { UploadCloud, ShieldCheck } from "lucide-react";
import Button from "../ui/Button";

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
};

const HeroSection = ({ fullName, onUploadClick }) => {
  const firstName = fullName?.split(" ")[0] || "there";

  return (
    <div className="relative overflow-hidden rounded-2xl border border-ink-700 bg-gradient-to-br from-ink-800 via-ink-800 to-ink-900 p-6 sm:p-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-60">
        <div className="absolute -right-10 -top-16 h-56 w-56 rounded-full bg-signal-teal/10 blur-3xl" />
        <div className="absolute -bottom-10 left-1/3 h-40 w-40 rounded-full bg-signal-amber/10 blur-3xl" />
      </div>

      <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
        <div>
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-signal-teal/30 bg-signal-teal/10 px-3 py-1 text-xs font-medium text-signal-teal">
            <ShieldCheck size={13} />
            Vault secured · AES-256
          </div>
          <h1 className="font-display text-2xl font-semibold text-ink-100 sm:text-3xl">
            {getGreeting()}, {firstName}
          </h1>
          <p className="mt-1.5 max-w-md text-sm text-ink-400">
            Every file here is encrypted before it ever touches disk. Upload, share, and track
            access — all from one place.
          </p>
        </div>
        <Button icon={UploadCloud} size="lg" onClick={onUploadClick} className="flex-shrink-0">
          Upload a document
        </Button>
      </div>
    </div>
  );
};

export default HeroSection;
