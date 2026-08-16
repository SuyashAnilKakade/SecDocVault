import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const Input = forwardRef(
  ({ label, error, icon: Icon, type = "text", className = "", id, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword && showPassword ? "text" : type;
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="mb-1.5 block text-xs font-medium text-ink-300">
            {label}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <Icon
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400"
            />
          )}
          <input
            ref={ref}
            id={inputId}
            type={inputType}
            className={`focus-ring w-full rounded-lg border bg-ink-900/70 py-2.5 text-sm text-ink-100
              placeholder:text-ink-400 transition-colors duration-200
              ${Icon ? "pl-10" : "pl-3.5"} ${isPassword ? "pr-10" : "pr-3.5"}
              ${error ? "border-signal-rose/60" : "border-ink-600 focus-visible:border-signal-teal"}
              ${className}`}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-200"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          )}
        </div>
        {error && <p className="mt-1.5 text-xs text-signal-rose">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
