import { Inbox } from "lucide-react";

const EmptyState = ({
  icon: Icon = Inbox,
  message = "Nothing here yet",
  description,
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-ink-600 py-16 text-center">
      <div className="rounded-full bg-ink-800 p-3 text-ink-400">
        <Icon size={22} />
      </div>
      <p className="font-display text-sm font-medium text-ink-200">{message}</p>
      {description && <p className="max-w-xs text-xs text-ink-400">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
};

export default EmptyState;
