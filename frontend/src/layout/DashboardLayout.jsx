import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";
import useAuth from "../hooks/useAuth";

const DashboardLayout = ({ navItems, sidebarFooter }) => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    window.location.href = "/login";
  };

  return (
    <div className="vault-grid flex min-h-screen bg-ink-900">
      <Sidebar navItems={navItems} footer={sidebarFooter} />
      <div className="flex min-h-screen flex-1 flex-col">
        <Navbar navItems={navItems} onLogout={handleLogout} />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto max-w-7xl animate-fade-up">
            <Outlet />
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default DashboardLayout;
