import { useEffect, useState, useMemo, useCallback } from "react";
import { UploadCloud, Download, Share2, Trash2, FileIcon } from "lucide-react";
import toast from "react-hot-toast";
import PageHeader from "../../components/common/PageHeader";
import SearchBar from "../../components/common/SearchBar";
import Button from "../../components/ui/Button";
import Table from "../../components/ui/Table";
import UploadModal from "../../components/documents/UploadModal";
import ShareModal from "../../components/documents/ShareModal";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import documentService from "../../services/documentService";
import { getErrorMessage } from "../../services/api";

const formatBytes = (bytes) => {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
};

const MyDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [shareTarget, setShareTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadDocuments = useCallback(async () => {
    try {
      const docs = await documentService.getMyDocuments();
      setDocuments(docs);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  const filtered = useMemo(
    () =>
      documents.filter((d) =>
        d.originalName.toLowerCase().includes(search.toLowerCase())
      ),
    [documents, search]
  );

  const handleDownload = async (doc) => {
    try {
      await documentService.downloadDocument(doc._id, doc.originalName);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleDeleteConfirmed = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await documentService.deleteDocument(deleteTarget._id);
      setDocuments((prev) => prev.filter((d) => d._id !== deleteTarget._id));
      toast.success("Document deleted");
      setDeleteTarget(null);
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
          <span className="max-w-[220px] truncate font-medium text-ink-100">{doc.originalName}</span>
        </div>
      ),
    },
    {
      key: "fileType",
      header: "Type",
      render: (doc) => <span className="mono-meta uppercase">{doc.fileType}</span>,
    },
    {
      key: "fileSize",
      header: "Size",
      render: (doc) => <span className="mono-meta">{formatBytes(doc.fileSize)}</span>,
    },
    {
      key: "createdAt",
      header: "Uploaded",
      render: (doc) => (
        <span className="mono-meta text-xs">{new Date(doc.createdAt).toLocaleDateString()}</span>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (doc) => (
        <div className="flex justify-end gap-1">
          <button
            onClick={() => handleDownload(doc)}
            title="Download"
            className="focus-ring rounded-lg p-1.5 text-ink-400 hover:bg-ink-700 hover:text-signal-teal"
          >
            <Download size={15} />
          </button>
          <button
            onClick={() => setShareTarget(doc)}
            title="Share"
            className="focus-ring rounded-lg p-1.5 text-ink-400 hover:bg-ink-700 hover:text-signal-amber"
          >
            <Share2 size={15} />
          </button>
          <button
            onClick={() => setDeleteTarget(doc)}
            title="Delete"
            className="focus-ring rounded-lg p-1.5 text-ink-400 hover:bg-ink-700 hover:text-signal-rose"
          >
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        eyebrow="Vault"
        title="My Documents"
        subtitle={`${documents.length} encrypted file${documents.length === 1 ? "" : "s"}`}
        action={
          <Button icon={UploadCloud} onClick={() => setUploadOpen(true)}>
            Upload
          </Button>
        }
      />

      <div className="mb-4 max-w-sm">
        <SearchBar value={search} onChange={setSearch} placeholder="Search documents..." />
      </div>

      <Table
        columns={columns}
        data={filtered}
        loading={loading}
        emptyMessage={search ? "No documents match your search" : "No documents uploaded yet"}
      />

      <UploadModal
        isOpen={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUploaded={(doc) => setDocuments((prev) => [doc, ...prev])}
      />
      <ShareModal isOpen={Boolean(shareTarget)} onClose={() => setShareTarget(null)} document={shareTarget} />
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirmed}
        loading={deleting}
        message={`This will permanently delete "${deleteTarget?.originalName}". This can't be undone.`}
      />
    </div>
  );
};

export default MyDocuments;
