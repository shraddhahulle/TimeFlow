
import { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { useTheme } from "@/context/ThemeContext";
import Sidebar from "./Sidebar";
import Header from "./Header";

const Layout = () => {
  const { isLoggedIn } = useUser();
  const { theme } = useTheme();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className={`flex h-screen overflow-hidden ${theme === 'dark' ? 'bg-timeflow-dark dark:bg-timeflow-dark' : 'bg-white dark:bg-timeflow-dark'}`}>
      <Sidebar 
        collapsed={sidebarCollapsed} 
        toggleSidebar={toggleSidebar}
        currentPath={location.pathname}
      />
      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        <Header onToggleSidebar={toggleSidebar} />
        <main className="relative flex-1 overflow-y-auto focus:outline-none bg-background">
          <div className="py-6">
            <div className="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
