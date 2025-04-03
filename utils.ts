import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function calculateProgress(startDate: string, endDate: string): number {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  const now = new Date().getTime();
  
  if (now <= start) return 0;
  if (now >= end) return 100;
  
  const totalDuration = end - start;
  const elapsed = now - start;
  return Math.floor((elapsed / totalDuration) * 100);
}

export function calculateTaskCompletion(tasks: any[]): number {
  if (!tasks || tasks.length === 0) return 0;
  
  const completedTasks = tasks.filter(task => task.status === "completed").length;
  return Math.floor((completedTasks / tasks.length) * 100);
}

export function getRandomColor(index: number) {
  const colors = ["#0E5BDE", "#00A389", "#E5484D", "#8E4EC6", "#F5A524", "#42A5F5"];
  return colors[index % colors.length];
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase();
}

export function getDaysLeft(endDate: string): number {
  const end = new Date(endDate).getTime();
  const now = new Date().getTime();
  const daysLeft = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
  return daysLeft > 0 ? daysLeft : 0;
}

export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'completed':
      return 'bg-timeflow-green';
    case 'in progress':
      return 'bg-timeflow-blue';
    case 'on hold':
      return 'bg-yellow-500';
    case 'delayed':
    case 'overdue':
      return 'bg-timeflow-red';
    case 'planned':
      return 'bg-timeflow-purple';
    default:
      return 'bg-gray-500';
  }
}

export function getDepartmentColor(department: string): string {
  switch (department.toLowerCase()) {
    case 'management':
      return 'bg-timeflow-blue';
    case 'design':
      return 'bg-timeflow-purple';
    case 'development':
      return 'bg-timeflow-green';
    case 'marketing':
      return 'bg-yellow-500';
    default:
      return 'bg-gray-500';
  }
}

// Get team member avatar URL
export function getTeamMemberAvatar(name: string, id: string): string {
  // Specific member avatars
  if (name === "Sarah Mitchell") {
    return "/lovable-uploads/9722a6cd-6a30-4c2a-ac4a-5f45162c65a4.png";
  }
  
  // For other members, return a placeholder based on member ID for consistency
  return `https://api.dicebear.com/7.x/avatars/svg?seed=${id}&size=64&backgroundColor=b6e3f4,c0aede,d1d4f9`;
}
