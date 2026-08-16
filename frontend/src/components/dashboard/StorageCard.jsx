import { HardDrive } from "lucide-react";
import Card from "../ui/Card";

const formatBytes = (bytes) => {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
};

// quotaBytes is a soft display quota (backend has no storage cap today, so this is
// purely a visual usage indicator based on what the user has actually uploaded)
const StorageCard = ({ usedBytes = 0, fileCount = 0, quotaBytes = 1024 * 1024 * 1024 }) => {
  const percent = Math.min(100, Math.round((usedBytes / quotaBytes) * 100));

  return (
    <Card className="p-5">
      <div className="mb-4 flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-signal-teal/10 text-signal-teal">
          <HardDrive size={16} />
        </div>
        <div>
          <p className="text-sm font-medium text-ink-100">Storage used</p>
          <p className="mono-meta text-xs text-ink-400">{fileCount} encrypted files</p>
        </div>
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-ink-700">
        <div
          className="h-full rounded-full bg-gradient-to-r from-signal-teal to-signal-teal-dim transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="mono-meta mt-2 flex justify-between text-xs text-ink-400">
        <span>{formatBytes(usedBytes)} used</span>
        <span>{formatBytes(quotaBytes)}</span>
      </div>
    </Card>
  );
};

export default StorageCard;
