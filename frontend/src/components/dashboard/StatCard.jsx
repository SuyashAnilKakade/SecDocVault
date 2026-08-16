import Card from "../ui/Card";

const toneMap = {
  teal: "bg-signal-teal/10 text-signal-teal",
  amber: "bg-signal-amber/10 text-signal-amber",
  rose: "bg-signal-rose/10 text-signal-rose",
  neutral: "bg-ink-700 text-ink-300",
};

const StatCard = ({ label, value, icon: Icon, tone = "teal", trend }) => {
  return (
    <Card hover className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-ink-400">{label}</p>
          <p className="mono-meta mt-2 text-2xl font-semibold text-ink-100">{value}</p>
          {trend && <p className="mt-1 text-xs text-ink-400">{trend}</p>}
        </div>
        {Icon && (
          <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${toneMap[tone]}`}>
            <Icon size={18} />
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatCard;
