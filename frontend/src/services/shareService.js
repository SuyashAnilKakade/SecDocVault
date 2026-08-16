import api from "./api";

// POST /api/share/generate/:documentId  { password? } -> { shareUrl, expiresAt }
const generateShareLink = async (documentId, password) => {
  const { data } = await api.post(`/share/generate/${documentId}`, {
    password: password || undefined,
  });
  return data.data;
};

// POST /api/share/download/:token  { password? } -> file blob (public route, no auth)
const downloadSharedDocument = async (token, password, fallbackName = "shared-document") => {
  const response = await api.post(
    `/share/download/${token}`,
    { password: password || undefined },
    { responseType: "blob" }
  );

  // try to read filename from content-disposition
  const disposition = response.headers["content-disposition"];
  let filename = fallbackName;
  if (disposition) {
    const match = disposition.match(/filename="?([^"]+)"?/);
    if (match) filename = match[1];
  }

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

const shareService = {
  generateShareLink,
  downloadSharedDocument,
};

export default shareService;
