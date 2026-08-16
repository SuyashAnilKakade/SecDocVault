import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import PageHeader from "../../components/common/PageHeader";
import Table from "../../components/ui/Table";
import Badge from "../../components/ui/Badge";
import auditService from "../../services/auditService";
import { getErrorMessage } from "../../services/api";

const actionTone = {
  UPLOAD: "teal",
  DOWNLOAD: "amber",
  DELETE: "rose",
  LOGIN: "neutral",
  LOGOUT: "neutral",
  RESET_PASSWORD: "amber",
  FORGOT_PASSWORD: "amber",
};

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    auditService
      .getMyAuditLogs()
      .then(setLogs)
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    {
      key: "action",
      header: "Action",
      render: (log) => <Badge tone={actionTone[log.action] || "neutral"}>{log.action}</Badge>,
    },
    { key: "description", header: "Details" },
    {
      key: "ipAddress",
      header: "IP address",
      render: (log) => <span className="mono-meta text-xs">{log.ipAddress || "—"}</span>,
    },
    {
      key: "createdAt",
      header: "When",
      render: (log) => (
        <span className="mono-meta text-xs">{new Date(log.createdAt).toLocaleString()}</span>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        eyebrow="Vault"
        title="Activity Log"
        subtitle="A full record of actions taken on your account"
      />
      <Table columns={columns} data={logs} loading={loading} emptyMessage="No activity recorded yet" />
    </div>
  );
};

export default AuditLogs;
