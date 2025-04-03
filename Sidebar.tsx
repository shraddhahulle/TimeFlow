
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Home,
  Calendar,
  Users,
  Briefcase,
  BarChart3,
  Settings,
  HelpCircle,
  ChevronLeft,
  Info,
  FileText,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type SidebarProps = {
  collapsed: boolean;
  toggleSidebar: () => void;
  currentPath: string;
};

const Sidebar = ({ collapsed, toggleSidebar, currentPath }: SidebarProps) => {
  const navigate = useNavigate();
  const [showHelp, setShowHelp] = useState(false);

  const isActivePath = (path: string) => {
    if (path === "/app" && currentPath === "/app") return true;
    if (path !== "/app" && currentPath.startsWith(path)) return true;
    return false;
  };

  const links = [
    { name: "Dashboard", href: "/app", icon: Home },
    { name: "Projects", href: "/app/projects", icon: Briefcase },
    { name: "Calendar", href: "/app/calendar", icon: Calendar },
    { name: "Team", href: "/app/team", icon: Users },
    { name: "Reports", href: "/app/reports", icon: BarChart3 },
    { name: "Settings", href: "/app/settings", icon: Settings },
  ];

  const helpLinks = [
    { name: "About Us", onClick: () => navigate("/about") },
    { name: "Contact", onClick: () => navigate("/contact") },
    { name: "Privacy Policy", onClick: () => navigate("/privacy") },
    { name: "Terms of Service", onClick: () => navigate("/terms") },
  ];

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-20 transition-opacity duration-200 lg:hidden",
          collapsed ? "hidden" : "block bg-black/50"
        )}
        onClick={toggleSidebar}
      ></div>

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-20 flex h-screen flex-shrink-0 flex-col bg-timeflow-gray transition-all duration-300 lg:static lg:flex",
          collapsed ? "w-16" : "w-64"
        )}
      >
        <div className="flex h-16 flex-shrink-0 items-center justify-between px-4 border-b border-timeflow-lightgray">
          <div className="flex items-center">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-md border border-timeflow-primary">
              <span className="text-timeflow-primary font-bold">T</span>
            </div>
            {!collapsed && (
              <div className="ml-2 text-xl font-bold text-timeflow-primary">
                TIMEFLOW
              </div>
            )}
          </div>
          <button
            className="flex h-8 w-8 items-center justify-center rounded-md text-gray-300 hover:bg-timeflow-lightgray hover:text-gray-100 focus:outline-none focus:ring-1 focus:ring-inset focus:ring-timeflow-primary"
            onClick={toggleSidebar}
          >
            {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </button>
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto scrollbar-hide px-2 py-4">
          <nav className="flex-1 space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = isActivePath(link.href);

              return (
                <TooltipProvider key={link.name} delayDuration={collapsed ? 0 : 500}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        to={link.href}
                        className={cn(
                          "group flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-timeflow-lightgray",
                          isActive
                            ? "bg-timeflow-primary/10 text-timeflow-primary"
                            : "text-gray-300 hover:text-white"
                        )}
                      >
                        <Icon
                          className={cn(
                            "mr-3 h-5 w-5 flex-shrink-0",
                            isActive ? "text-timeflow-primary" : "text-gray-400 group-hover:text-gray-300"
                          )}
                        />
                        {!collapsed && <span className="truncate">{link.name}</span>}
                      </Link>
                    </TooltipTrigger>
                    {collapsed && <TooltipContent side="right">{link.name}</TooltipContent>}
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </nav>
        </div>

        <div className="px-2 pb-4">
          <TooltipProvider delayDuration={collapsed ? 0 : 500}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="group flex w-full items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-timeflow-lightgray hover:text-white"
                  onClick={() => setShowHelp(!showHelp)}
                >
                  <HelpCircle className="mr-3 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-300" />
                  {!collapsed && <span className="truncate">Help & Resources</span>}
                  {!collapsed && (
                    <ChevronRight
                      className={cn(
                        "ml-auto h-4 w-4 transition-transform",
                        showHelp && "rotate-90"
                      )}
                    />
                  )}
                </button>
              </TooltipTrigger>
              {collapsed && <TooltipContent side="right">Help & Resources</TooltipContent>}
            </Tooltip>
          </TooltipProvider>

          {showHelp && !collapsed && (
            <div className="mt-1 space-y-1 pl-6">
              {helpLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={link.onClick}
                  className="group flex w-full items-center px-2 py-1.5 text-sm font-medium rounded-md text-gray-300 hover:bg-timeflow-lightgray hover:text-white"
                >
                  {link.name === "About Us" && <Info className="mr-2 h-4 w-4 text-gray-400" />}
                  {link.name === "Contact" && <Users className="mr-2 h-4 w-4 text-gray-400" />}
                  {link.name === "Privacy Policy" && <FileText className="mr-2 h-4 w-4 text-gray-400" />}
                  {link.name === "Terms of Service" && <FileText className="mr-2 h-4 w-4 text-gray-400" />}
                  <span className="truncate">{link.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
