
import { useNavigate } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const LandingFooter = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const currentYear = new Date().getFullYear();
  
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Subscribed Successfully",
      description: "Thank you for subscribing to our newsletter!",
    });
    
    // Clear the input
    const input = document.getElementById("email-subscription") as HTMLInputElement;
    if (input) input.value = "";
  };
  
  return (
    <footer className="bg-timeflow-gray border-t border-timeflow-lightgray/20" id="contact">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Newsletter Subscription */}
        <div className="mb-12 pb-10 border-b border-timeflow-lightgray/20">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-white text-xl font-semibold mb-4">Subscribe to Our Newsletter</h3>
            <p className="text-gray-400 mb-6">
              Stay updated with the latest features, tips, and project management insights.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
              <Input 
                type="email" 
                id="email-subscription" 
                placeholder="Enter your email" 
                className="bg-timeflow-lightgray border-timeflow-lightgray text-white flex-1" 
                required
              />
              <Button 
                type="submit" 
                className="bg-timeflow-primary hover:bg-timeflow-primary/90 text-black"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand and Description */}
          <div className="md:col-span-1">
            <h2 className="text-timeflow-primary text-2xl font-bold mb-4 cursor-pointer" onClick={() => navigate("/")}>TIME</h2>
            <p className="text-gray-400 text-sm">
              AI-powered project timeline generator for efficient project management
            </p>
            <div className="mt-6 flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-timeflow-primary">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-timeflow-primary">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-timeflow-primary">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-timeflow-primary">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Features */}
          <div className="md:col-span-1">
            <h3 className="text-white text-lg font-medium mb-4">Features</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" onClick={(e) => { e.preventDefault(); navigate("/features/scheduling"); }} className="text-gray-400 hover:text-timeflow-primary text-sm flex items-center">
                  <span className="w-1.5 h-1.5 bg-timeflow-primary rounded-full mr-2"></span>
                  Scheduling
                </a>
              </li>
              <li>
                <a href="#" onClick={(e) => { e.preventDefault(); navigate("/features/gantt-charts"); }} className="text-gray-400 hover:text-timeflow-primary text-sm flex items-center">
                  <span className="w-1.5 h-1.5 bg-timeflow-primary rounded-full mr-2"></span>
                  Gantt Charts
                </a>
              </li>
              <li>
                <a href="#" onClick={(e) => { e.preventDefault(); navigate("/features/team-collaboration"); }} className="text-gray-400 hover:text-timeflow-primary text-sm flex items-center">
                  <span className="w-1.5 h-1.5 bg-timeflow-primary rounded-full mr-2"></span>
                  Team Collaboration
                </a>
              </li>
              <li>
                <a href="#" onClick={(e) => { e.preventDefault(); navigate("/features/progress-tracking"); }} className="text-gray-400 hover:text-timeflow-primary text-sm flex items-center">
                  <span className="w-1.5 h-1.5 bg-timeflow-primary rounded-full mr-2"></span>
                  Progress Tracking
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="md:col-span-1">
            <h3 className="text-white text-lg font-medium mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" onClick={(e) => { e.preventDefault(); navigate("/about"); }} className="text-gray-400 hover:text-timeflow-primary text-sm flex items-center">
                  <span className="w-1.5 h-1.5 bg-timeflow-primary rounded-full mr-2"></span>
                  About Us
                </a>
              </li>
              <li>
                <a href="#" onClick={(e) => { e.preventDefault(); navigate("/contact"); }} className="text-gray-400 hover:text-timeflow-primary text-sm flex items-center">
                  <span className="w-1.5 h-1.5 bg-timeflow-primary rounded-full mr-2"></span>
                  Contact
                </a>
              </li>
              <li>
                <a href="#" onClick={(e) => { e.preventDefault(); navigate("/privacy"); }} className="text-gray-400 hover:text-timeflow-primary text-sm flex items-center">
                  <span className="w-1.5 h-1.5 bg-timeflow-primary rounded-full mr-2"></span>
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" onClick={(e) => { e.preventDefault(); navigate("/terms"); }} className="text-gray-400 hover:text-timeflow-primary text-sm flex items-center">
                  <span className="w-1.5 h-1.5 bg-timeflow-primary rounded-full mr-2"></span>
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-1">
            <h3 className="text-white text-lg font-medium mb-4">Get in Touch</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-timeflow-primary mr-2 mt-0.5" />
                <span className="text-gray-400 text-sm">
                  123 Project Street, San Francisco, CA 94107
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-timeflow-primary mr-2" />
                <a href="tel:+11234567890" className="text-gray-400 hover:text-timeflow-primary text-sm">
                  +1 (123) 456-7890
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-timeflow-primary mr-2" />
                <a href="mailto:info@timeflow.ai" className="text-gray-400 hover:text-timeflow-primary text-sm">
                  info@timeflow.ai
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-timeflow-lightgray/20 text-center">
          <p className="text-gray-400 text-sm">
            &copy; {currentYear} TimeFlow. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
