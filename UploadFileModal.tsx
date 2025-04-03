
import { useState, useRef } from "react";
import { X, Upload, File, Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useProject } from "@/context/ProjectContext";

type UploadFileModalProps = {
  open: boolean;
  onClose: () => void;
  projectId?: string;
};

const UploadFileModal = ({ open, onClose, projectId }: UploadFileModalProps) => {
  const { projects, addFileToProject } = useProject();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [fileName, setFileName] = useState("");
  const [fileDescription, setFileDescription] = useState("");
  const [selectedProject, setSelectedProject] = useState(projectId || "");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const availableProjects = projectId 
    ? projects.filter(p => p.id === projectId) 
    : projects;
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (!fileName) {
        setFileName(file.name);
      }
    }
  };
  
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  const resetForm = () => {
    setFileName("");
    setFileDescription("");
    if (!projectId) setSelectedProject("");
    setSelectedFile(null);
  };
  
  const handleClose = () => {
    resetForm();
    onClose();
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProject || !fileName) {
      toast({
        title: "Missing information",
        description: "Please provide a file name and select a project",
        variant: "destructive",
      });
      return;
    }
    
    setIsUploading(true);
    
    // Simulate upload delay
    setTimeout(() => {
      const fileData = {
        id: `file-${Date.now()}`,
        name: fileName,
        description: fileDescription,
        type: selectedFile?.type || 'document',
        size: selectedFile?.size || 0,
        uploadDate: new Date().toISOString(),
        url: selectedFile ? URL.createObjectURL(selectedFile) : '',
      };
      
      // Add file to project
      addFileToProject(selectedProject, fileData);
      
      toast({
        title: "File Uploaded",
        description: `${fileName} has been uploaded successfully`,
      });
      
      setIsUploading(false);
      handleClose();
    }, 1500);
  };
  
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-timeflow-gray border-timeflow-lightgray text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl text-white flex items-center justify-between">
            Upload File
            <Button variant="ghost" size="icon" onClick={handleClose} className="h-6 w-6 text-gray-400 hover:text-white">
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div 
            className={`border-2 border-dashed ${selectedFile ? 'border-timeflow-primary' : 'border-timeflow-lightgray'} rounded-md p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors`}
            onClick={handleUploadClick}
          >
            <input 
              type="file" 
              className="hidden" 
              onChange={handleFileChange} 
              ref={fileInputRef}
            />
            
            {selectedFile ? (
              <>
                <div className="w-12 h-12 rounded-full bg-timeflow-primary/20 flex items-center justify-center">
                  <Check className="h-6 w-6 text-timeflow-primary" />
                </div>
                <p className="text-white font-medium">{selectedFile.name}</p>
                <p className="text-gray-400 text-sm">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  className="mt-2 bg-timeflow-gray border-timeflow-primary text-timeflow-primary hover:bg-timeflow-primary hover:text-black"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUploadClick();
                  }}
                >
                  Change File
                </Button>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-full bg-timeflow-lightgray flex items-center justify-center">
                  <Upload className="h-6 w-6 text-gray-300" />
                </div>
                <p className="text-white font-medium">Click to upload a file</p>
                <p className="text-gray-400 text-sm">or drag and drop</p>
                <p className="text-gray-500 text-xs">Maximum file size: 10MB</p>
              </>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="fileName">File Name</Label>
            <Input
              id="fileName"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="Enter file name"
              className="bg-timeflow-lightgray border-timeflow-lightgray text-white"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="fileDescription">Description (optional)</Label>
            <Input
              id="fileDescription"
              value={fileDescription}
              onChange={(e) => setFileDescription(e.target.value)}
              placeholder="Brief description of the file"
              className="bg-timeflow-lightgray border-timeflow-lightgray text-white"
            />
          </div>
          
          {!projectId && (
            <div className="space-y-2">
              <Label htmlFor="project">Project</Label>
              <select
                id="project"
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="w-full bg-timeflow-lightgray border-timeflow-lightgray text-white rounded-md p-2"
                required
              >
                <option value="" disabled>Select a project</option>
                {availableProjects.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} className="bg-timeflow-gray border-timeflow-lightgray text-gray-300">
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-timeflow-primary hover:bg-timeflow-primary/90 text-black"
              disabled={isUploading || !selectedFile || !fileName || !selectedProject}
            >
              {isUploading ? (
                <>
                  <span className="mr-2 animate-spin">◌</span>
                  Uploading...
                </>
              ) : (
                <>
                  <File className="mr-2 h-4 w-4" />
                  Upload
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UploadFileModal;
