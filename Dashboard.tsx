
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  BarChart3, 
  ArrowRight, 
  Users, 
  Plus, 
  Clock, 
  Filter, 
  MoreHorizontal,
  Briefcase,
  CalendarClock,
  Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { useProject } from "@/context/ProjectContext";
import { useUser } from "@/context/UserContext";
import { formatDate, getDaysLeft, getInitials } from "@/lib/utils";
import NewProjectModal from "@/components/NewProjectModal";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const Dashboard = () => {
  const { projects, teamMembers } = useProject();
  const { user, notifications } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  
  // Sort projects by date (most recent first)
  const recentProjects = [...projects].sort((a, b) => 
    new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  ).slice(0, 3);
  
  // Get projects with upcoming deadlines
  const upcomingDeadlines = [...projects]
    .filter(project => new Date(project.endDate) > new Date())
    .sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime())
    .slice(0, 3);
  
  // Get most active team members
  const topTeamMembers = [...teamMembers]
    .sort((a, b) => b.performance - a.performance)
    .slice(0, 4);
  
  // Recent notifications
  const recentNotifications = notifications.slice(0, 3);
  
  const handleMemberClick = (id: string) => {
    navigate(`/app/team/${id}`);
  };
  
  const handleProjectClick = (id: string) => {
    navigate(`/app/projects/${id}`);
  };
  
  const handleTeamMemberAction = (action: string, memberId: string) => {
    const member = teamMembers.find(m => m.id === memberId);
    if (!member) return;
    
    switch (action) {
      case 'viewProfile':
        navigate(`/app/team/${memberId}`);
        break;
      case 'assignTask':
        toast({
          title: "Assign Task",
          description: `You are assigning a task to ${member.name}`,
        });
        break;
      case 'sendEmail':
        toast({
          title: "Send Email",
          description: `Opening email to ${member.email}`,
        });
        break;
      default:
        break;
    }
  };
  
  const handleProjectAction = (action: string, projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;
    
    switch (action) {
      case 'editProject':
        toast({
          title: "Edit Project",
          description: `Editing ${project.name}`,
        });
        break;
      case 'changeStatus':
        toast({
          title: "Change Status",
          description: `Changing status for ${project.name}`,
        });
        break;
      case 'downloadReport':
        toast({
          title: "Download Report",
          description: `Downloading report for ${project.name}`,
        });
        break;
      default:
        break;
    }
  };

  return (
    <>
      <NewProjectModal open={isProjectModalOpen} onClose={() => setIsProjectModalOpen(false)} />
      
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400">Welcome back, {user?.name}!</p>
        </div>
        <Button 
          onClick={() => setIsProjectModalOpen(true)}
          className="bg-timeflow-primary hover:bg-timeflow-primary/90 text-black"
        >
          <Plus className="mr-2 h-4 w-4" /> New Project
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-timeflow-gray border-timeflow-lightgray">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-full bg-timeflow-blue/20 flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-timeflow-blue" />
              </div>
              <div className="flex flex-col items-end">
                <span className="text-2xl font-bold text-white">{projects.length}</span>
                <span className="text-sm text-gray-400">Projects</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-timeflow-gray border-timeflow-lightgray">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-full bg-timeflow-green/20 flex items-center justify-center">
                <Users className="h-6 w-6 text-timeflow-green" />
              </div>
              <div className="flex flex-col items-end">
                <span className="text-2xl font-bold text-white">{teamMembers.length}</span>
                <span className="text-sm text-gray-400">Team Members</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-timeflow-gray border-timeflow-lightgray">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-full bg-timeflow-red/20 flex items-center justify-center">
                <CalendarClock className="h-6 w-6 text-timeflow-red" />
              </div>
              <div className="flex flex-col items-end">
                <span className="text-2xl font-bold text-white">
                  {upcomingDeadlines.length > 0 ? getDaysLeft(upcomingDeadlines[0].endDate) : 0}
                </span>
                <span className="text-sm text-gray-400">Days to Next Deadline</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-timeflow-gray border-timeflow-lightgray">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-full bg-timeflow-purple/20 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-timeflow-purple" />
              </div>
              <div className="flex flex-col items-end">
                <span className="text-2xl font-bold text-white">
                  {user ? Math.round((user.completedTasks / user.totalTasks) * 100) : 0}%
                </span>
                <span className="text-sm text-gray-400">Task Completion</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <Card className="bg-timeflow-gray border-timeflow-lightgray h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-xl text-white">Project Progress</CardTitle>
                <CardDescription className="text-gray-400">
                  Recent project updates and status
                </CardDescription>
              </div>
              
              <div className="flex items-center space-x-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 bg-timeflow-lightgray text-gray-300 border-timeflow-lightgray">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48 p-2 bg-timeflow-gray border-timeflow-lightgray">
                    <div className="space-y-1">
                      <Button variant="ghost" size="sm" className="w-full justify-start text-gray-300">
                        All Projects
                      </Button>
                      <Button variant="ghost" size="sm" className="w-full justify-start text-gray-300">
                        In Progress
                      </Button>
                      <Button variant="ghost" size="sm" className="w-full justify-start text-gray-300">
                        On Hold
                      </Button>
                      <Button variant="ghost" size="sm" className="w-full justify-start text-gray-300">
                        Completed
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
                
                <Link to="/app/projects">
                  <Button variant="ghost" size="sm" className="text-timeflow-primary hover:text-timeflow-primary/80">
                    View All <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                {recentProjects.map((project) => (
                  <div 
                    key={project.id}
                    className="p-3 rounded-lg bg-timeflow-lightgray hover:bg-timeflow-lightgray/70 cursor-pointer project-card transition-colors"
                    onClick={() => handleProjectClick(project.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0 w-2 h-8 rounded-full bg-timeflow-blue"></div>
                        <div>
                          <h3 className="font-medium text-white">{project.name}</h3>
                          <p className="text-xs text-gray-400">{project.description}</p>
                        </div>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            className="h-8 w-8 p-0 text-gray-400 hover:text-white project-options opacity-0"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-timeflow-gray border-timeflow-lightgray">
                          <DropdownMenuItem 
                            className="text-gray-300 hover:text-white focus:text-white cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleProjectAction('editProject', project.id);
                            }}
                          >
                            Edit Project
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-gray-300 hover:text-white focus:text-white cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleProjectAction('changeStatus', project.id);
                            }}
                          >
                            Change Status
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-gray-300 hover:text-white focus:text-white cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleProjectAction('downloadReport', project.id);
                            }}
                          >
                            Download Report
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    
                    <div className="mb-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-400">Progress</span>
                        <span className="text-xs font-medium text-gray-300">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-1.5 bg-gray-700">
                        <div 
                          className="h-full bg-timeflow-primary animate-progress-flow"
                          style={{ width: `${project.progress}%` }}
                        />
                      </Progress>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex space-x-2">
                        <Badge className="bg-gray-700 text-gray-300 hover:bg-gray-700">{project.department}</Badge>
                        <Badge 
                          className={`${
                            project.status === 'In Progress' ? 'bg-timeflow-blue' :
                            project.status === 'On Hold' ? 'bg-yellow-500' :
                            project.status === 'Completed' ? 'bg-timeflow-green' : 
                            'bg-gray-500'
                          } text-white hover:bg-opacity-90`}
                        >
                          {project.status}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span className="text-gray-400">{formatDate(project.endDate)}</span>
                      </div>
                    </div>
                  </div>
                ))}
                
                {recentProjects.length === 0 && (
                  <div className="p-6 text-center">
                    <p className="text-gray-400">No projects found</p>
                    <Button 
                      onClick={() => setIsProjectModalOpen(true)}
                      variant="outline" 
                      className="mt-4 border-timeflow-primary text-timeflow-primary hover:bg-timeflow-primary/10"
                    >
                      Create Your First Project
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="bg-timeflow-gray border-timeflow-lightgray">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl text-white">Team Members</CardTitle>
              <Link to="/app/team">
                <Button variant="ghost" size="sm" className="text-timeflow-primary hover:text-timeflow-primary/80">
                  View All <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <CardDescription className="text-gray-400">
              Top performing team members
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              {topTeamMembers.map((member) => (
                <div 
                  key={member.id}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-timeflow-lightgray cursor-pointer team-member-card transition-colors"
                  onClick={() => handleMemberClick(member.id)}
                >
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <p className="font-medium text-white">{member.name}</p>
                      <p className="text-xs text-gray-400">{member.role}</p>
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        className="h-8 w-8 p-0 text-gray-400 hover:text-white member-options opacity-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-timeflow-gray border-timeflow-lightgray">
                      <DropdownMenuItem 
                        className="text-gray-300 hover:text-white focus:text-white cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTeamMemberAction('viewProfile', member.id);
                        }}
                      >
                        View Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-gray-300 hover:text-white focus:text-white cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTeamMemberAction('assignTask', member.id);
                        }}
                      >
                        Assign Task
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-gray-300 hover:text-white focus:text-white cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTeamMemberAction('sendEmail', member.id);
                        }}
                      >
                        Send Email
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          </CardContent>
          
          <CardFooter className="border-t border-timeflow-lightgray pt-4">
            <Button 
              className="w-full bg-timeflow-gray hover:bg-timeflow-lightgray text-gray-300 border border-timeflow-lightgray"
              onClick={() => navigate("/app/team")}
            >
              <Users className="mr-2 h-4 w-4" /> Manage Team
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="upcoming" className="w-full">
            <div className="flex items-center justify-between mb-4">
              <TabsList className="bg-timeflow-lightgray">
                <TabsTrigger 
                  value="upcoming"
                  className="data-[state=active]:bg-timeflow-primary data-[state=active]:text-black"
                >
                  Upcoming Deadlines
                </TabsTrigger>
                <TabsTrigger 
                  value="events"
                  className="data-[state=active]:bg-timeflow-primary data-[state=active]:text-black"
                >
                  Scheduled Events
                </TabsTrigger>
              </TabsList>
              
              <Button variant="outline" size="sm" className="bg-timeflow-gray border-timeflow-lightgray text-gray-300">
                <Plus className="mr-2 h-4 w-4" /> Add Event
              </Button>
            </div>
            
            <TabsContent value="upcoming" className="mt-0">
              <Card className="bg-timeflow-gray border-timeflow-lightgray">
                <CardContent className="p-4">
                  {upcomingDeadlines.length > 0 ? (
                    <div className="space-y-3">
                      {upcomingDeadlines.map((project) => {
                        const daysLeft = getDaysLeft(project.endDate);
                        
                        return (
                          <div 
                            key={project.id}
                            className="flex items-center justify-between p-3 rounded-lg bg-timeflow-lightgray cursor-pointer hover:bg-opacity-70"
                            onClick={() => handleProjectClick(project.id)}
                          >
                            <div className="flex items-center space-x-3">
                              <div 
                                className={`flex-shrink-0 w-1 h-12 rounded-full ${
                                  daysLeft <= 7 ? 'bg-timeflow-red' : 
                                  daysLeft <= 14 ? 'bg-yellow-500' : 
                                  'bg-timeflow-green'
                                }`}
                              ></div>
                              
                              <div>
                                <h3 className="font-medium text-white">{project.name}</h3>
                                <div className="flex items-center text-xs text-gray-400">
                                  <Clock className="mr-1 h-3 w-3" /> 
                                  {formatDate(project.endDate)}
                                </div>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <Badge 
                                className={`${
                                  daysLeft <= 7 ? 'bg-timeflow-red' : 
                                  daysLeft <= 14 ? 'bg-yellow-500' : 
                                  'bg-timeflow-green'
                                } text-white hover:bg-opacity-90`}
                              >
                                {daysLeft} {daysLeft === 1 ? 'day' : 'days'} left
                              </Badge>
                              <p className="text-xs text-gray-400 mt-1">Progress: {project.progress}%</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-6 text-center">
                      <p className="text-gray-400">No upcoming deadlines</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="events" className="mt-0">
              <Card className="bg-timeflow-gray border-timeflow-lightgray">
                <CardContent className="p-4">
                  <div className="p-6 text-center">
                    <CalendarClock className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-400">No events scheduled for today</p>
                    <Button 
                      variant="outline" 
                      className="mt-4 border-timeflow-primary text-timeflow-primary hover:bg-timeflow-primary/10"
                    >
                      <Plus className="mr-2 h-4 w-4" /> Schedule New Event
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <Card className="bg-timeflow-gray border-timeflow-lightgray">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl text-white">Notifications</CardTitle>
              <Button variant="ghost" size="sm" className="text-timeflow-primary hover:text-timeflow-primary/80">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
            <CardDescription className="text-gray-400">
              Recent updates and alerts
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              {recentNotifications.length > 0 ? (
                recentNotifications.map((notification) => (
                  <div key={notification.id} className="flex p-3 rounded-lg bg-timeflow-lightgray hover:bg-opacity-70 cursor-pointer">
                    <div className="flex-shrink-0 mr-3">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        notification.type === 'deadline' ? 'bg-timeflow-red/20 text-timeflow-red' : 
                        notification.type === 'task' ? 'bg-timeflow-blue/20 text-timeflow-blue' :
                        'bg-timeflow-green/20 text-timeflow-green'
                      }`}>
                        {notification.type === 'deadline' ? (
                          <Bell size={20} />
                        ) : notification.type === 'task' ? (
                          <CheckSquare size={20} />
                        ) : (
                          <Info size={20} />
                        )}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <p className="font-medium text-white">
                        {notification.title}
                        {!notification.read && <span className="ml-2 h-2 w-2 rounded-full bg-timeflow-primary inline-block"></span>}
                      </p>
                      <p className="text-sm text-gray-400">{notification.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(notification.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center">
                  <Bell className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-400">No new notifications</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

const CheckSquare = (props: { size?: number }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={props.size || 24} 
    height={props.size || 24} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <polyline points="9 11 12 14 22 4"></polyline>
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
  </svg>
);

const Info = (props: { size?: number }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={props.size || 24} 
    height={props.size || 24} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>
);

export default Dashboard;
