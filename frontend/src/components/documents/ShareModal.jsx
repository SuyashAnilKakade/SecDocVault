import { useState } from "react";
import { Link2, Copy, Check, Lock } from "lucide-react";
import toast from "react-hot-toast";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Input from "../ui/Input";
import shareService from "../../services/shareService";
import { getErrorMessage } from "../../services/api";

const ShareModal = ({ isOpen, onClose, document }) => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const data = await shareService.generateShareLink(document._id, password);
      setResult(data);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result.shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setPassword("");
    setResult(null);
    setCopied(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Share document">
      <p className="mb-4 text-sm text-ink-400">
        Anyone with this link can download{" "}
        <span className="text-ink-200">"{document?.originalName}"</span>. Links expire after 24
        hours or 5 downloads, whichever comes first.
      </p>

      {!result ? (
        <>
          <Input
            label="Password (optional)"
            type="password"
            icon={Lock}
            placeholder="Leave blank for no password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="mt-6 flex justify-end gap-3">
            <Button variant="ghost" onClick={handleClose}>
              Cancel
            </Button>
            <Button icon={Link2} onClick={handleGenerate} loading={loading}>
              Generate link
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center gap-2 rounded-lg border border-ink-600 bg-ink-900/60 p-3">
            <span className="mono-meta flex-1 truncate text-xs text-ink-300">{result.shareUrl}</span>
            <button
              onClick={handleCopy}
              className="focus-ring flex-shrink-0 rounded-md p-1.5 text-ink-400 hover:bg-ink-700 hover:text-signal-teal"
            >
              {copied ? <Check size={14} className="text-signal-teal" /> : <Copy size={14} />}
            </button>
          </div>
          <p className="mono-meta mt-2 text-xs text-ink-500">
            Expires {new Date(result.expiresAt).toLocaleString()}
          </p>
          <div className="mt-6 flex justify-end">
            <Button onClick={handleClose}>Done</Button>
          </div>
        </>
      )}
    </Modal>
  );
};

export default ShareModal;
