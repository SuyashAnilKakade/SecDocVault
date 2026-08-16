import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-4 flex items-center justify-between">
      <p className="mono-meta text-xs text-ink-400">
        Page {currentPage} of {totalPages}
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="focus-ring flex items-center gap-1 rounded-lg border border-ink-600 px-3 py-1.5 text-xs text-ink-300 hover:border-signal-teal hover:text-signal-teal disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-ink-600 disabled:hover:text-ink-300"
        >
          <ChevronLeft size={14} />
          Prev
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="focus-ring flex items-center gap-1 rounded-lg border border-ink-600 px-3 py-1.5 text-xs text-ink-300 hover:border-signal-teal hover:text-signal-teal disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-ink-600 disabled:hover:text-ink-300"
        >
          Next
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
