
import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Calendar as CalendarIcon, Plus, Clock, FileUp, Users, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay } from "date-fns";
import CustomCalendar from "@/components/CustomCalendar";

const Calendar = () => {
  const { toast } = useToast();
  const [eventForm, setEventForm] = useState({
    title: "",
    date: "",
    startTime: "",
    endTime: "",
    description: "",
    priority: "medium"
  });
  
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  const [events, setEvents] = useState([
    {
      id: "1",
      title: "Project Kickoff",
      date: "2023-08-10",
      time: "09:00 AM - 10:30 AM",
      priority: "high"
    },
    {
      id: "2",
      title: "Team Sync",
      date: "2023-08-11",
      time: "02:00 PM - 03:00 PM",
      priority: "medium"
    },
    {
      id: "3",
      title: "Client Meeting",
      date: "2023-08-15",
      time: "11:00 AM - 12:00 PM",
      priority: "high"
    },
    {
      id: "4",
      title: "Design Review",
      date: format(new Date(), "yyyy-MM-dd"),
      time: "10:00 AM - 11:00 AM",
      priority: "medium"
    },
    {
      id: "5",
      title: "Marketing Strategy",
      date: format(new Date(new Date().setDate(new Date().getDate() + 2)), "yyyy-MM-dd"),
      time: "01:00 PM - 02:30 PM",
      priority: "high"
    },
    {
      id: "6",
      title: "Product Demo",
      date: format(new Date(new Date().setDate(new Date().getDate() + 1)), "yyyy-MM-dd"),
      time: "03:00 PM - 04:00 PM",
      priority: "low"
    }
  ]);
  
  const handleEventChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEventForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handlePriorityChange = (value: string) => {
    setEventForm(prev => ({ ...prev, priority: value }));
  };
  
  const handleAddEvent = () => {
    // Create a new event
    const newEvent = {
      id: `${events.length + 1}`,
      title: eventForm.title,
      date: eventForm.date,
      time: `${eventForm.startTime} - ${eventForm.endTime}`,
      priority: eventForm.priority
    };
    
    // Add the new event to the events array
    setEvents([...events, newEvent]);
    
    // Show success toast
    toast({
      title: "Event Added",
      description: `"${eventForm.title}" has been added to your calendar`,
    });
    
    // Reset the form
    setEventForm({
      title: "",
      date: "",
      startTime: "",
      endTime: "",
      description: "",
      priority: "medium"
    });
  };
  
  const handleQuickAction = (action: string) => {
    switch(action) {
      case "Add Task":
        toast({
          title: "Add Task",
          description: "Opening task creation form...",
        });
        // In a real app, this would open the task creation form or redirect to the tasks page
        break;
      case "View Week":
        toast({
          title: "Weekly View",
          description: "Switching to weekly calendar view...",
        });
        // In a real app, this would switch the calendar to weekly view
        break;
      case "Schedule Meeting":
        toast({
          title: "Schedule Meeting",
          description: "Opening meeting scheduler...",
        });
        // In a real app, this would open the meeting scheduler
        break;
      case "Upload File":
        toast({
          title: "Upload File",
          description: "Opening file upload dialog...",
        });
        // In a real app, this would open the file upload dialog
        break;
      default:
        toast({
          title: action,
          description: `You selected the ${action} action`,
        });
    }
  };

  // Handle date selection
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setEventForm(prev => ({
      ...prev,
      date: format(date, "yyyy-MM-dd")
    }));
  };
  
  // Get events for the currently selected date
  const getEventsForSelectedDate = () => {
    if (!selectedDate) return [];
    
    const formattedDate = format(selectedDate, "yyyy-MM-dd");
    return events.filter(event => event.date === formattedDate);
  };
  
  const selectedDateEvents = getEventsForSelectedDate();
  
  // Get all days in the current month
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Calendar</h2>
          <p className="text-muted-foreground">
            Manage your schedule and project timeline
          </p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-timeflow-primary text-black hover:bg-timeflow-primary/90">
              <Plus className="mr-2 h-4 w-4" /> Add Event
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Event</DialogTitle>
              <DialogDescription>
                Create a new event or meeting in your calendar
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Event Title</Label>
                <Input 
                  id="title"
                  name="title"
                  value={eventForm.title}
                  onChange={handleEventChange}
                  placeholder="Project meeting, deadline, etc."
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Input 
                  id="date"
                  name="date"
                  type="date" 
                  value={eventForm.date}
                  onChange={handleEventChange}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input 
                    id="startTime"
                    name="startTime"
                    type="time" 
                    value={eventForm.startTime}
                    onChange={handleEventChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="endTime">End Time</Label>
                  <Input 
                    id="endTime"
                    name="endTime"
                    type="time" 
                    value={eventForm.endTime}
                    onChange={handleEventChange}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="priority">Priority</Label>
                <Select 
                  value={eventForm.priority} 
                  onValueChange={handlePriorityChange}
                >
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description"
                  name="description"
                  rows={3}
                  value={eventForm.description}
                  onChange={handleEventChange}
                  placeholder="Enter event details..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddEvent}>Add Event</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Calendar View */}
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Calendar</CardTitle>
              <CardDescription>Your upcoming schedule</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setCurrentMonth(new Date())}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                Today
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setCurrentMonth(prevMonth => subMonths(prevMonth, 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setCurrentMonth(prevMonth => addMonths(prevMonth, 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[500px] rounded-md border bg-muted/20 p-4">
              <div className="text-center text-lg font-semibold mb-4">
                {format(currentMonth, "MMMM yyyy")}
              </div>
              <div className="grid grid-cols-7 gap-px bg-muted rounded-md overflow-hidden">
                {/* Calendar Days Header */}
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="bg-background p-2 text-center text-sm font-medium">
                    {day}
                  </div>
                ))}
                
                {/* Calendar Grid */}
                {Array.from({ length: 42 }).map((_, i) => {
                  // Calculate the date for this cell
                  const startDate = startOfMonth(currentMonth);
                  const firstDayOfMonth = startDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
                  const day = i - firstDayOfMonth;
                  const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day + 1);
                  
                  // Check if this date is in the current month
                  const isCurrentMonth = isSameMonth(date, currentMonth);
                  
                  // Find events for this date
                  const dateEvents = events.filter(event => {
                    const eventDate = new Date(event.date);
                    return isSameDay(eventDate, date);
                  });
                  
                  return (
                    <div
                      key={i}
                      className={`min-h-[80px] p-2 text-sm transition-all cursor-pointer ${
                        isCurrentMonth 
                          ? 'bg-background hover:bg-accent' 
                          : 'bg-muted/30 text-muted-foreground'
                      } ${
                        isToday(date) 
                          ? 'border border-timeflow-blue' 
                          : ''
                      } ${
                        selectedDate && isSameDay(date, selectedDate)
                          ? 'bg-accent' 
                          : ''
                      }`}
                      onClick={() => handleDateSelect(date)}
                    >
                      <div className={`font-medium ${
                        isToday(date) ? 'text-timeflow-blue' : ''
                      }`}>
                        {format(date, 'd')}
                      </div>
                      
                      {/* Show events on this day */}
                      <div className="mt-1 space-y-1 max-h-[60px] overflow-hidden">
                        {dateEvents.map((event) => (
                          <div 
                            key={event.id} 
                            className={`rounded p-1 text-xs truncate ${
                              event.priority === 'high' 
                                ? 'bg-timeflow-red/20 text-timeflow-red' 
                                : event.priority === 'medium'
                                ? 'bg-timeflow-blue/20 text-timeflow-blue'
                                : 'bg-timeflow-green/20 text-timeflow-green'
                            }`}
                          >
                            <div className="font-medium truncate">{event.title}</div>
                            <div className="truncate">{event.time.split(' - ')[0]}</div>
                          </div>
                        ))}
                        
                        {dateEvents.length > 2 && (
                          <div className="text-xs text-muted-foreground text-center">
                            +{dateEvents.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {/* Calendar Component */}
          <CustomCalendar 
            onDateSelect={handleDateSelect}
            className="mb-6"
          />
          
          {/* Selected Day Events or Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedDate 
                  ? `Events on ${format(selectedDate, 'MMMM d, yyyy')}` 
                  : 'Upcoming Events'}
              </CardTitle>
              <CardDescription>
                {selectedDate 
                  ? `${selectedDateEvents.length} events scheduled` 
                  : 'Your next events'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(selectedDate ? selectedDateEvents : events.slice(0, 5)).map((event) => (
                  <div 
                    key={event.id} 
                    className={`rounded-md p-3 ${
                      event.priority === 'high' 
                        ? 'bg-timeflow-red/20 border-l-4 border-timeflow-red' 
                        : event.priority === 'medium'
                        ? 'bg-timeflow-blue/20 border-l-4 border-timeflow-blue'
                        : 'bg-timeflow-green/20 border-l-4 border-timeflow-green'
                    }`}
                  >
                    <div className="font-medium">{event.title}</div>
                    <div className="text-sm flex items-center mt-1">
                      <CalendarIcon className="mr-1 h-3 w-3" />
                      {event.date}
                    </div>
                    <div className="text-sm flex items-center mt-1">
                      <Clock className="mr-1 h-3 w-3" />
                      {event.time}
                    </div>
                  </div>
                ))}
                
                {(selectedDate ? selectedDateEvents.length === 0 : events.length === 0) && (
                  <div className="text-center py-6 text-muted-foreground">
                    No events scheduled
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Frequently used calendar actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-2">
                <Button 
                  variant="outline" 
                  className="justify-start"
                  onClick={() => handleQuickAction("Add Task")}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Task
                </Button>
                <Button 
                  variant="outline" 
                  className="justify-start"
                  onClick={() => handleQuickAction("View Week")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  View Week
                </Button>
                <Button 
                  variant="outline" 
                  className="justify-start"
                  onClick={() => handleQuickAction("Schedule Meeting")}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Schedule Meeting
                </Button>
                <Button 
                  variant="outline" 
                  className="justify-start"
                  onClick={() => handleQuickAction("Upload File")}
                >
                  <FileUp className="mr-2 h-4 w-4" />
                  Upload File
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
