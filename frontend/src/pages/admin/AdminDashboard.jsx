import { useEffect, useState } from "react";
import { Users, ShieldAlert, FileStack, UserCog } from "lucide-react";
import toast from "react-hot-toast";
import PageHeader from "../../components/common/PageHeader";
import StatCard from "../../components/dashboard/StatCard";
import Card from "../../components/ui/Card";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";
import adminService from "../../services/adminService";
import { getErrorMessage } from "../../services/api";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService
      .getDashboardStats()
      .then(setStats)
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner label="Loading admin overview..." />
      </div>
    );
  }

  if (!stats) return <EmptyState message="Couldn't load dashboard stats" />;

  const { statistics, recentUsers, recentDocuments, recentAuditLogs } = stats;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin"
        title="Overview"
        subtitle="Vault-wide statistics across every user"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total users" value={statistics.totalUsers} icon={Users} tone="teal" />
        <StatCard label="Admins" value={statistics.totalAdmins} icon={UserCog} tone="neutral" />
        <StatCard label="Blocked users" value={statistics.blockedUsers} icon={ShieldAlert} tone="rose" />
        <StatCard label="Total documents" value={statistics.totalDocuments} icon={FileStack} tone="amber" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <h3 className="mb-4 font-display text-sm font-semibold text-ink-100">Recently joined</h3>
          {recentUsers.length === 0 ? (
            <EmptyState message="No users yet" />
          ) : (
            <ul className="divide-y divide-ink-700/60">
              {recentUsers.map((u) => (
                <li key={u._id} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="truncate text-sm text-ink-100">{u.fullName}</p>
                    <p className="truncate text-xs text-ink-400">{u.email}</p>
                  </div>
                  <span className="mono-meta flex-shrink-0 text-xs text-ink-500">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="p-5">
          <h3 className="mb-4 font-display text-sm font-semibold text-ink-100">Recent uploads</h3>
          {recentDocuments.length === 0 ? (
            <EmptyState message="No documents yet" />
          ) : (
            <ul className="divide-y divide-ink-700/60">
              {recentDocuments.map((d) => (
                <li key={d._id} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="truncate text-sm text-ink-100">{d.originalName}</p>
                    <p className="truncate text-xs text-ink-400">{d.uploadedBy?.fullName}</p>
                  </div>
                  <span className="mono-meta flex-shrink-0 text-xs text-ink-500">
                    {new Date(d.createdAt).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <Card className="p-5">
        <h3 className="mb-4 font-display text-sm font-semibold text-ink-100">Latest audit trail</h3>
        {recentAuditLogs.length === 0 ? (
          <EmptyState message="No activity recorded yet" />
        ) : (
          <ul className="divide-y divide-ink-700/60">
            {recentAuditLogs.map((log) => (
              <li key={log._id} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
                <div className="min-w-0">
                  <p className="truncate text-sm text-ink-200">{log.description}</p>
                  <p className="truncate text-xs text-ink-500">{log.user?.email || "System"}</p>
                </div>
                <span className="mono-meta flex-shrink-0 text-xs text-ink-500">
                  {new Date(log.createdAt).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
};

export default AdminDashboard;
