
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ChevronDown, 
  Menu, 
  X,
  FileText,
  BarChart,
  Calendar,
  Users,
  Home,
  Info,
  Mail,
  FileUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/components/ui/use-toast";

const LandingHeader = () => {
  const navigate = useNavigate();
  const { login } = useUser();
  const { toast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogin = async () => {
    try {
      await login("sarah@timeflow.ai", "password");
      navigate("/app");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const handleNavigation = (path: string) => {
    if (path.startsWith('#')) {
      document.getElementById(path.substring(1))?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(path);
    }
    setMobileMenuOpen(false);
  };
  
  const handleDemoRequest = () => {
    toast({
      title: "Demo Request Received",
      description: "Our team will contact you soon to schedule a demo",
    });
  };

  return (
    <header className="sticky top-0 z-50 bg-timeflow-dark border-b border-timeflow-lightgray/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 
                className="text-timeflow-primary text-2xl font-bold cursor-pointer" 
                onClick={() => navigate("/")}
              >
                TIME
              </h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <button 
              onClick={() => handleNavigation("/")} 
              className="text-gray-300 hover:text-timeflow-primary px-3 py-2 text-sm font-medium flex items-center"
            >
              <Home className="mr-1 h-4 w-4" />
              Home
            </button>
            
            <button 
              onClick={() => handleNavigation("#features")} 
              className="text-gray-300 hover:text-timeflow-primary px-3 py-2 text-sm font-medium flex items-center"
            >
              <FileText className="mr-1 h-4 w-4" />
              Features
            </button>
            
            <button 
              onClick={() => handleNavigation("/contact")} 
              className="text-gray-300 hover:text-timeflow-primary px-3 py-2 text-sm font-medium flex items-center"
            >
              <Mail className="mr-1 h-4 w-4" />
              Contact Us
            </button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="text-gray-300 hover:text-timeflow-primary px-3 py-2 text-sm font-medium flex items-center">
                  <BarChart className="mr-1 h-4 w-4" />
                  Reports <ChevronDown className="ml-1 h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-timeflow-gray border-timeflow-lightgray w-48">
                <DropdownMenuItem onClick={() => navigate("/app/reports")} className="text-white hover:bg-timeflow-lightgray cursor-pointer">
                  Last Quarter
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/app/reports")} className="text-white hover:bg-timeflow-lightgray cursor-pointer">
                  Annual Reports
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/app/reports")} className="text-white hover:bg-timeflow-lightgray cursor-pointer">
                  Team Performance
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button onClick={handleDemoRequest} variant="outline" className="border-timeflow-primary text-timeflow-primary hover:bg-timeflow-primary/10 mr-2">
              Request Demo
            </Button>
            
            <Button onClick={handleLogin} className="bg-timeflow-primary hover:bg-timeflow-primary/90 text-black">
              Get Started
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-gray-300 hover:text-white focus:outline-none"
              onClick={toggleMobileMenu}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-timeflow-gray border-t border-timeflow-lightgray/20">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <button
              onClick={() => handleNavigation("/")}
              className="text-gray-300 hover:text-timeflow-primary flex items-center w-full px-3 py-2 text-base font-medium"
            >
              <Home className="mr-2 h-5 w-5" />
              Home
            </button>
            
            <button
              onClick={() => handleNavigation("#features")}
              className="text-gray-300 hover:text-timeflow-primary flex items-center w-full px-3 py-2 text-base font-medium"
            >
              <FileText className="mr-2 h-5 w-5" />
              Features
            </button>
            
            <button
              onClick={() => handleNavigation("/contact")}
              className="text-gray-300 hover:text-timeflow-primary flex items-center w-full px-3 py-2 text-base font-medium"
            >
              <Mail className="mr-2 h-5 w-5" />
              Contact Us
            </button>
            
            <div className="relative">
              <button
                className="text-gray-300 hover:text-timeflow-primary flex items-center w-full px-3 py-2 text-base font-medium"
                onClick={() => navigate("/app/reports")}
              >
                <BarChart className="mr-2 h-5 w-5" />
                Reports
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
            </div>
            
            <div className="pt-4 flex flex-col gap-2">
              <Button
                onClick={handleDemoRequest}
                variant="outline"
                className="w-full border-timeflow-primary text-timeflow-primary hover:bg-timeflow-primary/10"
              >
                Request Demo
              </Button>
              
              <Button
                onClick={handleLogin}
                className="w-full bg-timeflow-primary hover:bg-timeflow-primary/90 text-black"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default LandingHeader;
