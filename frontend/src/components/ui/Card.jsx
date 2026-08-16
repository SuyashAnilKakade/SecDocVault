const Card = ({ children, className = "", hover = false, ...props }) => {
  return (
    <div
      className={`rounded-2xl border border-ink-700 bg-ink-800/60 backdrop-blur-sm
        ${hover ? "transition-all duration-300 hover:border-signal-teal/40 hover:bg-ink-800" : ""}
        ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
