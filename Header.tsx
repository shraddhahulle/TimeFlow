
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Moon, Settings, LogOut, Sun, HelpCircle } from "lucide-react";
import { getInitials } from "@/lib/utils";
import { useTheme } from "@/context/ThemeContext";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

interface HeaderProps {
  onToggleSidebar?: () => void;
}

const Header = ({ onToggleSidebar }: HeaderProps) => {
  const { user, logout } = useUser();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  
  const notifications = [
    {
      id: 1,
      title: "New task assigned",
      message: "You have been assigned to the task 'Update homepage design'",
      time: "10 minutes ago",
      read: false
    },
    {
      id: 2,
      title: "Meeting reminder",
      message: "Team meeting in 30 minutes",
      time: "30 minutes ago",
      read: false
    },
    {
      id: 3,
      title: "Project deadline approaching",
      message: "The Marketing Campaign project is due in 2 days",
      time: "2 hours ago",
      read: true
    }
  ];
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const goToLandingPage = () => {
    navigate("/");
  };
  
  const handleNotificationClick = (id: number) => {
    // Mark notification as read
    toast({
      title: "Notification marked as read",
      description: "The notification has been marked as read.",
    });
    setShowNotifications(false);
    
    // Navigate based on notification type
    const notification = notifications.find(n => n.id === id);
    if (notification) {
      if (notification.title.includes("task")) {
        navigate("/app/tasks");
      } else if (notification.title.includes("Meeting")) {
        navigate("/app/calendar");
      } else if (notification.title.includes("Project")) {
        navigate("/app/projects");
      }
    }
  };
  
  return (
    <header className="sticky top-0 z-40 border-b bg-timeflow-dark border-timeflow-lightgray/20">
      <div className="flex h-14 items-center justify-between px-4">
        <div 
          className="flex items-center cursor-pointer" 
          onClick={goToLandingPage}
          aria-label="Go to landing page"
        >
          <h1 className="text-timeflow-primary text-xl font-bold mr-3">
            TIME
          </h1>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Button 
              variant="ghost" 
              size="icon"
              className="relative text-gray-400 hover:text-white"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-timeflow-primary rounded-full"></span>
              )}
            </Button>
            
            {showNotifications && (
              <Card className="absolute right-0 mt-2 w-80 p-2 bg-timeflow-gray border-timeflow-lightgray z-50">
                <div className="flex justify-between items-center mb-2 p-2">
                  <h3 className="font-medium text-white">Notifications</h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs text-gray-400 hover:text-white"
                    onClick={() => navigate("/app/notifications")}
                  >
                    View All
                  </Button>
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id}
                      className={`p-2 mb-1 hover:bg-timeflow-lightgray rounded cursor-pointer ${!notification.read ? 'border-l-2 border-timeflow-primary' : ''}`}
                      onClick={() => handleNotificationClick(notification.id)}
                    >
                      <div className="flex justify-between">
                        <h4 className="text-sm font-medium text-white">{notification.title}</h4>
                        <span className="text-xs text-gray-400">{notification.time}</span>
                      </div>
                      <p className="text-xs text-gray-300 mt-1">{notification.message}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-gray-400 hover:text-white"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="p-px rounded-full h-8 w-8 relative"
                aria-label="User menu"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={user?.avatar || ""}
                    alt={user?.name || "User"}
                  />
                  <AvatarFallback>{getInitials(user?.name || "User")}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-timeflow-gray border-timeflow-lightgray">
              <DropdownMenuLabel className="text-white">My Account</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-timeflow-lightgray/50" />
              <DropdownMenuItem 
                className="text-gray-300 hover:text-white focus:text-white cursor-pointer"
                onClick={() => navigate("/app/settings")}
              >
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-gray-300 hover:text-white focus:text-white cursor-pointer"
                onClick={() => navigate("/help")}
              >
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>Help</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-timeflow-lightgray/50" />
              <DropdownMenuItem 
                className="text-gray-300 hover:text-white focus:text-white cursor-pointer"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
