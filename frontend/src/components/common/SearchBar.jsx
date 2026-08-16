import { Search } from "lucide-react";

const SearchBar = ({ value, onChange, placeholder = "Search...", className = "" }) => {
  return (
    <div className={`relative ${className}`}>
      <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="focus-ring w-full rounded-lg border border-ink-600 bg-ink-900/70 py-2.5 pl-10 pr-3.5
          text-sm text-ink-100 placeholder:text-ink-400 transition-colors focus-visible:border-signal-teal"
      />
    </div>
  );
};

export default SearchBar;
