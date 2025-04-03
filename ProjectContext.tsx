import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import { v4 as uuidv4 } from "uuid";

export interface File {
  id: string;
  name: string;
  description?: string;
  type: string;
  size: number;
  uploadDate: string;
  url: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: "Planned" | "In Progress" | "On Hold" | "Completed";
  progress: number;
  department: string;
  assignedTo: string[];
  priority?: "low" | "medium" | "high";
}

export interface Project {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: "Planned" | "In Progress" | "On Hold" | "Completed";
  progress: number;
  department: string;
  team: string[];
  tasks: Task[];
  files?: File[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  avatar: string;
  email: string;
  tasks: number;
  completedTasks: number;
  performance: number;
  availability: "Available" | "Busy" | "In a meeting";
  projects: string[];
}

export interface Department {
  name: string;
  performance: number;
  color: string;
  members?: TeamMember[];
}

interface ProjectContextType {
  projects: Project[];
  teamMembers: TeamMember[];
  departments: Department[];
  getProject: (id: string) => Project | undefined;
  getTeamMember: (id: string) => TeamMember | undefined;
  getDepartment: (name: string) => Department | undefined;
  addProject: (project: Omit<Project, "id" | "tasks" | "team">) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  addTask: (projectId: string, task: Omit<Task, "id">) => void;
  updateTask: (
    projectId: string,
    taskId: string,
    updates: Partial<Task>
  ) => void;
  assignTask: (memberId: string, projectId: string, taskId: string) => void;
  addTeamMember: (member: Omit<TeamMember, "id" | "tasks" | "completedTasks">) => void;
  addFileToProject: (projectId: string, fileData: File) => void;
  filterProjects: (department: string) => Project[];
  createProject: (project: Omit<Project, "id" | "tasks" | "team">) => void;
  addTaskToProject: (projectId: string, task: Omit<Task, "id">) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

const initialProjects: Project[] = [
  {
    id: "1",
    name: "New Website Design",
    description:
      "Design a modern and user-friendly website for a new client. This project involves creating wireframes, mockups, and prototypes.",
    startDate: "2024-03-01",
    endDate: "2024-06-30",
    status: "In Progress",
    progress: 60,
    department: "Design",
    team: ["1", "2", "3"],
    tasks: [
      {
        id: "101",
        title: "Create Wireframes",
        description: "Develop initial wireframes for key website pages.",
        startDate: "2024-03-01",
        endDate: "2024-03-15",
        status: "Completed",
        progress: 100,
        department: "Design",
        assignedTo: ["1", "2"],
        priority: "high",
      },
      {
        id: "102",
        title: "Design Mockups",
        description: "Design high-fidelity mockups based on the approved wireframes.",
        startDate: "2024-03-16",
        endDate: "2024-04-15",
        status: "In Progress",
        progress: 75,
        department: "Design",
        assignedTo: ["1", "3"],
        priority: "high",
      },
      {
        id: "103",
        title: "Prototype Development",
        description: "Create an interactive prototype to showcase the website's functionality.",
        startDate: "2024-04-16",
        endDate: "2024-05-15",
        status: "Planned",
        progress: 0,
        department: "Development",
        assignedTo: [],
        priority: "medium",
      },
    ],
  },
  {
    id: "2",
    name: "Mobile App Development",
    description:
      "Develop a mobile app for iOS and Android platforms. This project includes designing the UI/UX, coding the app, and testing.",
    startDate: "2024-04-01",
    endDate: "2024-09-30",
    status: "Planned",
    progress: 20,
    department: "Development",
    team: ["4", "5", "6"],
    tasks: [
      {
        id: "201",
        title: "UI/UX Design",
        description: "Design the user interface and user experience for the mobile app.",
        startDate: "2024-04-01",
        endDate: "2024-05-01",
        status: "In Progress",
        progress: 50,
        department: "Design",
        assignedTo: ["4"],
        priority: "high",
      },
      {
        id: "202",
        title: "iOS App Development",
        description: "Code the mobile app for the iOS platform.",
        startDate: "2024-05-02",
        endDate: "2024-07-01",
        status: "Planned",
        progress: 0,
        department: "Development",
        assignedTo: [],
        priority: "high",
      },
      {
        id: "203",
        title: "Android App Development",
        description: "Code the mobile app for the Android platform.",
        startDate: "2024-07-02",
        endDate: "2024-09-01",
        status: "Planned",
        progress: 0,
        department: "Development",
        assignedTo: [],
        priority: "high",
      },
    ],
  },
  {
    id: "3",
    name: "Marketing Campaign",
    description:
      "Launch a marketing campaign to promote a new product. This project involves creating marketing materials, running ads, and tracking results.",
    startDate: "2024-05-01",
    endDate: "2024-08-31",
    status: "Planned",
    progress: 10,
    department: "Marketing",
    team: ["7", "8", "9"],
    tasks: [
      {
        id: "301",
        title: "Create Marketing Materials",
        description: "Design and produce marketing materials such as brochures and flyers.",
        startDate: "2024-05-01",
        endDate: "2024-05-31",
        status: "Planned",
        progress: 0,
        department: "Design",
        assignedTo: [],
        priority: "medium",
      },
      {
        id: "302",
        title: "Run Ads",
        description: "Run online ads to promote the new product.",
        startDate: "2024-06-01",
        endDate: "2024-07-31",
        status: "Planned",
        progress: 0,
        department: "Marketing",
        assignedTo: [],
        priority: "high",
      },
      {
        id: "303",
        title: "Track Results",
        description: "Track the results of the marketing campaign and make adjustments as needed.",
        startDate: "2024-08-01",
        endDate: "2024-08-31",
        status: "Planned",
        progress: 0,
        department: "Marketing",
        assignedTo: [],
        priority: "medium",
      },
    ],
  },
];

const initialTeamMembers: TeamMember[] = [
  {
    id: "1",
    name: "John Smith",
    role: "UI Designer",
    department: "Design",
    avatar: "https://api.dicebear.com/7.x/avatars/svg?seed=John&size=64&backgroundColor=b6e3f4,c0aede,d1d4f9",
    email: "john.smith@example.com",
    tasks: 15,
    completedTasks: 12,
    performance: 85,
    availability: "Available",
    projects: ["1"],
  },
  {
    id: "2",
    name: "Emily Johnson",
    role: "UX Designer",
    department: "Design",
    avatar: "https://api.dicebear.com/7.x/avatars/svg?seed=Emily&size=64&backgroundColor=b6e3f4,c0aede,d1d4f9",
    email: "emily.johnson@example.com",
    tasks: 12,
    completedTasks: 10,
    performance: 92,
    availability: "Busy",
    projects: ["1"],
  },
  {
    id: "3",
    name: "Michael Brown",
    role: "Frontend Developer",
    department: "Development",
    avatar: "https://api.dicebear.com/7.x/avatars/svg?seed=Michael&size=64&backgroundColor=b6e3f4,c0aede,d1d4f9",
    email: "michael.brown@example.com",
    tasks: 18,
    completedTasks: 15,
    performance: 78,
    availability: "In a meeting",
    projects: ["1"],
  },
  {
    id: "4",
    name: "Sarah Mitchell",
    role: "Mobile App Designer",
    department: "Design",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3",
    email: "sarah.mitchell@example.com",
    tasks: 14,
    completedTasks: 11,
    performance: 88,
    availability: "Available",
    projects: ["2"],
  },
  {
    id: "5",
    name: "David Lee",
    role: "iOS Developer",
    department: "Development",
    avatar: "https://api.dicebear.com/7.x/avatars/svg?seed=David&size=64&backgroundColor=b6e3f4,c0aede,d1d4f9",
    email: "david.lee@example.com",
    tasks: 20,
    completedTasks: 17,
    performance: 95,
    availability: "Busy",
    projects: ["2"],
  },
  {
    id: "6",
    name: "Linda Wilson",
    role: "Android Developer",
    department: "Development",
    avatar: "https://api.dicebear.com/7.x/avatars/svg?seed=Linda&size=64&backgroundColor=b6e3f4,c0aede,d1d4f9",
    email: "linda.wilson@example.com",
    tasks: 16,
    completedTasks: 13,
    performance: 82,
    availability: "In a meeting",
    projects: ["2"],
  },
  {
    id: "7",
    name: "Robert Taylor",
    role: "Marketing Manager",
    department: "Marketing",
    avatar: "https://api.dicebear.com/7.x/avatars/svg?seed=Robert&size=64&backgroundColor=b6e3f4,c0aede,d1d4f9",
    email: "robert.taylor@example.com",
    tasks: 13,
    completedTasks: 10,
    performance: 90,
    availability: "Available",
    projects: ["3"],
  },
  {
    id: "8",
    name: "Karen Garcia",
    role: "Content Creator",
    department: "Marketing",
    avatar: "https://api.dicebear.com/7.x/avatars/svg?seed=Karen&size=64&backgroundColor=b6e3f4,c0aede,d1d4f9",
    email: "karen.garcia@example.com",
    tasks: 11,
    completedTasks: 9,
    performance: 87,
    availability: "Busy",
    projects: ["3"],
  },
  {
    id: "9",
    name: "James Rodriguez",
    role: "SEO Specialist",
    department: "Marketing",
    avatar: "https://api.dicebear.com/7.x/avatars/svg?seed=James&size=64&backgroundColor=b6e3f4,c0aede,d1d4f9",
    email: "james.rodriguez@example.com",
    tasks: 17,
    completedTasks: 14,
    performance: 75,
    availability: "In a meeting",
    projects: ["3"],
  },
];

const initialDepartments: Department[] = [
  { name: "Design", performance: 88, color: "#FFCF00" },
  { name: "Development", performance: 92, color: "#0E5BDE" },
  { name: "Marketing", performance: 85, color: "#00A389" },
];

export const ProjectProvider = ({ children }: { children: React.ReactNode }) => {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(
    initialTeamMembers
  );
  const [departments, setDepartments] = useState<Department[]>(
    initialDepartments
  );

  useEffect(() => {
    // You can load data from local storage here if needed
  }, []);

  const getProject = useCallback(
    (id: string): Project | undefined =>
      projects.find((project) => project.id === id),
    [projects]
  );

  const getTeamMember = useCallback(
    (id: string): TeamMember | undefined =>
      teamMembers.find((member) => member.id === id),
    [teamMembers]
  );

  const getDepartment = useCallback(
    (name: string): Department | undefined =>
      departments.find((department) => department.name === name),
    [departments]
  );

  const addProject = (project: Omit<Project, "id" | "tasks" | "team">) => {
    const newProject: Project = {
      id: uuidv4(),
      ...project,
      tasks: [],
      team: [],
    };
    setProjects((prevProjects) => [...prevProjects, newProject]);
  };

  const createProject = addProject;

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.id === id ? { ...project, ...updates } : project
      )
    );
  };

  const addTask = (projectId: string, task: Omit<Task, "id">) => {
    const newTask: Task = {
      id: uuidv4(),
      ...task,
      assignedTo: [],
    };
    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.id === projectId
          ? { ...project, tasks: [...project.tasks, newTask] }
          : project
      )
    );
  };

  const addTaskToProject = addTask;

  const updateTask = (
    projectId: string,
    taskId: string,
    updates: Partial<Task>
  ) => {
    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.id === projectId
          ? {
              ...project,
              tasks: project.tasks.map((task) =>
                task.id === taskId ? { ...task, ...updates } : task
              ),
            }
          : project
      )
    );
  };

  const assignTask = (memberId: string, projectId: string, taskId: string) => {
    setProjects((prevProjects) =>
      prevProjects.map((project) => {
        if (project.id === projectId) {
          const updatedTasks = project.tasks.map((task) => {
            if (task.id === taskId) {
              return {
                ...task,
                assignedTo: [...task.assignedTo, memberId],
              };
            }
            return task;
          });

          return { ...project, tasks: updatedTasks };
        }
        return project;
      })
    );

    setTeamMembers((prevTeamMembers) =>
      prevTeamMembers.map((member) => {
        if (member.id === memberId) {
          return {
            ...member,
            tasks: member.tasks + 1,
            projects: member.projects.includes(projectId)
              ? member.projects
              : [...member.projects, projectId],
          };
        }
        return member;
      })
    );
  };

  const addTeamMember = (member: Omit<TeamMember, "id" | "tasks" | "completedTasks">) => {
    const newMember: TeamMember = {
      id: uuidv4(),
      ...member,
      tasks: 0,
      completedTasks: 0,
      projects: [],
    };
    setTeamMembers((prevTeamMembers) => [...prevTeamMembers, newMember]);
  };

  const addFileToProject = (projectId: string, fileData: File) => {
    setProjects(prevProjects => 
      prevProjects.map(project => 
        project.id === projectId
          ? {
              ...project,
              files: project.files ? [...project.files, fileData] : [fileData]
            }
          : project
      )
    );
  };

  const filterProjects = (department: string) => {
    return projects.filter((project) => project.department === department);
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        teamMembers,
        departments,
        getProject,
        getTeamMember,
        getDepartment,
        addProject,
        updateProject,
        addTask,
        updateTask,
        assignTask,
        addTeamMember,
        addFileToProject,
        filterProjects,
        createProject,
        addTaskToProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context;
};
