import { useState, useRef } from "react";
import { UploadCloud, File as FileIcon, X } from "lucide-react";
import toast from "react-hot-toast";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import documentService from "../../services/documentService";
import { getErrorMessage } from "../../services/api";

const ALLOWED = [".pdf", ".png", ".jpg", ".jpeg"];
const MAX_SIZE = 10 * 1024 * 1024;

const UploadModal = ({ isOpen, onClose, onUploaded }) => {
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);

  const validateAndSet = (candidate) => {
    if (!candidate) return;
    const ext = "." + candidate.name.split(".").pop().toLowerCase();
    if (!ALLOWED.includes(ext)) {
      toast.error("Only PDF, PNG, JPG and JPEG files are allowed.");
      return;
    }
    if (candidate.size > MAX_SIZE) {
      toast.error("File size should not exceed 10 MB.");
      return;
    }
    setFile(candidate);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setProgress(0);
    try {
      const doc = await documentService.uploadDocument(file, setProgress);
      toast.success("Document encrypted and uploaded");
      onUploaded?.(doc);
      handleClose();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setProgress(0);
    setUploading(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Upload document">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          validateAndSet(e.dataTransfer.files[0]);
        }}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
          dragging ? "border-signal-teal bg-signal-teal/5" : "border-ink-600 hover:border-ink-500"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ALLOWED.join(",")}
          className="hidden"
          onChange={(e) => validateAndSet(e.target.files[0])}
        />
        {file ? (
          <div className="flex w-full items-center gap-3 rounded-lg bg-ink-900/60 p-3 text-left">
            <FileIcon size={18} className="flex-shrink-0 text-signal-teal" />
            <span className="mono-meta flex-1 truncate text-xs text-ink-200">{file.name}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setFile(null);
              }}
              className="flex-shrink-0 text-ink-400 hover:text-signal-rose"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <>
            <UploadCloud size={26} className="text-ink-400" />
            <p className="text-sm text-ink-300">Drag & drop or click to browse</p>
            <p className="mono-meta text-xs text-ink-500">PDF, PNG, JPG · up to 10 MB</p>
          </>
        )}
      </div>

      {uploading && (
        <div className="mt-4">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink-700">
            <div
              className="h-full rounded-full bg-signal-teal transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mono-meta mt-1.5 text-xs text-ink-400">Encrypting & uploading… {progress}%</p>
        </div>
      )}

      <div className="mt-6 flex justify-end gap-3">
        <Button variant="ghost" onClick={handleClose} disabled={uploading}>
          Cancel
        </Button>
        <Button onClick={handleUpload} disabled={!file} loading={uploading}>
          Upload
        </Button>
      </div>
    </Modal>
  );
};

export default UploadModal;
