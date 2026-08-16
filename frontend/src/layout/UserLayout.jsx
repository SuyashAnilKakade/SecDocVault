import { LayoutDashboard, FileText, ScrollText } from "lucide-react";
import DashboardLayout from "./DashboardLayout";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/documents", label: "My Documents", icon: FileText },
  { to: "/audit-logs", label: "Activity Log", icon: ScrollText },
];

const UserLayout = () => <DashboardLayout navItems={navItems} />;

export default UserLayout;
