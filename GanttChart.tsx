import { useState, useEffect } from "react";
import { format, addDays, differenceInDays, isWithinInterval, isSameDay, parseISO } from "date-fns";
import { CalendarRange, ChevronLeft, ChevronRight, Info, Check } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Task } from "@/context/ProjectContext";
import { useToast } from "@/hooks/use-toast";

type GanttChartProps = {
  tasks: Task[];
  startDate: string;
  endDate: string;
};

const GanttChart = ({ tasks, startDate, endDate }: GanttChartProps) => {
  const [visibleDays, setVisibleDays] = useState(14); // Number of days to show at once
  const [viewOffset, setViewOffset] = useState(0); // Days offset from the project start date
  const { toast } = useToast();
  
  const projectStartDate = new Date(startDate);
  const projectEndDate = new Date(endDate);
  
  const projectDuration = differenceInDays(projectEndDate, projectStartDate) + 1;
  
  const visibleStartDate = addDays(projectStartDate, viewOffset);
  const visibleEndDate = addDays(visibleStartDate, visibleDays - 1);
  
  const visibleDates = Array.from({ length: visibleDays }, (_, i) => 
    addDays(visibleStartDate, i)
  );
  
  const [animate, setAnimate] = useState(false);
  useEffect(() => {
    setAnimate(true);
    const timer = setTimeout(() => setAnimate(false), 500);
    return () => clearTimeout(timer);
  }, [viewOffset]);
  
  const handlePrevious = () => {
    const newOffset = Math.max(0, viewOffset - visibleDays);
    setViewOffset(newOffset);
  };
  
  const handleNext = () => {
    const newOffset = Math.min(projectDuration - visibleDays, viewOffset + visibleDays);
    setViewOffset(newOffset);
  };
  
  const handleViewChange = (days: number) => {
    setVisibleDays(days);
  };
  
  const getTaskColor = (task: Task) => {
    switch (task.status) {
      case "Completed":
        return "bg-timeflow-green";
      case "In Progress":
        return "bg-timeflow-blue";
      case "On Hold":
        return "bg-yellow-500";
      default:
        return "bg-timeflow-purple";
    }
  };
  
  const handleTaskClick = (task: Task) => {
    toast({
      title: task.title,
      description: (
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Status:</span> 
            <span className="font-medium">{task.status}</span>
          </div>
          <div className="flex justify-between">
            <span>Progress:</span> 
            <span className="font-medium">{task.progress}%</span>
          </div>
          <div className="flex justify-between">
            <span>Timeline:</span>
            <span className="font-medium">
              {format(parseISO(task.startDate), "MMM d")} - {format(parseISO(task.endDate), "MMM d, yyyy")}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Assigned:</span>
            <span className="font-medium">{task.assignedTo.length} team members</span>
          </div>
        </div>
      ),
    });
  };
  
  const isTaskVisible = (task: Task) => {
    const taskStart = new Date(task.startDate);
    const taskEnd = new Date(task.endDate);
    
    return (
      isWithinInterval(taskStart, { start: visibleStartDate, end: visibleEndDate }) ||
      isWithinInterval(taskEnd, { start: visibleStartDate, end: visibleEndDate }) ||
      (taskStart <= visibleStartDate && taskEnd >= visibleEndDate)
    );
  };
  
  const getTaskBarStyles = (task: Task) => {
    const taskStart = new Date(task.startDate);
    const taskEnd = new Date(task.endDate);
    
    const taskStartOffset = Math.max(0, differenceInDays(taskStart, visibleStartDate));
    const taskVisibleDuration = Math.min(
      differenceInDays(taskEnd, visibleStartDate) + 1 - taskStartOffset,
      visibleDays - taskStartOffset
    );
    
    const startPercent = (taskStartOffset / visibleDays) * 100;
    const widthPercent = (taskVisibleDuration / visibleDays) * 100;
    
    return {
      left: `${startPercent}%`,
      width: `${widthPercent}%`,
    };
  };
  
  const getTaskTooltipInfo = (task: Task) => {
    return (
      <div className="p-2 space-y-2">
        <div className="text-sm font-bold">{task.title}</div>
        <div className="text-xs">{task.description}</div>
        <div className="text-xs grid grid-cols-2 gap-1">
          <div>Status:</div>
          <div className="font-medium">{task.status}</div>
          <div>Start:</div>
          <div className="font-medium">{format(new Date(task.startDate), "MMM d, yyyy")}</div>
          <div>End:</div>
          <div className="font-medium">{format(new Date(task.endDate), "MMM d, yyyy")}</div>
          <div>Progress:</div>
          <div className="font-medium">{task.progress}%</div>
          {task.assignedTo.length > 0 && (
            <>
              <div>Assigned to:</div>
              <div className="font-medium">{task.assignedTo.length} team members</div>
            </>
          )}
          <div>Department:</div>
          <div className="font-medium">{task.department}</div>
          {task.priority && (
            <>
              <div>Priority:</div>
              <div className="font-medium">
                {task.priority === "high" ? "High" : 
                 task.priority === "medium" ? "Medium" : "Low"}
              </div>
            </>
          )}
        </div>
      </div>
    );
  };
  
  const sortedTasks = [...tasks].sort((a, b) => 
    new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );
  
  const visibleTasks = sortedTasks.filter(isTaskVisible);
  
  const getTodayPosition = () => {
    const today = new Date();
    if (isWithinInterval(today, { start: visibleStartDate, end: visibleEndDate })) {
      const offset = differenceInDays(today, visibleStartDate);
      return (offset / visibleDays) * 100;
    }
    return null;
  };
  
  const todayPosition = getTodayPosition();
  
  const calculateProjectProgress = () => {
    if (tasks.length === 0) return 0;
    
    const totalProgress = tasks.reduce((sum, task) => sum + task.progress, 0);
    return Math.round(totalProgress / tasks.length);
  };
  
  const tasksByStatus = tasks.reduce((acc, task) => {
    const status = task.status;
    if (!acc[status]) {
      acc[status] = [];
    }
    acc[status].push(task);
    return acc;
  }, {} as Record<string, Task[]>);
  
  return (
    <Card className="bg-timeflow-gray border-timeflow-lightgray">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <CalendarRange className="mr-2 h-5 w-5 text-timeflow-primary" /> 
            <CardTitle className="text-xl text-white">Project Timeline</CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex bg-timeflow-lightgray rounded-md overflow-hidden mr-2">
              <Button 
                variant="ghost" 
                size="sm"
                className={`h-8 ${visibleDays === 7 ? 'bg-timeflow-primary text-black' : 'text-gray-300'}`}
                onClick={() => handleViewChange(7)}
              >
                Week
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className={`h-8 ${visibleDays === 14 ? 'bg-timeflow-primary text-black' : 'text-gray-300'}`}
                onClick={() => handleViewChange(14)}
              >
                2 Weeks
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className={`h-8 ${visibleDays === 30 ? 'bg-timeflow-primary text-black' : 'text-gray-300'}`}
                onClick={() => handleViewChange(30)}
              >
                Month
              </Button>
            </div>
            <Button 
              variant="outline" 
              size="icon" 
              className="bg-timeflow-gray border-timeflow-lightgray text-gray-300 h-8 w-8"
              onClick={handlePrevious}
              disabled={viewOffset === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="bg-timeflow-gray border-timeflow-lightgray text-gray-300 h-8 w-8"
              onClick={handleNext}
              disabled={viewOffset >= projectDuration - visibleDays}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-white font-medium">Project Progress</h3>
            <span className="text-timeflow-primary font-medium">{calculateProjectProgress()}%</span>
          </div>
          <div className="h-2 w-full bg-timeflow-lightgray rounded-full overflow-hidden">
            <div 
              className="h-full bg-timeflow-primary rounded-full animate-pulse"
              style={{ width: `${calculateProjectProgress()}%` }}
            ></div>
          </div>
        </div>
      
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-timeflow-lightgray p-3 rounded-lg">
            <div className="text-xs text-gray-400">Total Tasks</div>
            <div className="text-lg font-medium text-white">{tasks.length}</div>
          </div>
          <div className="bg-timeflow-lightgray p-3 rounded-lg">
            <div className="text-xs text-gray-400">Completed</div>
            <div className="text-lg font-medium text-timeflow-green">
              {tasksByStatus["Completed"]?.length || 0}
            </div>
          </div>
          <div className="bg-timeflow-lightgray p-3 rounded-lg">
            <div className="text-xs text-gray-400">In Progress</div>
            <div className="text-lg font-medium text-timeflow-blue">
              {tasksByStatus["In Progress"]?.length || 0}
            </div>
          </div>
          <div className="bg-timeflow-lightgray p-3 rounded-lg">
            <div className="text-xs text-gray-400">On Hold/Planned</div>
            <div className="text-lg font-medium text-yellow-500">
              {(tasksByStatus["On Hold"]?.length || 0) + (tasksByStatus["Planned"]?.length || 0)}
            </div>
          </div>
        </div>

        <div className="mt-4 overflow-hidden">
          <div className="flex border-b border-timeflow-lightgray/50 pb-2">
            <div className="w-1/4 pr-2">
              <div className="text-sm font-medium text-gray-400">Task</div>
            </div>
            <div className="w-3/4 flex">
              {visibleDates.map((date, index) => (
                <div 
                  key={index}
                  className={`flex-1 text-center text-xs ${
                    isSameDay(date, new Date()) ? 'text-timeflow-primary font-medium' : 'text-gray-400'
                  }`}
                >
                  <div>{format(date, "d")}</div>
                  <div>{format(date, "EEE")}</div>
                </div>
              ))}
            </div>
          </div>
          
          {visibleTasks.length > 0 ? (
            <div className="mt-4 space-y-4">
              {visibleTasks.map((task) => (
                <div key={task.id} className="flex items-center group">
                  <div className="w-1/4 pr-2 text-sm text-white truncate">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center cursor-default">
                            <div 
                              className={`w-2 h-2 rounded-full mr-2 ${getTaskColor(task)}`}
                            ></div>
                            <span className="truncate">{task.title}</span>
                            {task.status === "Completed" && (
                              <Check className="h-3 w-3 text-timeflow-green ml-1" />
                            )}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          {getTaskTooltipInfo(task)}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="w-3/4 h-8 relative">
                    {todayPosition !== null && (
                      <div 
                        className="absolute top-0 h-8 w-px bg-timeflow-primary z-10"
                        style={{ left: `${todayPosition}%` }}
                      ></div>
                    )}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div 
                            className={`absolute top-2 h-4 rounded-full ${getTaskColor(task)} 
                                      opacity-80 hover:opacity-100 cursor-pointer transition-opacity
                                      ${animate ? 'animate-fade-in' : ''}`}
                            style={getTaskBarStyles(task)}
                            onClick={() => handleTaskClick(task)}
                          >
                            <div className="h-full flex items-center justify-center">
                              <div className="whitespace-nowrap text-[10px] font-medium text-white px-2 overflow-hidden">
                                {task.progress < 100 && <span>{task.progress}%</span>}
                              </div>
                            </div>
                            
                            <div 
                              className="absolute top-0 left-0 h-full bg-white opacity-30 rounded-l-full"
                              style={{ width: `${task.progress}%` }}
                            ></div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          {getTaskTooltipInfo(task)}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <Info className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-400">No tasks in the current view</p>
              </div>
            </div>
          )}
          
          <div className="mt-6 pt-4 border-t border-timeflow-lightgray/50">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-gray-400 mb-1">Project Timeline</div>
                <div className="text-sm text-white font-medium">
                  {format(projectStartDate, "MMM d, yyyy")} - {format(projectEndDate, "MMM d, yyyy")}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">Current View</div>
                <div className="text-sm text-white font-medium">
                  {format(visibleStartDate, "MMM d")} - {format(visibleEndDate, "MMM d, yyyy")}
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-timeflow-lightgray/50">
            <div className="text-sm text-gray-400 mb-2">Status Legend:</div>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-timeflow-green mr-2"></div>
                <span className="text-xs text-gray-300">Completed</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-timeflow-blue mr-2"></div>
                <span className="text-xs text-gray-300">In Progress</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                <span className="text-xs text-gray-300">On Hold</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-timeflow-purple mr-2"></div>
                <span className="text-xs text-gray-300">Planned</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GanttChart;
