import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProject } from "@/context/ProjectContext";

interface NewProjectModalProps {
  open: boolean;
  onClose: () => void;
}

const NewProjectModal = ({ open, onClose }: NewProjectModalProps) => {
  const { createProject } = useProject();
  const navigate = useNavigate();
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [department, setDepartment] = useState("");
  const [status, setStatus] = useState("Planned");
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(
    new Date(new Date().setMonth(new Date().getMonth() + 1))
  );
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !description || !department || !startDate || !endDate) {
      return;
    }
    
    createProject({
      name,
      description,
      department,
      status: status as "Planned" | "In Progress" | "On Hold" | "Completed",
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
      progress: 0
    });
    
    resetForm();
    onClose();
    // Navigate to projects page
    navigate("/app/projects");
  };
  
  const resetForm = () => {
    setName("");
    setDescription("");
    setDepartment("");
    setStatus("Planned");
    setStartDate(new Date());
    setEndDate(new Date(new Date().setMonth(new Date().getMonth() + 1)));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-timeflow-gray border-timeflow-lightgray text-white max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-xl text-white">Create New Project</DialogTitle>
            <DialogDescription className="text-gray-400">
              Enter the details to create a new project.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-gray-300">
                Project Name
              </label>
              <Input 
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-timeflow-lightgray border-timeflow-lightgray text-white"
                placeholder="Enter project name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium text-gray-300">
                Description
              </label>
              <Textarea 
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-timeflow-lightgray border-timeflow-lightgray text-white min-h-[80px]"
                placeholder="Enter project description"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="department" className="text-sm font-medium text-gray-300">
                  Department
                </label>
                <Select value={department} onValueChange={setDepartment} required>
                  <SelectTrigger className="bg-timeflow-lightgray border-timeflow-lightgray text-white">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className="bg-timeflow-lightgray border-timeflow-lightgray">
                    <SelectItem value="Management" className="text-white hover:bg-timeflow-dark">Management</SelectItem>
                    <SelectItem value="Design" className="text-white hover:bg-timeflow-dark">Design</SelectItem>
                    <SelectItem value="Development" className="text-white hover:bg-timeflow-dark">Development</SelectItem>
                    <SelectItem value="Marketing" className="text-white hover:bg-timeflow-dark">Marketing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="status" className="text-sm font-medium text-gray-300">
                  Status
                </label>
                <Select value={status} onValueChange={setStatus} required>
                  <SelectTrigger className="bg-timeflow-lightgray border-timeflow-lightgray text-white">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className="bg-timeflow-lightgray border-timeflow-lightgray">
                    <SelectItem value="Planned" className="text-white hover:bg-timeflow-dark">Planned</SelectItem>
                    <SelectItem value="In Progress" className="text-white hover:bg-timeflow-dark">In Progress</SelectItem>
                    <SelectItem value="On Hold" className="text-white hover:bg-timeflow-dark">On Hold</SelectItem>
                    <SelectItem value="Completed" className="text-white hover:bg-timeflow-dark">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Start Date
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal bg-timeflow-lightgray border-timeflow-lightgray text-white",
                        !startDate && "text-gray-400"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "MMM dd, yyyy") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-timeflow-gray border-timeflow-lightgray">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                      className="bg-timeflow-gray text-white"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  End Date
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal bg-timeflow-lightgray border-timeflow-lightgray text-white",
                        !endDate && "text-gray-400"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "MMM dd, yyyy") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-timeflow-gray border-timeflow-lightgray">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                      className="bg-timeflow-gray text-white"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-timeflow-lightgray text-gray-300 hover:bg-timeflow-lightgray"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="bg-timeflow-primary hover:bg-timeflow-primary/90 text-black"
            >
              Create Project
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewProjectModal;
