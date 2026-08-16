import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import PageHeader from "../../components/common/PageHeader";
import SearchBar from "../../components/common/SearchBar";
import Table from "../../components/ui/Table";
import Badge from "../../components/ui/Badge";
import Pagination from "../../components/common/Pagination";
import adminService from "../../services/adminService";
import { getErrorMessage } from "../../services/api";

const ACTIONS = ["", "UPLOAD", "DOWNLOAD", "DELETE", "LOGIN", "LOGOUT", "DELETE_USER", "DELETE_DOCUMENT"];

const actionTone = {
  UPLOAD: "teal",
  DOWNLOAD: "amber",
  DELETE: "rose",
  DELETE_USER: "rose",
  DELETE_DOCUMENT: "rose",
  LOGIN: "neutral",
  LOGOUT: "neutral",
};

const AuditLogs = () => {
  const [data, setData] = useState({ logs: [], currentPage: 1, totalPages: 1, totalLogs: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [action, setAction] = useState("");
  const [page, setPage] = useState(1);

  const loadLogs = useCallback(async () => {
    setLoading(true);
    try {
      const result = await adminService.getAuditLogs({
        page,
        limit: 10,
        search: search || undefined,
        action: action || undefined,
      });
      setData(result);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [page, search, action]);

  useEffect(() => {
    const timeout = setTimeout(loadLogs, 300);
    return () => clearTimeout(timeout);
  }, [loadLogs]);

  const columns = [
    {
      key: "action",
      header: "Action",
      render: (log) => <Badge tone={actionTone[log.action] || "neutral"}>{log.action}</Badge>,
    },
    {
      key: "user",
      header: "User",
      render: (log) => <span className="text-ink-300">{log.user?.email || "System"}</span>,
    },
    { key: "description", header: "Details" },
    {
      key: "createdAt",
      header: "When",
      render: (log) => <span className="mono-meta text-xs">{new Date(log.createdAt).toLocaleString()}</span>,
    },
  ];

  return (
    <div>
      <PageHeader
        eyebrow="Admin"
        title="Audit Logs"
        subtitle={`${data.totalLogs} recorded events across the vault`}
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <SearchBar
          value={search}
          onChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
          placeholder="Search descriptions..."
          className="max-w-sm"
        />
        <select
          value={action}
          onChange={(e) => {
            setAction(e.target.value);
            setPage(1);
          }}
          className="focus-ring rounded-lg border border-ink-600 bg-ink-900/70 px-3 py-2.5 text-sm text-ink-200"
        >
          {ACTIONS.map((a) => (
            <option key={a} value={a}>
              {a || "All actions"}
            </option>
          ))}
        </select>
      </div>

      <Table columns={columns} data={data.logs} loading={loading} emptyMessage="No matching audit logs" />
      <Pagination currentPage={data.currentPage} totalPages={data.totalPages} onPageChange={setPage} />
    </div>
  );
};

export default AuditLogs;
