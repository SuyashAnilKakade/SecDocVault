import api from "./api";

// GET /api/audit/my-logs
const getMyAuditLogs = async () => {
  const { data } = await api.get("/audit/my-logs");
  return data.data; // array of AuditLog
};

const auditService = { getMyAuditLogs };

export default auditService;
