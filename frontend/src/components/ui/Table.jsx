import LoadingSpinner from "../common/LoadingSpinner";
import EmptyState from "../common/EmptyState";

// columns: [{ key, header, render?: (row) => node, className? }]
const Table = ({ columns, data, loading, emptyMessage = "No records found" }) => {
  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <LoadingSpinner />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-ink-700">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-ink-700 bg-ink-800/80">
            {columns.map((col) => (
              <th
                key={col.key}
                className="whitespace-nowrap px-4 py-3 text-xs font-medium uppercase tracking-wide text-ink-400"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={row._id || row.id || i}
              className="border-b border-ink-700/60 last:border-0 hover:bg-ink-800/50 transition-colors"
            >
              {columns.map((col) => (
                <td key={col.key} className={`px-4 py-3 text-ink-200 ${col.className || ""}`}>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
