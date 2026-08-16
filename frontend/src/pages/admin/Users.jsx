import { useEffect, useState, useCallback } from "react";
import { ShieldOff, ShieldCheck, Trash2, UserCog } from "lucide-react";
import toast from "react-hot-toast";
import PageHeader from "../../components/common/PageHeader";
import SearchBar from "../../components/common/SearchBar";
import Table from "../../components/ui/Table";
import Badge from "../../components/ui/Badge";
import Pagination from "../../components/common/Pagination";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import adminService from "../../services/adminService";
import useAuth from "../../hooks/useAuth";
import { getErrorMessage } from "../../services/api";

const Users = () => {
  const { user: currentUser } = useAuth();
  const [data, setData] = useState({ users: [], currentPage: 1, totalPages: 1, totalUsers: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [blockTarget, setBlockTarget] = useState(null);
  const [roleTarget, setRoleTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const result = await adminService.getAllUsers({ page, limit: 8, search: search || undefined });
      setData(result);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    const timeout = setTimeout(loadUsers, 300);
    return () => clearTimeout(timeout);
  }, [loadUsers]);

  const handleToggleBlock = async () => {
    if (!blockTarget) return;
    setActionLoading(true);
    try {
      await adminService.toggleBlockUser(blockTarget._id);
      toast.success(blockTarget.isBlocked ? "User unblocked" : "User blocked");
      setBlockTarget(null);
      loadUsers();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setActionLoading(false);
    }
  };

  const handleRoleChange = async () => {
    if (!roleTarget) return;
    const newRole = roleTarget.role === "admin" ? "user" : "admin";
    setActionLoading(true);
    try {
      await adminService.updateUserRole(roleTarget._id, newRole);
      toast.success(`${roleTarget.fullName} is now ${newRole}`);
      setRoleTarget(null);
      loadUsers();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setActionLoading(true);
    try {
      await adminService.deleteUser(deleteTarget._id);
      toast.success("User deleted");
      setDeleteTarget(null);
      loadUsers();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setActionLoading(false);
    }
  };

  const columns = [
    {
      key: "fullName",
      header: "Name",
      render: (u) => (
        <div>
          <p className="font-medium text-ink-100">{u.fullName}</p>
          <p className="text-xs text-ink-400">{u.email}</p>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      render: (u) => <Badge tone={u.role === "admin" ? "amber" : "neutral"}>{u.role}</Badge>,
    },
    {
      key: "isBlocked",
      header: "Status",
      render: (u) =>
        u.isBlocked ? (
          <Badge tone="rose" dot>
            Blocked
          </Badge>
        ) : (
          <Badge tone="teal" dot>
            Active
          </Badge>
        ),
    },
    {
      key: "createdAt",
      header: "Joined",
      render: (u) => <span className="mono-meta text-xs">{new Date(u.createdAt).toLocaleDateString()}</span>,
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (u) => {
        const isSelf = u._id === currentUser?._id || u._id === currentUser?.id;
        return (
          <div className="flex justify-end gap-1">
            <button
              onClick={() => !isSelf && setRoleTarget(u)}
              disabled={isSelf}
              title={isSelf ? "You can't change your own role" : u.role === "admin" ? "Revert to user" : "Make admin"}
              className="focus-ring rounded-lg p-1.5 text-ink-400 hover:bg-ink-700 hover:text-signal-teal disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ink-400"
            >
              <UserCog size={15} />
            </button>
            <button
              onClick={() => setBlockTarget(u)}
              title={u.isBlocked ? "Unblock" : "Block"}
              className="focus-ring rounded-lg p-1.5 text-ink-400 hover:bg-ink-700 hover:text-signal-amber"
            >
              {u.isBlocked ? <ShieldCheck size={15} /> : <ShieldOff size={15} />}
            </button>
            <button
              onClick={() => setDeleteTarget(u)}
              title="Delete"
              className="focus-ring rounded-lg p-1.5 text-ink-400 hover:bg-ink-700 hover:text-signal-rose"
            >
              <Trash2 size={15} />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <PageHeader eyebrow="Admin" title="Users" subtitle={`${data.totalUsers} registered users`} />

      <div className="mb-4 max-w-sm">
        <SearchBar
          value={search}
          onChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
          placeholder="Search by name or email..."
        />
      </div>

      <Table columns={columns} data={data.users} loading={loading} emptyMessage="No users found" />
      <Pagination currentPage={data.currentPage} totalPages={data.totalPages} onPageChange={setPage} />

      <ConfirmDialog
        isOpen={Boolean(blockTarget)}
        onClose={() => setBlockTarget(null)}
        onConfirm={handleToggleBlock}
        loading={actionLoading}
        title={blockTarget?.isBlocked ? "Unblock user?" : "Block user?"}
        confirmLabel={blockTarget?.isBlocked ? "Unblock" : "Block"}
        message={`${blockTarget?.isBlocked ? "Restore" : "Revoke"} access for ${blockTarget?.fullName}?`}
      />
      <ConfirmDialog
        isOpen={Boolean(roleTarget)}
        onClose={() => setRoleTarget(null)}
        onConfirm={handleRoleChange}
        loading={actionLoading}
        title={roleTarget?.role === "admin" ? "Revert to user?" : "Make admin?"}
        confirmLabel={roleTarget?.role === "admin" ? "Revert" : "Promote"}
        message={
          roleTarget?.role === "admin"
            ? `${roleTarget?.fullName} will lose access to the admin panel.`
            : `${roleTarget?.fullName} will gain full admin panel access, including managing other users.`
        }
      />
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={actionLoading}
        message={`This permanently deletes ${deleteTarget?.fullName} and all of their documents. This can't be undone.`}
      />
    </div>
  );
};

export default Users;
