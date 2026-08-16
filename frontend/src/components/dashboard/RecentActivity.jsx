import { Upload, Download, Trash2, LogIn, LogOut, KeyRound, Activity } from "lucide-react";
import Card from "../ui/Card";
import EmptyState from "../common/EmptyState";

const actionIcons = {
  UPLOAD: { icon: Upload, tone: "text-signal-teal" },
  DOWNLOAD: { icon: Download, tone: "text-signal-amber" },
  DELETE: { icon: Trash2, tone: "text-signal-rose" },
  LOGIN: { icon: LogIn, tone: "text-ink-300" },
  LOGOUT: { icon: LogOut, tone: "text-ink-300" },
  RESET_PASSWORD: { icon: KeyRound, tone: "text-signal-amber" },
  FORGOT_PASSWORD: { icon: KeyRound, tone: "text-signal-amber" },
};

const timeAgo = (dateStr) => {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const RecentActivity = ({ logs = [] }) => {
  return (
    <Card className="p-5">
      <h3 className="mb-4 font-display text-sm font-semibold text-ink-100">Recent activity</h3>
      {logs.length === 0 ? (
        <EmptyState icon={Activity} message="No activity yet" description="Actions you take will show up here." />
      ) : (
        <ul className="space-y-4">
          {logs.slice(0, 6).map((log) => {
            const config = actionIcons[log.action] || { icon: Activity, tone: "text-ink-300" };
            const Icon = config.icon;
            return (
              <li key={log._id} className="flex items-start gap-3">
                <div className={`mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-ink-700 ${config.tone}`}>
                  <Icon size={13} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-ink-200">{log.description}</p>
                  <p className="mono-meta text-xs text-ink-500">{timeAgo(log.createdAt)}</p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
};

export default RecentActivity;
