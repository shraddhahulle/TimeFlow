
import { useState } from "react";
import { X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

type SendEmailModalProps = {
  open: boolean;
  onClose: () => void;
  recipientEmail?: string;
  recipientName?: string;
};

const SendEmailModal = ({ open, onClose, recipientEmail = "", recipientName = "" }: SendEmailModalProps) => {
  const { toast } = useToast();
  
  const [to, setTo] = useState(recipientEmail);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  
  const resetForm = () => {
    setTo(recipientEmail);
    setSubject("");
    setMessage("");
  };
  
  const handleClose = () => {
    resetForm();
    onClose();
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!to || !subject || !message) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    // In a real application, this would send the email via an API
    console.log("Sending email:", { to, subject, message });
    
    toast({
      title: "Email Sent",
      description: `Your email to ${recipientName || to} has been sent successfully.`,
    });
    
    handleClose();
  };
  
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-timeflow-gray border-timeflow-lightgray text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl text-white flex items-center justify-between">
            Send Email
            <Button variant="ghost" size="icon" onClick={handleClose} className="h-6 w-6 text-gray-400 hover:text-white">
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="to">To</Label>
            <Input
              id="to"
              type="email"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="bg-timeflow-lightgray border-timeflow-lightgray text-white"
              readOnly={!!recipientEmail}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              placeholder="Enter email subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="bg-timeflow-lightgray border-timeflow-lightgray text-white"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Enter your message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="bg-timeflow-lightgray border-timeflow-lightgray text-white"
              rows={6}
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} className="bg-timeflow-gray border-timeflow-lightgray text-gray-300">
              Cancel
            </Button>
            <Button type="submit" className="bg-timeflow-primary hover:bg-timeflow-primary/90 text-black">
              Send Email
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SendEmailModal;
