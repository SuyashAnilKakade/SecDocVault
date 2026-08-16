import { useEffect, useState, useCallback } from "react";
import { FileText, Clock, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import HeroSection from "../../components/dashboard/HeroSection";
import WelcomeBanner from "../../components/dashboard/WelcomeBanner";
import StatCard from "../../components/dashboard/StatCard";
import StorageCard from "../../components/dashboard/StorageCard";
import QuickActions from "../../components/dashboard/QuickActions";
import RecentActivity from "../../components/dashboard/RecentActivity";
import RecentFiles from "../../components/dashboard/RecentFiles";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import UploadModal from "../../components/documents/UploadModal";
import ShareModal from "../../components/documents/ShareModal";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import useAuth from "../../hooks/useAuth";
import documentService from "../../services/documentService";
import auditService from "../../services/auditService";
import { getErrorMessage } from "../../services/api";

const Dashboard = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [shareTarget, setShareTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [docs, auditLogs] = await Promise.all([
        documentService.getMyDocuments(),
        auditService.getMyAuditLogs(),
      ]);
      setDocuments(docs);
      setLogs(auditLogs);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const totalSize = documents.reduce((sum, d) => sum + (d.fileSize || 0), 0);
  const recentUploadCount = documents.filter(
    (d) => Date.now() - new Date(d.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000
  ).length;

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

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner label="Loading your vault..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <HeroSection fullName={user?.fullName} onUploadClick={() => setUploadOpen(true)} />
      <WelcomeBanner />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total documents" value={documents.length} icon={FileText} tone="teal" />
        <StatCard
          label="Uploaded this week"
          value={recentUploadCount}
          icon={Clock}
          tone="amber"
        />
        <StatCard label="Encryption" value="AES-256" icon={ShieldCheck} tone="neutral" />
      </div>

      <QuickActions onUploadClick={() => setUploadOpen(true)} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <RecentFiles
            documents={documents}
            onDownload={handleDownload}
            onShare={setShareTarget}
            onDelete={setDeleteTarget}
          />
        </div>
        <div className="space-y-6">
          <StorageCard usedBytes={totalSize} fileCount={documents.length} />
          <RecentActivity logs={logs} />
        </div>
      </div>

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

export default Dashboard;
