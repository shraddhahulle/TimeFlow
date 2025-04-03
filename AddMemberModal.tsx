
import { useState } from "react";
import { X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useParams } from "react-router-dom";

type AddMemberModalProps = {
  open: boolean;
  onClose: () => void;
  onAddMember?: (member: any) => void;
  projectMode?: boolean;
};

const AddMemberModal = ({ open, onClose, onAddMember, projectMode = false }: AddMemberModalProps) => {
  const { toast } = useToast();
  const { id } = useParams();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [department, setDepartment] = useState("");
  
  const resetForm = () => {
    setName("");
    setEmail("");
    setRole("");
    setDepartment("");
  };
  
  const handleClose = () => {
    resetForm();
    onClose();
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !role || !department) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    // Create new member object
    const newMember = {
      id: `team${Date.now()}`,
      name,
      email,
      role,
      department,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
      tasks: 0,
      completedTasks: 0,
      performance: 85,
      projects: projectMode ? [id] : [],
      availability: "Available"
    };
    
    if (onAddMember) {
      onAddMember(newMember);
    }
    
    toast({
      title: "Success",
      description: projectMode 
        ? `${name} has been added to the project team` 
        : `${name} has been added to the team`,
    });
    
    handleClose();
  };
  
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-timeflow-gray border-timeflow-lightgray text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl text-white flex items-center justify-between">
            {projectMode ? "Add Team Member to Project" : "Add New Team Member"}
            <Button variant="ghost" size="icon" onClick={handleClose} className="h-6 w-6 text-gray-400 hover:text-white">
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="Enter full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-timeflow-lightgray border-timeflow-lightgray text-white"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-timeflow-lightgray border-timeflow-lightgray text-white"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                placeholder="Enter role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="bg-timeflow-lightgray border-timeflow-lightgray text-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger className="bg-timeflow-lightgray border-timeflow-lightgray text-white">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent className="bg-timeflow-gray border-timeflow-lightgray text-white">
                  <SelectItem value="Management">Management</SelectItem>
                  <SelectItem value="Design">Design</SelectItem>
                  <SelectItem value="Development">Development</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} className="bg-timeflow-gray border-timeflow-lightgray text-gray-300">
              Cancel
            </Button>
            <Button type="submit" className="bg-timeflow-primary hover:bg-timeflow-primary/90 text-black">
              {projectMode ? "Add to Project" : "Add Member"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMemberModal;
