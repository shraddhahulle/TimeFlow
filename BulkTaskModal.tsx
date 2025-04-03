
import { useState } from "react";
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
import { CalendarIcon, Plus, Trash } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProject } from "@/context/ProjectContext";

interface BulkTaskModalProps {
  open: boolean;
  onClose: () => void;
  projectId: string;
}

interface TaskData {
  title: string;
  description: string;
  department: string;
  status: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
}

const BulkTaskModal = ({ open, onClose, projectId }: BulkTaskModalProps) => {
  const { addTaskToProject } = useProject();
  
  const [tasks, setTasks] = useState<TaskData[]>([
    {
      title: "",
      description: "",
      department: "",
      status: "Planned",
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 14)),
    }
  ]);
  
  const handleAddTask = () => {
    setTasks([
      ...tasks,
      {
        title: "",
        description: "",
        department: "",
        status: "Planned",
        startDate: new Date(),
        endDate: new Date(new Date().setDate(new Date().getDate() + 14)),
      }
    ]);
  };
  
  const handleRemoveTask = (index: number) => {
    if (tasks.length === 1) return;
    setTasks(tasks.filter((_, i) => i !== index));
  };
  
  const handleChangeTask = (index: number, field: keyof TaskData, value: any) => {
    const updatedTasks = [...tasks];
    updatedTasks[index] = { ...updatedTasks[index], [field]: value };
    setTasks(updatedTasks);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all tasks
    for (const task of tasks) {
      if (!task.title || !task.description || !task.department || !task.startDate || !task.endDate) {
        return;
      }
    }
    
    // Add all tasks to the project
    tasks.forEach(task => {
      if (task.startDate && task.endDate) {
        addTaskToProject(projectId, {
          title: task.title,
          description: task.description,
          department: task.department,
          status: task.status as "Planned" | "In Progress" | "On Hold" | "Completed",
          startDate: task.startDate.toISOString().split("T")[0],
          endDate: task.endDate.toISOString().split("T")[0],
          assignedTo: [],
          progress: task.status === "Completed" ? 100 : task.status === "In Progress" ? 50 : 0
        });
      }
    });
    
    resetForm();
    onClose();
  };
  
  const resetForm = () => {
    setTasks([
      {
        title: "",
        description: "",
        department: "",
        status: "Planned",
        startDate: new Date(),
        endDate: new Date(new Date().setDate(new Date().getDate() + 14)),
      }
    ]);
  };
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-timeflow-gray border-timeflow-lightgray text-white max-w-4xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-xl text-white">Add Multiple Tasks</DialogTitle>
            <DialogDescription className="text-gray-400">
              Create multiple tasks at once for this project.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {tasks.map((task, index) => (
              <div key={index} className="p-4 border border-timeflow-lightgray rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white font-medium">Task #{index + 1}</h3>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-white"
                    onClick={() => handleRemoveTask(index)}
                    disabled={tasks.length === 1}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">
                      Task Title
                    </label>
                    <Input 
                      value={task.title}
                      onChange={(e) => handleChangeTask(index, 'title', e.target.value)}
                      className="bg-timeflow-lightgray border-timeflow-lightgray text-white"
                      placeholder="Enter task title"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">
                      Description
                    </label>
                    <Textarea 
                      value={task.description}
                      onChange={(e) => handleChangeTask(index, 'description', e.target.value)}
                      className="bg-timeflow-lightgray border-timeflow-lightgray text-white min-h-[80px]"
                      placeholder="Enter task description"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">
                        Department
                      </label>
                      <Select 
                        value={task.department} 
                        onValueChange={(value) => handleChangeTask(index, 'department', value)}
                        required
                      >
                        <SelectTrigger className="bg-timeflow-lightgray border-timeflow-lightgray text-white">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent className="bg-timeflow-lightgray border-timeflow-lightgray">
                          <SelectItem value="Design" className="text-white hover:bg-timeflow-dark">Design</SelectItem>
                          <SelectItem value="Development" className="text-white hover:bg-timeflow-dark">Development</SelectItem>
                          <SelectItem value="Marketing" className="text-white hover:bg-timeflow-dark">Marketing</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">
                        Status
                      </label>
                      <Select 
                        value={task.status} 
                        onValueChange={(value) => handleChangeTask(index, 'status', value)}
                        required
                      >
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
                              !task.startDate && "text-gray-400"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {task.startDate ? format(task.startDate, "MMM dd, yyyy") : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-timeflow-gray border-timeflow-lightgray">
                          <Calendar
                            mode="single"
                            selected={task.startDate}
                            onSelect={(date) => handleChangeTask(index, 'startDate', date)}
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
                              !task.endDate && "text-gray-400"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {task.endDate ? format(task.endDate, "MMM dd, yyyy") : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-timeflow-gray border-timeflow-lightgray">
                          <Calendar
                            mode="single"
                            selected={task.endDate}
                            onSelect={(date) => handleChangeTask(index, 'endDate', date)}
                            initialFocus
                            className="bg-timeflow-gray text-white"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            <Button
              type="button"
              variant="outline"
              className="w-full border-dashed border-timeflow-lightgray text-gray-300 hover:bg-timeflow-lightgray/10"
              onClick={handleAddTask}
            >
              <Plus className="mr-2 h-4 w-4" /> Add Another Task
            </Button>
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
              Create Tasks ({tasks.length})
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BulkTaskModal;
