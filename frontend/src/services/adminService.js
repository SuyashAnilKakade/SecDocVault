import api from "./api";

// GET /api/admin/dashboard
const getDashboardStats = async () => {
  const { data } = await api.get("/admin/dashboard");
  return data.data; // { statistics, recentUsers, recentDocuments, recentAuditLogs }
};

// GET /api/admin/users?page&limit&search&role&blocked
const getAllUsers = async (params = {}) => {
  const { data } = await api.get("/admin/users", { params });
  return data.data; // { totalUsers, currentPage, totalPages, users }
};

// PATCH /api/admin/block-user/:id
const toggleBlockUser = async (id) => {
  const { data } = await api.patch(`/admin/block-user/${id}`);
  return data.data;
};

// PATCH /api/admin/user/:id/role  { role: "user" | "admin" | "auditor" }
const updateUserRole = async (id, role) => {
  const { data } = await api.patch(`/admin/user/${id}/role`, { role });
  return data.data;
};

// DELETE /api/admin/user/:id
const deleteUser = async (id) => {
  const { data } = await api.delete(`/admin/user/${id}`);
  return data.message;
};

// GET /api/admin/documents?page&limit&search
const getAllDocuments = async (params = {}) => {
  const { data } = await api.get("/admin/documents", { params });
  return data.data; // { totalDocuments, currentPage, totalPages, documents }
};

// DELETE /api/admin/document/:id
const deleteDocument = async (id) => {
  const { data } = await api.delete(`/admin/document/${id}`);
  return data.message;
};

// GET /api/admin/audit-logs?page&limit&action&search
const getAuditLogs = async (params = {}) => {
  const { data } = await api.get("/admin/audit-logs", { params });
  return data.data; // { totalLogs, currentPage, totalPages, logs }
};

const adminService = {
  getDashboardStats,
  getAllUsers,
  toggleBlockUser,
  updateUserRole,
  deleteUser,
  getAllDocuments,
  deleteDocument,
  getAuditLogs,
};

export default adminService;
