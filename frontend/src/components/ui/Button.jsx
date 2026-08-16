import { Loader2 } from "lucide-react";

const variants = {
  primary:
    "bg-signal-teal text-ink-950 hover:bg-signal-teal/90 shadow-[0_0_0_1px_rgba(45,212,191,0.3)] hover:shadow-[0_0_20px_rgba(45,212,191,0.25)]",
  secondary:
    "bg-ink-700 text-ink-100 hover:bg-ink-600 border border-ink-500",
  ghost: "bg-transparent text-ink-200 hover:bg-ink-800 hover:text-ink-100",
  danger: "bg-signal-rose/10 text-signal-rose border border-signal-rose/30 hover:bg-signal-rose/20",
  outline: "bg-transparent border border-ink-500 text-ink-100 hover:border-signal-teal hover:text-signal-teal",
};

const sizes = {
  sm: "text-xs px-3 py-1.5 gap-1.5",
  md: "text-sm px-4 py-2.5 gap-2",
  lg: "text-sm px-6 py-3 gap-2",
};

const Button = ({
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  iconPosition = "left",
  loading = false,
  disabled = false,
  className = "",
  type = "button",
  ...props
}) => {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`focus-ring inline-flex items-center justify-center rounded-lg font-medium
        transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
        active:scale-[0.98] ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 className="animate-spin" size={16} />
      ) : (
        Icon && iconPosition === "left" && <Icon size={16} />
      )}
      {children}
      {!loading && Icon && iconPosition === "right" && <Icon size={16} />}
    </button>
  );
};

export default Button;
