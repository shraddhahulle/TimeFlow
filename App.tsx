
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "@/context/UserContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { ProjectProvider } from "@/context/ProjectContext";

import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import Calendar from "./pages/Calendar";
import Team from "./pages/Team";
import TeamMemberProfile from "./pages/TeamMemberProfile";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import LandingPage from "./pages/LandingPage";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";

// New Feature Pages
import FeatureScheduling from "./pages/features/FeatureScheduling";
import FeatureGanttCharts from "./pages/features/FeatureGanttCharts";
import FeatureTeamCollaboration from "./pages/features/FeatureTeamCollaboration";
import FeatureProgressTracking from "./pages/features/FeatureProgressTracking";

// Modal Components
import AddTaskModal from "./components/modals/AddTaskModal";
import AddMemberModal from "./components/modals/AddMemberModal";
import SendEmailModal from "./components/modals/SendEmailModal";
import AssignTaskModal from "./components/modals/AssignTaskModal";
import UploadFileModal from "./components/modals/UploadFileModal";
import BulkTaskModal from "./components/modals/BulkTaskModal";
import ExportReportModal from "./components/modals/ExportReportModal";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <UserProvider>
        <ProjectProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                
                {/* Feature Pages */}
                <Route path="/features/scheduling" element={<FeatureScheduling />} />
                <Route path="/features/gantt-charts" element={<FeatureGanttCharts />} />
                <Route path="/features/team-collaboration" element={<FeatureTeamCollaboration />} />
                <Route path="/features/progress-tracking" element={<FeatureProgressTracking />} />
                
                <Route path="/app" element={<Layout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="projects" element={<Projects />} />
                  <Route path="projects/:id" element={<ProjectDetails />} />
                  <Route path="calendar" element={<Calendar />} />
                  <Route path="team" element={<Team />} />
                  <Route path="team/:id" element={<TeamMemberProfile />} />
                  <Route path="reports" element={<Reports />} />
                  <Route path="settings" element={<Settings />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </ProjectProvider>
      </UserProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
