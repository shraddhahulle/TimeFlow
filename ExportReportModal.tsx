
import { useState } from "react";
import { FileText, Download, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useProject } from "@/context/ProjectContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

type ExportReportModalProps = {
  open: boolean;
  onClose: () => void;
  projectId?: string;
};

const ExportReportModal = ({ open, onClose, projectId }: ExportReportModalProps) => {
  const { toast } = useToast();
  const { projects } = useProject();
  
  const [format, setFormat] = useState("pdf");
  const [includeMetrics, setIncludeMetrics] = useState(true);
  const [includeTasks, setIncludeTasks] = useState(true);
  const [includeTeam, setIncludeTeam] = useState(true);
  const [selectedProject, setSelectedProject] = useState(projectId || "");
  
  const resetForm = () => {
    setFormat("pdf");
    setIncludeMetrics(true);
    setIncludeTasks(true);
    setIncludeTeam(true);
    setSelectedProject(projectId || "");
  };
  
  const handleClose = () => {
    resetForm();
    onClose();
  };
  
  const handleExport = () => {
    if (!selectedProject) {
      toast({
        title: "Error",
        description: "Please select a project",
        variant: "destructive",
      });
      return;
    }
    
    const project = projects.find(p => p.id === selectedProject);
    
    toast({
      title: "Report Generated",
      description: `${project?.name} report has been exported as ${format.toUpperCase()}`,
    });
    
    handleClose();
  };
  
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-timeflow-gray border-timeflow-lightgray text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl text-white flex items-center justify-between">
            Export Report
            <Button variant="ghost" size="icon" onClick={handleClose} className="h-6 w-6 text-gray-400 hover:text-white">
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {!projectId && (
            <div className="space-y-2">
              <Label>Select Project</Label>
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger className="bg-timeflow-lightgray border-timeflow-lightgray text-white">
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent className="bg-timeflow-gray border-timeflow-lightgray text-white">
                  {projects.map(project => (
                    <SelectItem key={project.id} value={project.id}>{project.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="space-y-2">
            <Label>Export Format</Label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger className="bg-timeflow-lightgray border-timeflow-lightgray text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-timeflow-gray border-timeflow-lightgray text-white">
                <SelectItem value="pdf">PDF Document</SelectItem>
                <SelectItem value="xlsx">Excel Spreadsheet</SelectItem>
                <SelectItem value="csv">CSV File</SelectItem>
                <SelectItem value="json">JSON Data</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-3 pt-2">
            <Label>Report Contents</Label>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="includeMetrics" 
                checked={includeMetrics}
                onCheckedChange={(checked) => setIncludeMetrics(!!checked)}
              />
              <Label htmlFor="includeMetrics" className="text-sm font-normal cursor-pointer">
                Include project metrics and progress
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="includeTasks" 
                checked={includeTasks}
                onCheckedChange={(checked) => setIncludeTasks(!!checked)}
              />
              <Label htmlFor="includeTasks" className="text-sm font-normal cursor-pointer">
                Include tasks and timeline
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="includeTeam" 
                checked={includeTeam}
                onCheckedChange={(checked) => setIncludeTeam(!!checked)}
              />
              <Label htmlFor="includeTeam" className="text-sm font-normal cursor-pointer">
                Include team members and assignments
              </Label>
            </div>
          </div>
          
          <div className="bg-timeflow-lightgray/30 p-3 rounded-md mt-4 flex items-center">
            <FileText className="h-5 w-5 text-timeflow-primary mr-3" />
            <div className="text-sm text-gray-300">
              Your report will be generated and downloaded to your device
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose} className="bg-timeflow-gray border-timeflow-lightgray text-gray-300">
            Cancel
          </Button>
          <Button onClick={handleExport} className="bg-timeflow-primary hover:bg-timeflow-primary/90 text-black">
            <Download className="h-4 w-4 mr-2" /> Export Report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExportReportModal;
