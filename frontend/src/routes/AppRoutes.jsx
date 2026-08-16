import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoutes from "./ProtectedRoutes";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import SharedDocument from "../pages/SharedDocument";
import NotFound from "../pages/NotFound";

import UserLayout from "../layout/UserLayout";
import Dashboard from "../pages/user/Dashboard";
import MyDocuments from "../pages/user/MyDocuments";
import UserAuditLogs from "../pages/user/AuditLogs";

import AdminLayout from "../layout/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import Users from "../pages/admin/Users";
import AdminDocuments from "../pages/admin/Documents";
import AdminAuditLogs from "../pages/admin/AuditLogs";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/share/:token" element={<SharedDocument />} />

      {/* Authenticated — any role */}
      <Route element={<ProtectedRoutes />}>
        <Route element={<UserLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/documents" element={<MyDocuments />} />
          <Route path="/audit-logs" element={<UserAuditLogs />} />
        </Route>
      </Route>

      {/* Admin only */}
      <Route element={<ProtectedRoutes requiredRole="admin" />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/documents" element={<AdminDocuments />} />
          <Route path="/admin/audit-logs" element={<AdminAuditLogs />} />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
