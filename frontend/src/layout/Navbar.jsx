import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X, LogOut, ChevronDown, ShieldCheck } from "lucide-react";
import useAuth from "../hooks/useAuth";

const Navbar = ({ navItems, onLogout }) => {
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const initials = user?.fullName
    ? user.fullName.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  return (
    <header className="sticky top-0 z-40 border-b border-ink-700 bg-ink-900/85 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2 lg:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-signal-teal/10 text-signal-teal">
            <ShieldCheck size={16} />
          </div>
          <button
            className="focus-ring rounded-lg p-2 text-ink-300 hover:bg-ink-800"
            onClick={() => setMobileOpen((s) => !s)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <div className="hidden lg:block" />

        <div className="relative ml-auto">
          <button
            onClick={() => setMenuOpen((s) => !s)}
            className="focus-ring flex items-center gap-2.5 rounded-lg py-1.5 pl-1.5 pr-2.5 hover:bg-ink-800"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-signal-teal/15 text-xs font-semibold text-signal-teal">
              {initials}
            </div>
            <span className="hidden text-sm text-ink-200 sm:block">{user?.fullName}</span>
            <ChevronDown size={14} className="text-ink-400" />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 z-20 mt-2 w-52 animate-fade-up rounded-xl border border-ink-600 bg-ink-800 p-1.5 shadow-xl">
                <div className="px-3 py-2">
                  <p className="truncate text-sm font-medium text-ink-100">{user?.fullName}</p>
                  <p className="truncate text-xs text-ink-400">{user?.email}</p>
                </div>
                <div className="my-1 border-t border-ink-700" />
                <button
                  onClick={onLogout}
                  className="focus-ring flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-signal-rose hover:bg-signal-rose/10"
                >
                  <LogOut size={15} />
                  Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {mobileOpen && (
        <nav className="space-y-1 border-t border-ink-700 px-3 pb-3 pt-2 lg:hidden">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${
                  isActive ? "bg-signal-teal/10 text-signal-teal" : "text-ink-300 hover:bg-ink-800"
                }`
              }
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
};

export default Navbar;
