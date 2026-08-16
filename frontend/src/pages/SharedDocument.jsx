import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ShieldCheck, Lock, Download, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import shareService from "../services/shareService";
import { getErrorMessage } from "../services/api";

const SharedDocument = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [needsPassword, setNeedsPassword] = useState(false);

  const handleDownload = async (e) => {
    e?.preventDefault();
    setLoading(true);
    try {
      await shareService.downloadSharedDocument(token, password);
      toast.success("Download started");
    } catch (err) {
      const status = err?.response?.status;
      if (status === 401) {
        setNeedsPassword(true);
        if (password) toast.error("Incorrect password");
      } else {
        toast.error(getErrorMessage(err));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vault-grid flex min-h-screen items-center justify-center bg-ink-900 px-4">
      <div className="w-full max-w-sm animate-fade-up">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-signal-teal/10 text-signal-teal">
            <ShieldCheck size={24} />
          </div>
          <h1 className="font-display text-2xl font-semibold text-ink-100">Shared document</h1>
          <p className="mt-1 text-sm text-ink-400">
            This file was shared securely via SecureDoc Vault
          </p>
        </div>

        <form
          onSubmit={handleDownload}
          className="space-y-4 rounded-2xl border border-ink-700 bg-ink-800/60 p-6 backdrop-blur-sm"
        >
          {needsPassword && (
            <Input
              label="This file is password protected"
              type="password"
              icon={Lock}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
          )}
          <Button type="submit" icon={Download} loading={loading} className="w-full">
            {needsPassword ? "Unlock & download" : "Download file"}
          </Button>
          <p className="mono-meta text-center text-xs text-ink-500">
            Links expire after 24 hours or 5 downloads
          </p>
        </form>

        <Link to="/login" className="mt-6 flex items-center justify-center gap-1.5 text-sm text-ink-400 hover:text-signal-teal">
          <ArrowLeft size={14} />
          Go to SecureDoc Vault
        </Link>
      </div>
    </div>
  );
};

export default SharedDocument;
