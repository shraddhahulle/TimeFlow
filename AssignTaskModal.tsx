
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useProject } from "@/context/ProjectContext";

type AssignTaskModalProps = {
  open: boolean;
  onClose: () => void;
  memberId?: string;
  projectId?: string;
};

const AssignTaskModal = ({ open, onClose, memberId, projectId }: AssignTaskModalProps) => {
  const { projects, teamMembers, getTeamMember, assignTask } = useProject();
  const { toast } = useToast();
  
  const [selectedProject, setSelectedProject] = useState(projectId || "");
  const [selectedTask, setSelectedTask] = useState("");
  const [selectedMember, setSelectedMember] = useState(memberId || "");
  
  // Reset form when modal opens with new props
  useEffect(() => {
    if (open) {
      setSelectedProject(projectId || "");
      setSelectedMember(memberId || "");
      setSelectedTask("");
    }
  }, [open, projectId, memberId]);
  
  // Get the member details if memberId is provided
  const member = selectedMember ? getTeamMember(selectedMember) : null;
  
  // Find available projects based on selected context
  const availableProjects = memberId 
    ? projects.filter(project => !member?.projects.includes(project.id))
    : projects;
  
  // Get tasks for the selected project
  const projectTasks = selectedProject
    ? projects.find(p => p.id === selectedProject)?.tasks.filter(task => {
        if (selectedMember) {
          return task.status !== "Completed" && !task.assignedTo.includes(selectedMember);
        }
        return task.status !== "Completed";
      }) || []
    : [];
  
  const resetForm = () => {
    if (!projectId) setSelectedProject("");
    if (!memberId) setSelectedMember("");
    setSelectedTask("");
  };
  
  const handleClose = () => {
    resetForm();
    onClose();
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProject || !selectedTask || !selectedMember) {
      toast({
        title: "Missing selection",
        description: "Please select both a project, task, and team member",
        variant: "destructive",
      });
      return;
    }
    
    // Assign the task to the member
    assignTask(selectedMember, selectedProject, selectedTask);
    
    const memberName = getTeamMember(selectedMember)?.name || "Team member";
    const taskName = projects.find(p => p.id === selectedProject)?.tasks.find(t => t.id === selectedTask)?.title || "Task";
    
    toast({
      title: "Task Assigned",
      description: `${taskName} has been assigned to ${memberName}`,
    });
    
    handleClose();
  };
  
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-timeflow-gray border-timeflow-lightgray text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl text-white flex items-center justify-between">
            Assign Task {member ? `to ${member.name}` : ""}
            <Button variant="ghost" size="icon" onClick={handleClose} className="h-6 w-6 text-gray-400 hover:text-white">
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {!memberId && (
            <div className="space-y-2">
              <Label htmlFor="member">Select Team Member</Label>
              <Select value={selectedMember} onValueChange={setSelectedMember}>
                <SelectTrigger className="bg-timeflow-lightgray border-timeflow-lightgray text-white">
                  <SelectValue placeholder="Select a team member" />
                </SelectTrigger>
                <SelectContent className="bg-timeflow-gray border-timeflow-lightgray text-white">
                  {teamMembers.map(member => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          {!projectId && (
            <div className="space-y-2">
              <Label htmlFor="project">Select Project</Label>
              <Select value={selectedProject} onValueChange={(value) => {
                setSelectedProject(value);
                setSelectedTask("");
              }}>
                <SelectTrigger className="bg-timeflow-lightgray border-timeflow-lightgray text-white">
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent className="bg-timeflow-gray border-timeflow-lightgray text-white">
                  {member && member.projects.length > 0 && (
                    <SelectItem value="current" disabled>Current Projects</SelectItem>
                  )}
                  
                  {member && member.projects.map(projectId => {
                    const project = projects.find(p => p.id === projectId);
                    if (!project) return null;
                    
                    return (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    );
                  })}
                  
                  {availableProjects.length > 0 && (
                    <>
                      {member && member.projects.length > 0 && (
                        <SelectItem value="available" disabled>Other Projects</SelectItem>
                      )}
                      {availableProjects.map(project => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
          )}
          
          {selectedProject && (
            <div className="space-y-2">
              <Label htmlFor="task">Select Task</Label>
              <Select value={selectedTask} onValueChange={setSelectedTask}>
                <SelectTrigger className="bg-timeflow-lightgray border-timeflow-lightgray text-white">
                  <SelectValue placeholder="Select a task" />
                </SelectTrigger>
                <SelectContent className="bg-timeflow-gray border-timeflow-lightgray text-white">
                  {projectTasks.length > 0 ? (
                    projectTasks.map(task => (
                      <SelectItem key={task.id} value={task.id}>
                        {task.title}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>
                      No available tasks
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} className="bg-timeflow-gray border-timeflow-lightgray text-gray-300">
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-timeflow-primary hover:bg-timeflow-primary/90 text-black"
              disabled={!selectedProject || !selectedTask || !selectedMember}
            >
              Assign Task
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AssignTaskModal;
