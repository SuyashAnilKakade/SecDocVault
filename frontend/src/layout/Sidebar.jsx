import { NavLink } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

const Sidebar = ({ navItems, footer }) => {
  return (
    <aside className="hidden w-64 flex-shrink-0 flex-col border-r border-ink-700 bg-ink-900/95 lg:flex">
      <div className="flex items-center gap-2.5 px-6 py-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-signal-teal/10 text-signal-teal">
          <ShieldCheck size={20} />
        </div>
        <div>
          <p className="font-display text-sm font-semibold leading-tight text-ink-100">
            SecureDoc
          </p>
          <p className="mono-meta text-[10px] leading-tight text-ink-400">VAULT</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `focus-ring flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-signal-teal/10 text-signal-teal"
                  : "text-ink-300 hover:bg-ink-800 hover:text-ink-100"
              }`
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      {footer && <div className="border-t border-ink-700 p-4">{footer}</div>}
    </aside>
  );
};

export default Sidebar;
