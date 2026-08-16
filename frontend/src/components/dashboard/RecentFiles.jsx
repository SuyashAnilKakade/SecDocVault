import { FileText, Download, Share2, Trash2, FileIcon } from "lucide-react";
import Card from "../ui/Card";
import EmptyState from "../common/EmptyState";

const formatBytes = (bytes) => {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
};

const typeColor = {
  pdf: "text-signal-rose bg-signal-rose/10",
  png: "text-signal-teal bg-signal-teal/10",
  jpg: "text-signal-amber bg-signal-amber/10",
  jpeg: "text-signal-amber bg-signal-amber/10",
};

const RecentFiles = ({ documents = [], onDownload, onShare, onDelete }) => {
  return (
    <Card className="p-5">
      <h3 className="mb-4 font-display text-sm font-semibold text-ink-100">Recent files</h3>
      {documents.length === 0 ? (
        <EmptyState icon={FileText} message="No documents yet" description="Upload your first file to see it here." />
      ) : (
        <ul className="divide-y divide-ink-700/60">
          {documents.slice(0, 5).map((doc) => (
            <li key={doc._id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
              <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${typeColor[doc.fileType] || "text-ink-300 bg-ink-700"}`}>
                <FileIcon size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink-100">{doc.originalName}</p>
                <p className="mono-meta text-xs text-ink-500">{formatBytes(doc.fileSize)}</p>
              </div>
              <div className="flex flex-shrink-0 items-center gap-1">
                <button
                  onClick={() => onDownload?.(doc)}
                  title="Download"
                  className="focus-ring rounded-lg p-1.5 text-ink-400 hover:bg-ink-700 hover:text-signal-teal"
                >
                  <Download size={15} />
                </button>
                <button
                  onClick={() => onShare?.(doc)}
                  title="Share"
                  className="focus-ring rounded-lg p-1.5 text-ink-400 hover:bg-ink-700 hover:text-signal-amber"
                >
                  <Share2 size={15} />
                </button>
                <button
                  onClick={() => onDelete?.(doc)}
                  title="Delete"
                  className="focus-ring rounded-lg p-1.5 text-ink-400 hover:bg-ink-700 hover:text-signal-rose"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
};

export default RecentFiles;
