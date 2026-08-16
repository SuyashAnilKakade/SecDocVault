import api from "./api";

// POST /api/documents/upload  multipart field name: "document"
const uploadDocument = async (file, onProgress) => {
  const formData = new FormData();
  formData.append("document", file);

  const { data } = await api.post("/documents/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (evt) => {
      if (onProgress && evt.total) {
        onProgress(Math.round((evt.loaded * 100) / evt.total));
      }
    },
  });
  return data.data; // Document object
};

// GET /api/documents/my-documents
const getMyDocuments = async () => {
  const { data } = await api.get("/documents/my-documents");
  return data.data; // array of Document
};

// GET /api/documents/download/:id -> file blob (decrypted server-side)
const downloadDocument = async (id, originalName) => {
  const response = await api.get(`/documents/download/${id}`, {
    responseType: "blob",
  });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", originalName || "document");
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

// DELETE /api/documents/:id
const deleteDocument = async (id) => {
  const { data } = await api.delete(`/documents/${id}`);
  return data.message;
};

const documentService = {
  uploadDocument,
  getMyDocuments,
  downloadDocument,
  deleteDocument,
};

export default documentService;
