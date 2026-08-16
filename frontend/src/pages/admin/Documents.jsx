import { useEffect, useState, useCallback } from "react";
import { Trash2, FileIcon } from "lucide-react";
import toast from "react-hot-toast";
import PageHeader from "../../components/common/PageHeader";
import SearchBar from "../../components/common/SearchBar";
import Table from "../../components/ui/Table";
import Pagination from "../../components/common/Pagination";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import adminService from "../../services/adminService";
import { getErrorMessage } from "../../services/api";

const formatBytes = (bytes) => {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
};

const Documents = () => {
  const [data, setData] = useState({ documents: [], currentPage: 1, totalPages: 1, totalDocuments: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadDocuments = useCallback(async () => {
    setLoading(true);
    try {
      const result = await adminService.getAllDocuments({ page, limit: 8, search: search || undefined });
      setData(result);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    const timeout = setTimeout(loadDocuments, 300);
    return () => clearTimeout(timeout);
  }, [loadDocuments]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminService.deleteDocument(deleteTarget._id);
      toast.success("Document deleted");
      setDeleteTarget(null);
      loadDocuments();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      key: "originalName",
      header: "Name",
      render: (doc) => (
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-ink-700 text-ink-300">
            <FileIcon size={14} />
          </div>
          <span className="max-w-[200px] truncate font-medium text-ink-100">{doc.originalName}</span>
        </div>
      ),
    },
    {
      key: "uploadedBy",
      header: "Owner",
      render: (doc) => (
        <div>
          <p className="text-ink-200">{doc.uploadedBy?.fullName}</p>
          <p className="text-xs text-ink-400">{doc.uploadedBy?.email}</p>
        </div>
      ),
    },
    {
      key: "fileSize",
      header: "Size",
      render: (doc) => <span className="mono-meta">{formatBytes(doc.fileSize)}</span>,
    },
    {
      key: "createdAt",
      header: "Uploaded",
      render: (doc) => <span className="mono-meta text-xs">{new Date(doc.createdAt).toLocaleDateString()}</span>,
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (doc) => (
        <button
          onClick={() => setDeleteTarget(doc)}
          title="Delete"
          className="focus-ring rounded-lg p-1.5 text-ink-400 hover:bg-ink-700 hover:text-signal-rose"
        >
          <Trash2 size={15} />
        </button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        eyebrow="Admin"
        title="Documents"
        subtitle={`${data.totalDocuments} documents across all users`}
      />

      <div className="mb-4 max-w-sm">
        <SearchBar
          value={search}
          onChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
          placeholder="Search by file name..."
        />
      </div>

      <Table columns={columns} data={data.documents} loading={loading} emptyMessage="No documents found" />
      <Pagination currentPage={data.currentPage} totalPages={data.totalPages} onPageChange={setPage} />

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        message={`This permanently deletes "${deleteTarget?.originalName}". This can't be undone.`}
      />
    </div>
  );
};

export default Documents;
