
import { useState } from "react";
import { CalendarIcon, Clock, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

type ScheduleMeetingModalProps = {
  open: boolean;
  onClose: () => void;
};

const ScheduleMeetingModal = ({ open, onClose }: ScheduleMeetingModalProps) => {
  const { toast } = useToast();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState("10:00");
  const [duration, setDuration] = useState("60");
  const [participants, setParticipants] = useState("");
  const [dateOpen, setDateOpen] = useState(false);
  
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDate(new Date());
    setTime("10:00");
    setDuration("60");
    setParticipants("");
  };
  
  const handleClose = () => {
    resetForm();
    onClose();
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !date || !time || !duration || !participants) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Meeting Scheduled",
      description: `"${title}" meeting has been scheduled for ${format(date, "PPP")} at ${time}`,
    });
    
    handleClose();
  };
  
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-timeflow-gray border-timeflow-lightgray text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl text-white flex items-center justify-between">
            Schedule Meeting
            <Button variant="ghost" size="icon" onClick={handleClose} className="h-6 w-6 text-gray-400 hover:text-white">
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Meeting Title</Label>
            <Input
              id="title"
              placeholder="Enter meeting title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-timeflow-lightgray border-timeflow-lightgray text-white"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter meeting description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-timeflow-lightgray border-timeflow-lightgray text-white min-h-[80px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Date</Label>
            <Popover open={dateOpen} onOpenChange={setDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal bg-timeflow-lightgray border-timeflow-lightgray text-white"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-timeflow-gray border-timeflow-lightgray">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => {
                    setDate(date);
                    setDateOpen(false);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-gray-400 mr-2" />
                <Input
                  id="time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="bg-timeflow-lightgray border-timeflow-lightgray text-white"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                min="15"
                step="15"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="bg-timeflow-lightgray border-timeflow-lightgray text-white"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="participants">Participants</Label>
            <Textarea
              id="participants"
              placeholder="Enter email addresses separated by comma"
              value={participants}
              onChange={(e) => setParticipants(e.target.value)}
              className="bg-timeflow-lightgray border-timeflow-lightgray text-white min-h-[80px]"
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} className="bg-timeflow-gray border-timeflow-lightgray text-gray-300">
              Cancel
            </Button>
            <Button type="submit" className="bg-timeflow-primary hover:bg-timeflow-primary/90 text-black">
              Schedule Meeting
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleMeetingModal;
