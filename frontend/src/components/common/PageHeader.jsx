const PageHeader = ({ title, subtitle, action, eyebrow }) => {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        {eyebrow && (
          <p className="mono-meta mb-1 text-xs uppercase tracking-widest text-signal-teal">
            {eyebrow}
          </p>
        )}
        <h1 className="font-display text-2xl font-semibold text-ink-100 sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-ink-400">{subtitle}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
};

export default PageHeader;
