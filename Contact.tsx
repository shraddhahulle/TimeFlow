
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LandingHeader from "@/components/LandingHeader";
import LandingFooter from "@/components/LandingFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Send } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Contact = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent",
      description: "Thank you for your message. We'll get back to you shortly!",
    });
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: ""
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-timeflow-dark">
      <LandingHeader />
      
      <main className="flex-1 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-12 text-center">Contact Us</h1>
          
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <h2 className="text-2xl font-semibold text-white mb-6">Get in Touch</h2>
              
              <p className="text-gray-300 mb-8">
                Have questions about TimeFlow? Want to schedule a demo? Or just want to say hello?
                Our team is ready to assist you with any inquiries you may have.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-timeflow-primary/10 p-3 rounded-full">
                    <MapPin className="h-6 w-6 text-timeflow-primary" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-white">Office Location</h3>
                    <p className="text-gray-400 mt-1">123 Project Street, San Francisco, CA 94107</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-timeflow-primary/10 p-3 rounded-full">
                    <Phone className="h-6 w-6 text-timeflow-primary" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-white">Phone Number</h3>
                    <p className="text-gray-400 mt-1">+1 (123) 456-7890</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-timeflow-primary/10 p-3 rounded-full">
                    <Mail className="h-6 w-6 text-timeflow-primary" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-white">Email Address</h3>
                    <p className="text-gray-400 mt-1">info@timeflow.ai</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-10">
                <h3 className="text-lg font-medium text-white mb-3">Business Hours</h3>
                <p className="text-gray-400">Monday - Friday: 9:00 AM - 6:00 PM PST</p>
                <p className="text-gray-400">Saturday - Sunday: Closed</p>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="bg-timeflow-gray p-8 rounded-lg border border-timeflow-lightgray/20">
              <h2 className="text-2xl font-semibold text-white mb-6">Send Us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                    Your Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="bg-timeflow-lightgray border-timeflow-lightgray text-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="bg-timeflow-lightgray border-timeflow-lightgray text-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-1">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="bg-timeflow-lightgray border-timeflow-lightgray text-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="bg-timeflow-lightgray border-timeflow-lightgray text-white"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-timeflow-primary hover:bg-timeflow-primary/90 text-black font-medium"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>
      
      <LandingFooter />
    </div>
  );
};

export default Contact;
