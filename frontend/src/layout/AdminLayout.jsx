import { LayoutDashboard, Users, FileStack, ScrollText } from "lucide-react";
import DashboardLayout from "./DashboardLayout";
import Badge from "../components/ui/Badge";

const navItems = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/documents", label: "Documents", icon: FileStack },
  { to: "/admin/audit-logs", label: "Audit Logs", icon: ScrollText },
];

const AdminLayout = () => (
  <DashboardLayout
    navItems={navItems}
    sidebarFooter={
      <Badge tone="amber" dot className="w-full justify-center">
        Admin Mode
      </Badge>
    }
  />
);

export default AdminLayout;
